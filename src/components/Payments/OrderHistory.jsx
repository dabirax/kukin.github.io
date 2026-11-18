import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Loader2, Package, ReceiptText, RotateCcw } from "lucide-react";
import { getOrders } from "../../api/payments.js";
import { formatDate, formatNaira } from "../../utils/format.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import BackButton from "../Shared/BackButton.jsx";

const statusStyles = {
  paid: "bg-[#1ABC9C]/15 text-[#1ABC9C]",
  pending: "bg-[#F39C12]/15 text-[#F39C12]",
  failed: "bg-red-500/15 text-red-400",
};

const OrderHistory = () => {
  const { reorder, notify } = useGlobalContext();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reorderingRef, setReorderingRef] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const data = await getOrders();
      setOrders(Array.isArray(data?.orders) ? data.orders : []);
    } catch (err) {
      setError(err.message || "Unable to load your orders.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleReorder = async (order) => {
    if (reorderingRef) return;

    setReorderingRef(order.reference);

    try {
      await reorder(order.items);
    } catch (err) {
      notify(err.message || "Unable to reorder this order. Please try again.");
    } finally {
      setReorderingRef("");
    }
  };

  return (
    <div className="container pb-10 text-[#CED4DA]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton label="Go back" />
        <div>
          <h1 className="text-3xl font-extrabold sm:text-4xl">Your orders</h1>
          <p className="mt-1 text-sm text-[#CED4DA]/60">
            Every payment you have made on Kukin.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="flex min-h-[40vh] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-[#1ABC9C]" />
        </div>
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-[#1E1E2F]/60 p-8 text-center">
          <p className="text-[#CED4DA]/75">{error}</p>
          <button
            type="button"
            onClick={load}
            className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
          >
            Try again
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-[#1E1E2F]/60 p-8 text-center">
          <Package className="h-10 w-10 text-[#1ABC9C]" />
          <h2 className="text-xl font-bold">No orders yet</h2>
          <p className="text-sm text-[#CED4DA]/65">
            Your paid orders will appear here once you check out.
          </p>
          <Link
            to="/menu"
            className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
          >
            Browse the menu
          </Link>
        </div>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {orders.map((order) => (
            <article
              key={order.id || order.reference}
              className="rounded-3xl bg-[#1E1E2F] p-6 shadow-2xl ring-1 ring-white/10"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="flex items-center gap-2 text-lg font-bold">
                    <ReceiptText className="h-5 w-5 text-[#1ABC9C]" />
                    {order.reference}
                  </p>
                  <p className="mt-1 text-xs text-[#CED4DA]/55">
                    {formatDate(order.createdAt)}
                  </p>
                </div>

                <span
                  className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                    statusStyles[order.status] || statusStyles.pending
                  }`}
                >
                  {order.status}
                </span>
              </div>

              <ul className="mt-4 space-y-1 text-sm text-[#CED4DA]/70">
                {(order.items || []).map((item) => (
                  <li key={item.productId} className="flex justify-between gap-3">
                    <span>
                      {item.name} × {item.amount}
                    </span>
                    <span>{formatNaira(item.lineTotal)}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-4 flex flex-wrap items-end justify-between gap-3 border-t border-white/10 pt-4">
                <div className="text-xs text-[#CED4DA]/55">
                  Delivery {formatNaira(order.deliveryFee)}
                  <div className="mt-1 text-lg font-extrabold text-[#1ABC9C]">
                    {formatNaira(order.total)}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleReorder(order)}
                  disabled={Boolean(reorderingRef)}
                  aria-label={`Reorder ${order.reference}`}
                  className="inline-flex items-center gap-2 rounded-full bg-[#1ABC9C] px-5 py-2 text-sm font-bold text-white transition hover:bg-[#16a085] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {reorderingRef === order.reference ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <RotateCcw className="h-4 w-4" />
                  )}
                  {reorderingRef === order.reference ? "Adding..." : "Reorder"}
                </button>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
