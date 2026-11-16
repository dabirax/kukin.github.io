import { useEffect, useRef, useState } from "react";
import { FaCartShopping } from "react-icons/fa6";
import { useGlobalContext } from "../../../useGlobalContext.js";

export function CartIcon({color}) {
  const { noOfItems, cartBump } = useGlobalContext();
  const [shaking, setShaking] = useState(false);
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    setShaking(true);
    const timer = setTimeout(() => setShaking(false), 500);
    return () => clearTimeout(timer);
  }, [cartBump]);

  return (
    <div className={`relative w-fit h-fit ${shaking ? "animate-shake" : ""}`}>
      <FaCartShopping className={`dark:text-[#fdfdfd] transition-transform hover:scale-110 text-3xl ${
          color === "dark" ? "text-slate-800" : " text-[#CED4DA] "
        }`} />
      <span
        className='absolute text-[#CED4DA] bg-red-500 rounded-full text-xs  h-5 w-5 flex items-center justify-center -top-1.5 -right-2 '
      >
        {noOfItems}  
      </span>
    </div>
  );
}
