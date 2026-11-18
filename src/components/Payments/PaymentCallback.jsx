import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, Clock3, Loader2, XCircle } from "lucide-react";
import { verifyPayment } from "../../api/payments.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import { formatNaira } from "../../utils/format.js";
import BackButton from "../Shared/BackButton.jsx";

const PaymentCallback = () => {
  const [params] = useSearchParams();
  const reference = params.get("reference") || "";
  const { clearCartLocal } = useGlobalContext();
  const [status, setStatus] = useState("loading");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const clearedRef = useRef(false);

  const confirm = useCallback(async () => {
    if (!reference) {
      setError("Paystack did not return a payment reference.");
      setStatus("failed");
      return;
    }

    setStatus("loading");
    setError("");

    try {
      const data = await verifyPayment(reference);
      setOrder(data);

      if (String(data?.status) === "paid") {
        if (!clearedRef.current) {
          clearCartLocal();
          clearedRef.current = true;
        }
        setStatus("success");
      } else {
        setStatus("pending");
      }
    } catch (err) {
      setError(err.message || "Unable to confirm your payment.");
      setStatus("failed");
    }
  }, [reference, clearCartLocal]);

  useEffect(() => {
    confirm();
  }, [confirm]);

  let icon = <Loader2 className="h-8 w-8 animate-spin text-[#1ABC9C]" />;
  let heading = "Confirming your payment";
  let message = "Please wait while we verify your transaction with Paystack.";

  if (status === "success") {
    icon = <CheckCircle2 className="h-8 w-8 text-[#1ABC9C]" />;
    heading = "Payment successful";
    message = "Your order has been confirmed. Thanks for ordering from Kukin.";
  } else if (status === "pending") {
    icon = <Clock3 className="h-8 w-8 text-[#F39C12]" />;
    heading = "Payment received";
    message =
      "We are still confirming this payment. Your order will update shortly.";
  } else if (status === "failed") {
    icon = <XCircle className="h-8 w-8 text-red-400" />;
    heading = "We could not confirm this payment";
    message = error;
  }

  return (
    <div className="container flex min-h-[65vh] items-center justify-center py-12 text-[#CED4DA]">
      <div className="w-full max-w-lg rounded-3xl bg-[#1E1E2F] p-8 text-center shadow-2xl ring-1 ring-white/10">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1ABC9C]/15">
          {icon}
        </div>

        <h1 className="text-2xl font-extrabold">{heading}</h1>
        <p className="mt-2 text-sm leading-6 text-[#CED4DA]/70">{message}</p>

        {reference ? (
          <p className="mt-4 break-all rounded-xl bg-black/20 px-3 py-2 text-xs text-[#CED4DA]/55">
            Reference: {reference}
          </p>
        ) : null}

        {order && status === "success" ? (
          <p className="mt-3 text-lg font-bold text-[#1ABC9C]">
            {formatNaira(order.total)}
          </p>
        ) : null}

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {status === "pending" || status === "failed" ? (
            <button
              type="button"
              onClick={confirm}
              className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white transition hover:bg-[#16a085]"
            >
              Try again
            </button>
          ) : null}

          <Link
            to="/orders"
            className="rounded-full border border-[#1ABC9C]/50 px-6 py-2.5 font-bold text-[#1ABC9C] transition hover:bg-[#1ABC9C]/10"
          >
            View orders
          </Link>
        </div>

        <div className="mt-6 flex justify-center">
          <BackButton to="/menu" label="Back to menu" />
        </div>
      </div>
    </div>
  );
};

export default PaymentCallback;
