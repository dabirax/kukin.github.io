import { useEffect, useState } from "react";
import { useGlobalContext } from "../../useGlobalContext.js";
import { useAuth } from "../../auth/useAuth.js";
import { getPaymentQuote, initializePayment } from "../../api/payments.js";
import Button from "../Shared/Button";
import { formatNaira } from "../../utils/format.js";

const cartKeyFor = (cart) =>
  JSON.stringify(
    cart
      .map((item) => [Number(item.id), Number(item.amount)])
      .sort((a, b) => a[0] - b[0])
  );

const OrderSummary = () => {
  const {
    cart,
    subtotal,
    notify,
    syncedCartKey,
    cartSyncError,
    retryCartSync,
  } = useGlobalContext();
  const { isAuthenticated, initializing, openAuth } = useAuth();
  const cartKey = cartKeyFor(cart);
  const canFetchQuote = !initializing && isAuthenticated;
  const signedOut = !initializing && !isAuthenticated;
  const quoteIsSynced = cartKey !== "[]" && syncedCartKey === cartKey;

  const [quote, setQuote] = useState(null);
  const [loadingQuote, setLoadingQuote] = useState(true);
  const [quoteRefresh, setQuoteRefresh] = useState(0);
  const [checkingOut, setCheckingOut] = useState(false);

  useEffect(() => {
    if (!canFetchQuote || !quoteIsSynced) {
      setQuote(null);
      setLoadingQuote(false);
      return undefined;
    }

    let active = true;
    setLoadingQuote(true);

    const timer = window.setTimeout(() => {
      getPaymentQuote()
        .then((data) => {
          if (active) setQuote(data);
        })
        .catch((error) => {
          if (!active) return;
          setQuote(null);
          if (error?.status !== 401) {
            notify(error.message || "Unable to calculate your order total.");
          }
        })
        .finally(() => {
          if (active) setLoadingQuote(false);
        });
    }, 700);

    return () => {
      active = false;
      window.clearTimeout(timer);
    };
  }, [canFetchQuote, quoteIsSynced, notify, quoteRefresh]);

  const quoteIsCurrent =
    quote && !loadingQuote && Number(quote.subtotal) === Number(subtotal);

  const displaySubtotal = quoteIsCurrent ? quote.subtotal : subtotal;
  const deliveryFee = quoteIsCurrent ? quote.deliveryFee : 0;
  const total = quoteIsCurrent ? quote.total : subtotal;
  const amountText = (value) => (quoteIsCurrent ? formatNaira(value) : "—");

  let buttonText = "Check out";
  if (signedOut) buttonText = "Sign in";
  else if (checkingOut) buttonText = "Redirecting...";

  const handleCheckout = async () => {
    if (!isAuthenticated) {
      openAuth("login", { notice: "Sign in before checking out." });
      return;
    }

    if (loadingQuote || !quoteIsCurrent || !quoteIsSynced) {
      notify("Updating your order total. Please wait a moment.");
      return;
    }

    setCheckingOut(true);

    try {
      const data = await initializePayment();
      window.location.assign(data.authorizationUrl);
    } catch (error) {
      notify(error.message || "Unable to start checkout. Please try again.");
      setCheckingOut(false);
    }
  };

  return (
    <div className="bg-slate-800 text-[#CED4DA] p-4 rounded-lg shadow-lg">
      <div>
        <h1 className="underline font-semibold text-2xl text-center">
          Order Summary
        </h1>
      </div>

      <div className="mt-4">
        <div className="mb-4">
          <p className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{formatNaira(displaySubtotal)}</span>
          </p>
          <p className="flex justify-between mb-2">
            <span>Delivery:</span>
            <span>{amountText(deliveryFee)}</span>
          </p>
          {initializing || (canFetchQuote && !quoteIsSynced && !cartSyncError) ? (
            <p className="text-xs text-[#CED4DA]/50">Saving cart...</p>
          ) : null}
          {canFetchQuote && quoteIsSynced && loadingQuote ? (
            <p className="text-xs text-[#CED4DA]/50">Updating total...</p>
          ) : null}
          {signedOut ? (
            <p className="text-xs text-[#CED4DA]/60">
              Sign in to see delivery and checkout.
            </p>
          ) : null}
          {cartSyncError ? (
            <div className="mt-1 flex flex-wrap items-center gap-2">
              <p className="text-xs text-red-400">Could not save your cart.</p>
              <button
                type="button"
                onClick={retryCartSync}
                className="text-xs font-bold text-[#1ABC9C] hover:underline"
              >
                Retry
              </button>
            </div>
          ) : null}
          {!signedOut &&
          !cartSyncError &&
          quoteIsSynced &&
          !quote &&
          !loadingQuote ? (
            <button
              type="button"
              onClick={() => setQuoteRefresh((value) => value + 1)}
              className="text-xs font-bold text-[#1ABC9C] hover:underline"
            >
              Recalculate total
            </button>
          ) : null}
          <label>PromoCode: </label>
          <input
            type="text"
            placeholder="Enter Promo Code"
            className=" bg-white text-black rounded-md p-2 w-full mt-2"
          />
        </div>

        <div>
          <p className="flex justify-between mb-2">
            <span>Total:</span>
            <span>{amountText(total)}</span>{" "}
          </p>
          <div className="flex justify-end items-center">
            <Button
              text={buttonText}
              bgColor="bg-[#1ABC9C]/50"
              textColor={`text-[#CED4DA] dark:text-gray-800/70 `}
              handler={handleCheckout}
              disabled={
                !signedOut &&
                (loadingQuote || !quoteIsSynced || !quoteIsCurrent)
              }
              loading={checkingOut}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
