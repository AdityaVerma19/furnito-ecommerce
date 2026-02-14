import crypto from "crypto";
import Order from "../middleware/models/Order.js";

const getRazorpayConfig = () => ({
  keyId: (process.env.RAZORPAY_KEY_ID || "").trim(),
  keySecret: (process.env.RAZORPAY_KEY_SECRET || "").trim(),
});

const isValidCustomerInfo = (customerInfo = {}) =>
  Boolean(
    customerInfo?.name?.trim() &&
      customerInfo?.email?.trim() &&
      customerInfo?.phone?.trim() &&
      customerInfo?.address?.trim()
  );

const normalizeItems = (items = []) =>
  items
    .filter((item) => item?.productId && item?.productName)
    .map((item) => ({
      productId: String(item.productId),
      productName: String(item.productName),
      price: Number(item.price) || 0,
      quantity: Number(item.quantity) || 0,
      image: item.image ? String(item.image) : "",
    }))
    .filter((item) => item.quantity > 0 && item.price >= 0);

const makeReceipt = () =>
  `FUR-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;

const createRazorpayOrderRequest = async ({
  keyId,
  keySecret,
  amount,
  currency,
  receipt,
  notes,
}) => {
  const authToken = Buffer.from(`${keyId}:${keySecret}`).toString("base64");
  const response = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${authToken}`,
    },
    body: JSON.stringify({
      amount,
      currency,
      receipt,
      notes,
    }),
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message =
      data?.error?.description ||
      data?.error?.reason ||
      "Failed to create Razorpay order.";
    throw new Error(message);
  }

  return data;
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { keyId, keySecret } = getRazorpayConfig();

    if (!keyId || !keySecret) {
      return res.status(500).json({
        message:
          "Razorpay is not configured on server. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET.",
      });
    }

    const { customerInfo, items, subtotal, shipping, total } = req.body;
    const normalizedItems = normalizeItems(items);

    if (!isValidCustomerInfo(customerInfo)) {
      return res.status(400).json({ message: "Complete customer details are required." });
    }

    if (!normalizedItems.length) {
      return res.status(400).json({ message: "At least one valid cart item is required." });
    }

    const parsedSubtotal = Number(subtotal);
    const parsedShipping = Number(shipping);
    const parsedTotal = Number(total);

    if (
      Number.isNaN(parsedSubtotal) ||
      Number.isNaN(parsedShipping) ||
      Number.isNaN(parsedTotal) ||
      parsedSubtotal < 0 ||
      parsedShipping < 0 ||
      parsedTotal <= 0
    ) {
      return res.status(400).json({ message: "Invalid order amount." });
    }

    const amountInPaise = Math.round(parsedTotal * 100);
    if (amountInPaise < 100) {
      return res.status(400).json({ message: "Minimum payable amount is INR 1." });
    }

    const receipt = makeReceipt();
    const razorpayOrder = await createRazorpayOrderRequest({
      keyId,
      keySecret,
      amount: amountInPaise,
      currency: "INR",
      receipt,
      notes: {
        userId: String(req.user.id),
      },
    });

    const order = await Order.create({
      user: req.user.id,
      receipt,
      items: normalizedItems,
      customerInfo: {
        name: customerInfo.name.trim(),
        email: customerInfo.email.trim().toLowerCase(),
        phone: customerInfo.phone.trim(),
        address: customerInfo.address.trim(),
      },
      subtotal: parsedSubtotal,
      shipping: parsedShipping,
      total: parsedTotal,
      currency: "INR",
      paymentStatus: "created",
      orderStatus: "created",
      razorpayOrderId: razorpayOrder.id,
    });

    return res.status(201).json({
      keyId,
      appOrderId: order._id,
      razorpayOrderId: razorpayOrder.id,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      receipt: razorpayOrder.receipt,
    });
  } catch (error) {
    console.error("createRazorpayOrder error:", error);
    return res.status(500).json({ message: "Unable to create payment order." });
  }
};

export const verifyRazorpayPayment = async (req, res) => {
  try {
    const { keySecret } = getRazorpayConfig();

    if (!keySecret) {
      return res.status(500).json({ message: "Razorpay secret is not configured." });
    }

    const {
      appOrderId,
      razorpay_order_id: razorpayOrderId,
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature,
    } = req.body;

    if (!appOrderId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return res.status(400).json({ message: "Payment verification payload is incomplete." });
    }

    const order = await Order.findOne({
      _id: appOrderId,
      user: req.user.id,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    if (order.paymentStatus === "paid") {
      return res.status(200).json({ message: "Payment already verified.", order });
    }

    if (order.razorpayOrderId !== razorpayOrderId) {
      return res.status(400).json({ message: "Order mismatch during payment verification." });
    }

    const generatedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    if (generatedSignature !== razorpaySignature) {
      order.paymentStatus = "failed";
      await order.save();
      return res.status(400).json({ message: "Invalid payment signature." });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.razorpayPaymentId = razorpayPaymentId;
    order.razorpaySignature = razorpaySignature;
    order.paidAt = new Date();
    await order.save();

    return res.status(200).json({
      message: "Payment verified successfully.",
      order,
    });
  } catch (error) {
    console.error("verifyRazorpayPayment error:", error);
    return res.status(500).json({ message: "Payment verification failed." });
  }
};
