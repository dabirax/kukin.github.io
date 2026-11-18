
import { useEffect } from "react";
import { useGlobalContext } from "../../useGlobalContext.js";
import { FaTimes } from "react-icons/fa";
import CartItems from "./CartItems";
import { CartIcon } from "../Navbar/RightBar/cartIcon";
import OrderSummary from "./OrderSummary";

const Cart = () => {
  const { isCartOpen, closeCart, cart } = useGlobalContext();

  useEffect(() => {
    if (!isCartOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event) => {
      if (event.key === "Escape") closeCart();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isCartOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-800 items-center justify-center bg-slate-950/60 p-3 backdrop-blur-sm sm:p-4 ${
        isCartOpen ? "flex" : "hidden"
      }`}
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) closeCart();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="relative flex max-h-[90dvh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl bg-[#CED4DA] p-4 shadow-2xl sm:p-5 lg:h-[75dvh] lg:w-[75vw]"
      >
        <div className="mb-4 flex w-full pr-10">
          <div className="flex w-full items-center justify-center gap-3">
            <CartIcon color="dark" />
            <span
              id="cart-title"
              className="text-2xl font-extrabold text-slate-800 sm:text-3xl"
            >
              Cart
            </span>
          </div>

          <button
            type="button"
            aria-label="Close cart"
            className="absolute right-3 top-3 text-2xl text-red-500 sm:right-5 sm:top-5"
            onClick={closeCart}
          >
            <FaTimes />
          </button>
        </div>

        {cart.length === 0 ? (
          <div className="flex min-h-0 flex-1 items-center justify-center px-4 text-center text-2xl font-semibold text-gray-700 sm:text-4xl">
            Your cart is empty
          </div>
        ) : (
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 overflow-y-auto md:grid-cols-3 md:gap-6 md:overflow-hidden lg:gap-8">
            <div className="min-w-0 md:col-span-2 md:h-full md:min-h-0 md:overflow-y-auto">
              <CartItems />
            </div>

            <div className="min-w-0 md:h-full md:min-h-0 md:overflow-y-auto">
              <OrderSummary />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;
