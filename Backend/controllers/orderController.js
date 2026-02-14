import Order from "../middleware/models/Order.js";
import PDFDocument from "pdfkit";

const formatCurrency = (value) => `INR ${Number(value || 0).toFixed(2)}`;
const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN");
};

const createInvoicePdf = (order) =>
  new Promise((resolve, reject) => {
    const doc = new PDFDocument({ size: "A4", margin: 50 });
    const chunks = [];
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;

    const drawDivider = () => {
      const y = doc.y;
      doc
        .moveTo(doc.page.margins.left, y)
        .lineTo(doc.page.width - doc.page.margins.right, y)
        .strokeColor("#E5E7EB")
        .stroke();
      doc.moveDown(0.8);
    };

    const drawItemsHeader = (y) => {
      const columns = {
        item: doc.page.margins.left,
        qty: doc.page.margins.left + 280,
        unitPrice: doc.page.margins.left + 340,
        amount: doc.page.margins.left + 430,
      };

      doc
        .rect(doc.page.margins.left, y - 4, pageWidth, 20)
        .fill("#FFF7ED")
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text("Item", columns.item + 4, y, { width: 260 })
        .text("Qty", columns.qty, y, { width: 50 })
        .text("Unit Price", columns.unitPrice, y, { width: 80 })
        .text("Amount", columns.amount, y, { width: 80, align: "right" });

      return { columns, nextY: y + 22 };
    };

    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc
      .fillColor("#B45309")
      .font("Helvetica-Bold")
      .fontSize(30)
      .text("FURNITO", { align: "center" });

    doc
      .moveDown(0.2)
      .fillColor("#4B5563")
      .font("Helvetica")
      .fontSize(11)
      .text("Premium Furniture and Home Decor", { align: "center" });

    doc.moveDown(1);
    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(16)
      .text("PAYMENT BILL / INVOICE");

    doc
      .moveDown(0.3)
      .fillColor("#6B7280")
      .font("Helvetica")
      .fontSize(10)
      .text(`Generated on: ${formatDate(new Date())}`);

    drawDivider();

    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Order Details");

    const orderDetails = [
      ["Bill ID", String(order._id)],
      ["Order Date", formatDate(order.createdAt)],
      ["Receipt", order.receipt || "-"],
      ["Payment Status", order.paymentStatus || "-"],
      ["Order Status", order.orderStatus || "-"],
      ["Payment ID", order.razorpayPaymentId || "-"],
    ];

    doc.moveDown(0.3);
    orderDetails.forEach(([label, value]) => {
      doc
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(`${label}: `, { continued: true });
      doc
        .fillColor("#374151")
        .font("Helvetica")
        .fontSize(10)
        .text(value || "-");
    });

    doc.moveDown(0.6);
    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Customer Details");

    const customerDetails = [
      ["Name", order.customerInfo?.name || "-"],
      ["Email", order.customerInfo?.email || "-"],
      ["Phone", order.customerInfo?.phone || "-"],
      ["Address", order.customerInfo?.address || "-"],
    ];

    doc.moveDown(0.3);
    customerDetails.forEach(([label, value]) => {
      doc
        .fillColor("#111827")
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(`${label}: `, { continued: true });
      doc
        .fillColor("#374151")
        .font("Helvetica")
        .fontSize(10)
        .text(value || "-");
    });

    doc.moveDown(0.8);
    doc
      .fillColor("#111827")
      .font("Helvetica-Bold")
      .fontSize(12)
      .text("Items");

    let cursorY = doc.y + 6;
    let { columns, nextY } = drawItemsHeader(cursorY);
    cursorY = nextY;

    (order.items || []).forEach((item) => {
      const itemName = item?.productName || "-";
      const itemHeight = Math.max(
        18,
        doc.heightOfString(itemName, { width: 250, align: "left" }) + 4
      );

      if (cursorY + itemHeight > doc.page.height - doc.page.margins.bottom - 110) {
        doc.addPage();
        cursorY = doc.page.margins.top;
        ({ columns, nextY } = drawItemsHeader(cursorY));
        cursorY = nextY;
      }

      doc
        .fillColor("#374151")
        .font("Helvetica")
        .fontSize(10)
        .text(itemName, columns.item + 4, cursorY, { width: 250 })
        .text(String(item?.quantity || 0), columns.qty, cursorY, { width: 50 })
        .text(formatCurrency(item?.price || 0), columns.unitPrice, cursorY, {
          width: 80,
        })
        .text(
          formatCurrency((Number(item?.price) || 0) * (Number(item?.quantity) || 0)),
          columns.amount,
          cursorY,
          { width: 80, align: "right" }
        );

      cursorY += itemHeight;
    });

    doc.y = cursorY + 8;
    drawDivider();

    const totals = [
      ["Subtotal", formatCurrency(order.subtotal)],
      ["Shipping", formatCurrency(order.shipping)],
      ["Total Paid", formatCurrency(order.total)],
    ];

    let totalY = doc.y;
    totals.forEach(([label, value], index) => {
      const isGrandTotal = index === totals.length - 1;
      const fontName = isGrandTotal ? "Helvetica-Bold" : "Helvetica";
      const fontSize = isGrandTotal ? 12 : 10;

      doc
        .fillColor("#111827")
        .font(fontName)
        .fontSize(fontSize)
        .text(`${label}:`, doc.page.margins.left + 300, totalY, {
          width: 90,
          align: "right",
        })
        .text(value, doc.page.margins.left + 395, totalY, {
          width: 110,
          align: "right",
        });

      totalY += isGrandTotal ? 20 : 16;
    });

    doc.y = totalY + 8;
    drawDivider();

    doc
      .fillColor("#6B7280")
      .font("Helvetica")
      .fontSize(9)
      .text(
        "Thank you for shopping with Furnito. Keep this invoice for your records.",
        { align: "center" }
      );

    doc.end();
  });

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({ orders });
  } catch (error) {
    console.error("getMyOrders error:", error);
    return res.status(500).json({ message: "Unable to fetch orders." });
  }
};

export const downloadOrderBill = async (req, res) => {
  try {
    const { orderId } = req.params;

    const order = await Order.findOne({
      _id: orderId,
      user: req.user.id,
    }).lean();

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    const pdfBuffer = await createInvoicePdf(order);
    const filename = `furnito-bill-${order._id}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);
    return res.status(200).send(pdfBuffer);
  } catch (error) {
    console.error("downloadOrderBill error:", error);
    return res.status(500).json({ message: "Unable to generate bill." });
  }
};
