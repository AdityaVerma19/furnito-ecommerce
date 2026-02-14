import { X, Mail, CheckCircle, Loader } from "lucide-react";
import { useState } from "react";
import { API_BASE_URL, loadExternalScript } from "../utils/api";

const formatInr = (value) => `INR ${Number(value || 0).toFixed(2)}`;

export function OrderConfirmation({
  isOpen,
  onClose,
  items,
  total,
  onOrderSuccess,
  onRequireAuth,
}) {
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const subtotal = items.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );
  const shipping = subtotal > 0 ? 50 : 0;
  const payableTotal = Number(total) || subtotal + shipping;
  const isBusy = isLoading || isVerifying;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in first to place an order.");
      if (typeof onRequireAuth === "function") {
        onRequireAuth();
      }
      return;
    }

    try {
      setIsLoading(true);
      await loadExternalScript("https://checkout.razorpay.com/v1/checkout.js");

      if (typeof window === "undefined" || !window.Razorpay) {
        throw new Error("Razorpay checkout failed to load. Please refresh and try again.");
      }

      const createOrderResponse = await fetch(`${API_BASE_URL}/api/payments/create-order`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          customerInfo,
          items: items.map((item) => ({
            productId: item.id,
            productName: item.name,
            price: Number(item.price),
            quantity: Number(item.quantity),
            image: item.image,
          })),
          subtotal,
          shipping,
          total: payableTotal,
        }),
      });

      const createOrderData = await createOrderResponse.json().catch(() => ({}));
      if (!createOrderResponse.ok) {
        throw new Error(createOrderData?.message || "Unable to start payment.");
      }

      const options = {
        key: createOrderData.keyId,
        amount: createOrderData.amount,
        currency: createOrderData.currency || "INR",
        name: "Furnito",
        description: "Furniture Order Payment",
        order_id: createOrderData.razorpayOrderId,
        prefill: {
          name: customerInfo.name,
          email: customerInfo.email,
          contact: customerInfo.phone,
        },
        notes: {
          appOrderId: createOrderData.appOrderId,
        },
        theme: {
          color: "#d97706",
        },
        modal: {
          ondismiss: () => {
            setError("Payment cancelled. You can try again anytime.");
          },
        },
        handler: async (response) => {
          try {
            setIsVerifying(true);
            setError("");

            const verifyResponse = await fetch(`${API_BASE_URL}/api/payments/verify`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                appOrderId: createOrderData.appOrderId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyResponse.json().catch(() => ({}));
            if (!verifyResponse.ok) {
              throw new Error(verifyData?.message || "Payment verification failed.");
            }

            setIsSubmitted(true);
            setTimeout(() => {
              setIsSubmitted(false);
              setCustomerInfo({ name: "", email: "", phone: "", address: "" });
              if (typeof onOrderSuccess === "function") {
                onOrderSuccess();
              }
              onClose();
            }, 2500);
          } catch (verifyError) {
            setError(verifyError?.message || "Payment verification failed.");
          } finally {
            setIsVerifying(false);
          }
        },
      };

      const razorpayCheckout = new window.Razorpay(options);
      razorpayCheckout.on("payment.failed", (failedResponse) => {
        setError(
          failedResponse?.error?.description || "Payment failed. Please try another payment method."
        );
      });
      razorpayCheckout.open();
    } catch (err) {
      setError(err?.message || "Unable to start payment.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose} />
      <div className="fixed inset-4 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:w-full md:max-w-2xl bg-white rounded-lg shadow-2xl z-50 overflow-hidden flex flex-col max-h-[95vh]">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">Complete Your Order</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          {isSubmitted ? (
            <div className="text-center py-8 md:py-12">
              <CheckCircle className="w-16 h-16 md:w-20 md:h-20 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">Order Placed Successfully!</h3>
              <p className="text-gray-600 text-sm md:text-base">
                Payment is verified and your order is saved in My Orders. You can download its bill from Download Bills.
              </p>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="bg-gray-50 rounded-lg p-3 md:p-4 space-y-2">
                  {items.map(item => (
                    <div key={item.id} className="flex justify-between text-sm md:text-base">
                      <span className="text-gray-700">{item.name} x {item.quantity}</span>
                      <span className="font-medium text-gray-900">{formatInr(item.price * item.quantity)}</span>
                    </div>
                  ))}
                  <div className="border-t border-gray-300 pt-2 mt-2 flex justify-between font-bold text-base md:text-lg">
                    <span>Total</span>
                    <span className="text-amber-700">{formatInr(payableTotal)}</span>
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm md:text-base text-gray-700 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={customerInfo.name}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm md:text-base"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm md:text-base text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={customerInfo.email}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm md:text-base"
                    placeholder="john@example.com"
                  />
                </div>

                <div>
                  <label htmlFor="phone" className="block text-sm md:text-base text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    required
                    value={customerInfo.phone}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm md:text-base"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm md:text-base text-gray-700 mb-2">
                    Delivery Address *
                  </label>
                  <textarea
                    id="address"
                    required
                    value={customerInfo.address}
                    onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                    rows={3}
                    className="w-full px-3 md:px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-600 text-sm md:text-base"
                    placeholder="123 Main St, Apt 4, New York, NY 10001"
                  />
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 md:p-4 flex items-start space-x-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-xs md:text-sm text-blue-800">
                    You will be redirected to Razorpay secure checkout. After successful payment, your order will be stored in your account.
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isBusy}
                  className="w-full bg-amber-600 hover:bg-amber-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white py-3 md:py-4 rounded-lg transition-colors font-medium text-base md:text-lg flex items-center justify-center space-x-2"
                >
                  {isBusy ? (
                    <>
                      <Loader className="w-5 h-5 animate-spin" />
                      <span>{isVerifying ? "Verifying Payment..." : "Preparing Payment..."}</span>
                    </>
                  ) : (
                    <span>Place Order</span>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </>
  );
}
