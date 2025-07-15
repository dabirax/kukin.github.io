import React from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useGlobalContext } from "../../../context";

export function CartIcon({color}) {
  return (
    <div className="relative w-fit h-fit">
      <FaCartShopping className={`dark:text-[#fdfdfd] transition-transform hover:scale-110 text-3xl ${
          color === "dark" ? "text-slate-800" : " text-[#CED4DA] "
        }`} />
      <span
        className='absolute text-[#CED4DA] bg-red-500 rounded-full text-xs  h-5 w-5 flex items-center justify-center -top-1.5 -right-2 '
      >
        6
      </span>
    </div>
  );
}
