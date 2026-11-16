import { useGlobalContext } from "../../useGlobalContext.js";
import { useAuth } from "../../auth/useAuth.js";
import Button from "../Shared/Button";
import { formatNaira } from "../../utils/format.js";

const OrderSummary = () => {
  const { subtotal, notify } = useGlobalContext();
  const { isAuthenticated, openAuth } = useAuth();
  const deliveryFee = 4500; // Example delivery fee
  const total = subtotal + deliveryFee;
  return (
    <div className="bg-slate-800 text-[#CED4DA] p-4 rounded-lg shadow-lg">
      {/* Title */}
      <div>
        <h1 className="underline font-semibold text-2xl text-center">
          Order Summary
        </h1>
      </div>

      {/* Content */}
      <div className="mt-4">
        {/* Details */}
        <div className="mb-4">
          <p className="flex justify-between mb-2">
            <span>Subtotal:</span>
            <span>{formatNaira(subtotal)}</span>
          </p>
          <p className="flex justify-between mb-2">
            <span>Delivery:</span>
            <span>{formatNaira(deliveryFee)}</span>
          </p>
          <label>PromoCode: </label>
          <input
            type="text"
            placeholder="Enter Promo Code"
            className=" bg-white text-black rounded-md p-2 w-full mt-2"
          />
        </div>

        {/* Total */}
        <div>
          <p className="flex justify-between mb-2">
            <span>Total:</span>
            <span>{formatNaira(total)}</span>{" "}
          </p>
          <div className="flex justify-end items-center">
            <Button
              text="Check out"
              bgColor="bg-[#1ABC9C]/50"
              textColor={`text-[#CED4DA] dark:text-gray-800/70 `}
              handler={() => {
                if (!isAuthenticated) {
                  openAuth("login", {
                    notice: "Sign in before checking out.",
                  });
                  return;
                }

                notify("Checkout is coming soon.");
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
