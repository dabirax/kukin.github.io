import React from "react";
import { useGlobalContext } from "../../context";
import { FaTimes } from "react-icons/fa";
import { FaCartShopping } from "react-icons/fa6";
import CartItems from "./CartItems";
import { CartIcon } from "../Navbar/RightBar/cartIcon";
import OrderSummary from "./OrderSummary";

const Cart = () => {
  const { isCartOpen, closeCart } = useGlobalContext();
  return (
    <div
      className={`fixed top-0 left-0 w-screen h-screen font-poppins backdrop-blur-xs z-800 flex items-center justify-center ${
        isCartOpen ? "block" : "hidden"
      } `}
    >
      <div className="bg-[#CED4DA] w-3/4  h-3/4 rounded-lg shadow-lg relative p-5 ">
        <div className=" w-full flex">
          <div className="flex items-center justify-center w-full  gap-3">
            <CartIcon color="dark" />
            <span className="font-extrabold  text-3xl text-slate-800">Cart</span>
          </div>

          <button
            className="absolute text-red-500 right-0 text-2xl px-5 "
            onClick={closeCart}
          >
            <FaTimes />
          </button>
        </div>
        <div className="grid grid-cols-3 gap-16 h-full p-5">
          {/* Cart Items */}
          <div className="col-span-2 overflow-y-auto h-full">
            <CartItems />
          </div>

          {/* Order Summary} */}
          <div>
            <OrderSummary />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
