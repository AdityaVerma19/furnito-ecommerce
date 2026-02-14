import {
  ArrowLeft,
  LayoutDashboard,
  ClipboardList,
  Receipt,
  PackageCheck,
  Calendar,
  Download,
  Loader,
  AlertCircle,
  LogOut,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { getUserFromToken, logout } from "../utils/auth";
import { API_BASE_URL } from "../utils/api";

const formatCurrency = (value) => `INR ${Number(value || 0).toFixed(2)}`;

const formatDate = (dateValue) => {
  if (!dateValue) return "-";
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return "-";
  return date.toLocaleString("en-IN");
};

export function UserDashboard({ onNavigate, activeView = "dashboard" }) {
  const user = getUserFromToken();
  const [selectedView, setSelectedView] = useState(activeView);
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [downloadingOrderId, setDownloadingOrderId] = useState("");

  useEffect(() => {
    setSelectedView(activeView);
  }, [activeView]);

  useEffect(() => {
    if (!user) return;

    const token = localStorage.getItem("token");
    if (!token) return;

    let mounted = true;
    const fetchOrders = async () => {
      try {
        setIsLoading(true);
        setError("");
        const response = await fetch(`${API_BASE_URL}/api/orders/my`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json().catch(() => ({}));
        if (!response.ok) {
          throw new Error(data?.message || "Unable to fetch your orders.");
        }

        if (mounted) {
          setOrders(Array.isArray(data?.orders) ? data.orders : []);
        }
      } catch (fetchError) {
        if (mounted) {
          setError(fetchError?.message || "Unable to fetch your orders.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      mounted = false;
    };
  }, []);

  const paidOrders = useMemo(
    () => orders.filter((order) => order.paymentStatus === "paid"),
    [orders]
  );

  const handleDownloadBill = async (orderId) => {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please log in again to download bills.");
      return;
    }

    try {
      setDownloadingOrderId(orderId);
      setError("");

      const response = await fetch(`${API_BASE_URL}/api/orders/${orderId}/bill`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorPayload = await response.json().catch(() => ({}));
        throw new Error(errorPayload?.message || "Unable to download bill.");
      }

      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = downloadUrl;
      anchor.download = `furnito-bill-${orderId}.pdf`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (downloadError) {
      setError(downloadError?.message || "Unable to download bill.");
    } finally {
      setDownloadingOrderId("");
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] bg-gradient-to-b from-amber-50 via-white to-orange-50 px-4 py-8 sm:px-6 lg:px-8 dark:from-blue-950 dark:via-blue-900 dark:to-blue-900">
      <div className="mx-auto max-w-4xl">
        <button
          onClick={() => onNavigate?.("home")}
          className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-white px-4 py-2 text-sm font-medium text-amber-700 hover:bg-amber-50 dark:border-blue-700 dark:bg-blue-900 dark:text-amber-300 dark:hover:bg-blue-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </button>

        <div className="mt-4 overflow-hidden rounded-3xl border border-amber-100 bg-white shadow-xl dark:border-blue-800 dark:bg-blue-950/90">
          <div className="border-b border-amber-100 bg-gradient-to-r from-amber-600 to-orange-500 px-6 py-7 text-white dark:border-blue-800 dark:from-blue-900 dark:to-blue-800">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-100 dark:text-blue-200">
              Account Center
            </p>
            <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
              {user?.firstName ? `${user.firstName}'s Dashboard` : "Dashboard"}
            </h1>
            <p className="mt-2 text-sm text-amber-50/90 dark:text-blue-100/90">
              Access your account options in one clean place.
            </p>
          </div>

          <div className="space-y-4 p-6">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
              <button
                onClick={() => setSelectedView("dashboard")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  selectedView === "dashboard"
                    ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-blue-600 dark:bg-blue-800 dark:text-slate-100"
                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:text-amber-700 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white dark:hover:border-blue-600 dark:hover:text-slate-100"
                }`}
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </button>
              <button
                onClick={() => setSelectedView("orders")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  selectedView === "orders"
                    ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-blue-600 dark:bg-blue-800 dark:text-slate-100"
                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:text-amber-700 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white dark:hover:border-blue-600 dark:hover:text-slate-100"
                }`}
              >
                <ClipboardList className="h-4 w-4" />
                My Orders
              </button>
              <button
                onClick={() => setSelectedView("bills")}
                className={`inline-flex items-center justify-center gap-2 rounded-xl border px-3 py-2.5 text-sm font-semibold transition ${
                  selectedView === "bills"
                    ? "border-amber-300 bg-amber-50 text-amber-800 dark:border-blue-600 dark:bg-blue-800 dark:text-slate-100"
                    : "border-gray-200 bg-white text-gray-700 hover:border-amber-200 hover:text-amber-700 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white dark:hover:border-blue-600 dark:hover:text-slate-100"
                }`}
              >
                <Receipt className="h-4 w-4" />
                Download Bills
              </button>
            </div>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/50 dark:text-red-300">
                {error}
              </div>
            )}

            {!user ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5 text-sm text-amber-900 dark:border-blue-700 dark:bg-blue-900/50 dark:text-white">
                Please log in to view your dashboard, orders, and bills.
              </div>
            ) : (
              <>
                {selectedView === "dashboard" && (
                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 dark:border-blue-700 dark:bg-blue-900/60">
                      <p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-blue-200">
                        Total Orders
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">{orders.length}</p>
                    </div>
                    <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 dark:border-emerald-800 dark:bg-emerald-950/40">
                      <p className="text-xs font-semibold uppercase tracking-wide text-green-700 dark:text-emerald-300">
                        Paid Orders
                      </p>
                      <p className="mt-1 text-2xl font-bold text-gray-900 dark:text-slate-100">{paidOrders.length}</p>
                    </div>
                    <div className="rounded-xl border border-blue-200 bg-blue-50 px-4 py-3 dark:border-blue-700 dark:bg-blue-900/60">
                      <p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-200">
                        Last Order
                      </p>
                      <p className="mt-1 text-sm font-semibold text-gray-900 dark:text-slate-100">
                        {orders[0] ? formatDate(orders[0].createdAt) : "No orders yet"}
                      </p>
                    </div>
                  </div>
                )}

                {selectedView === "orders" && (
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-5 text-gray-700 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white">
                        <Loader className="h-4 w-4 animate-spin" />
                        Loading orders...
                      </div>
                    ) : orders.length ? (
                      orders.map((order) => (
                        <div
                          key={order._id}
                          className="rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-blue-800 dark:bg-blue-900/60"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                Order #{String(order._id).slice(-8).toUpperCase()}
                              </p>
                              <p className="mt-1 inline-flex items-center gap-1 text-xs text-gray-600 dark:text-white">
                                <Calendar className="h-3.5 w-3.5" />
                                {formatDate(order.createdAt)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-amber-700">
                                {formatCurrency(order.total)}
                              </p>
                              <p
                                className={`mt-1 rounded-full px-2 py-1 text-[11px] font-semibold ${
                                  order.paymentStatus === "paid"
                                    ? "bg-green-100 text-green-700 dark:bg-emerald-900/50 dark:text-emerald-300"
                                    : order.paymentStatus === "failed"
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300"
                                    : "bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300"
                                }`}
                              >
                                Payment: {order.paymentStatus}
                              </p>
                            </div>
                          </div>

                          <div className="mt-3 space-y-2">
                            {order.items?.map((item, index) => (
                              <div
                                key={`${order._id}-${item.productId}-${index}`}
                                className="flex items-center justify-between text-xs text-gray-700 dark:text-white"
                              >
                                <span className="inline-flex items-center gap-1">
                                  <PackageCheck className="h-3.5 w-3.5 text-amber-700" />
                                  {item.productName} x {item.quantity}
                                </span>
                                <span className="font-semibold text-gray-900 dark:text-slate-100">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="rounded-xl border border-gray-200 bg-white px-4 py-5 text-sm text-gray-600 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white">
                        No orders yet. Place an order to see it here.
                      </div>
                    )}
                  </div>
                )}

                {selectedView === "bills" && (
                  <div className="space-y-3">
                    {isLoading ? (
                      <div className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-5 text-gray-700 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white">
                        <Loader className="h-4 w-4 animate-spin" />
                        Loading bills...
                      </div>
                    ) : paidOrders.length ? (
                      paidOrders.map((order) => (
                        <div
                          key={order._id}
                          className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-200 bg-white px-4 py-4 dark:border-blue-800 dark:bg-blue-900/60"
                        >
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                              Bill #{String(order._id).slice(-8).toUpperCase()}
                            </p>
                            <p className="mt-1 text-xs text-gray-600 dark:text-white">
                              Paid on {formatDate(order.paidAt || order.createdAt)} |{" "}
                              {formatCurrency(order.total)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDownloadBill(order._id)}
                            disabled={downloadingOrderId === order._id}
                            className="inline-flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-100 disabled:cursor-not-allowed disabled:opacity-70 dark:border-blue-600 dark:bg-blue-800 dark:text-slate-100 dark:hover:bg-blue-700"
                          >
                            {downloadingOrderId === order._id ? (
                              <>
                                <Loader className="h-3.5 w-3.5 animate-spin" />
                                Preparing...
                              </>
                            ) : (
                              <>
                                <Download className="h-3.5 w-3.5" />
                                Download Bill
                              </>
                            )}
                          </button>
                        </div>
                      ))
                    ) : (
                      <div className="inline-flex w-full items-center gap-2 rounded-xl border border-gray-200 bg-white px-4 py-5 text-sm text-gray-600 dark:border-blue-800 dark:bg-blue-900/60 dark:text-white">
                        <AlertCircle className="h-4 w-4 text-amber-700" />
                        No paid orders available for bill download yet.
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            <button
              onClick={logout}
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700 transition hover:bg-red-100 dark:border-red-800 dark:bg-red-950/40 dark:text-red-300 dark:hover:bg-red-900/50"
            >
              <LogOut className="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
