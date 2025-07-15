import React from "react";
import { useGlobalContext } from "../../context";

const OrderSummary = () => {
    const { subtotal } = useGlobalContext();
  return (
    <div>
      <h1 className="underline">Order Summary</h1>
      <p>Subtotal: ₦ {subtotal}</p>
      <p>Delivery: ₦</p>
      <p>PromoCode: </p>
      <p>Total: ₦ </p>
      <button>Checkout</button>
    </div>
  );
};

export default OrderSummary;
