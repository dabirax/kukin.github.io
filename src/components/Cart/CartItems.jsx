import React from "react";
import SampleCartData from "../../SampleCartData.jsx";
import { Heart, Trash2, Minus, Plus } from "lucide-react";
import { useGlobalContext } from "../../context.jsx";

const CartItems = () => {
    const { removeItem, cart } = useGlobalContext();
  return (
    <div>
      {cart.map((item) => {
        const { id, name, price, img } = item;
        return (
          <>
            <div
              className="flex justify-between items-center w-full shadow-md p-4"
              key={id}
            >
              <div className="flex justify-center items-center gap-4 ">
                <div>
                  <img
                    src={img}
                    className="rounded-full object-contain w-20 h-20"
                  />
                </div>
                <div className="flex flex-col justify-center items-start gap-1">
                  <div className="font-semibold text-xl">{name}</div>
                  <div>₦{price}</div>
                  <div className="flex justify-between items-center gap-4">
                    <span>
                      <Heart />
                    </span>
                    <span className="flex items-center gap-3  bg-slate-800 text-[#CED4DA] text-sm p-1 rounded-full font-semibold">
                      <span>
                        <Minus size={14}/>
                      </span>
                      <span>1</span>
                      <span>
                        <Plus size={14}/>
                      </span>
                    </span>
                    <span>
                      <Trash2 />
                    </span>
                  </div>
                </div>
              </div>
              <div> ₦ 400</div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default CartItems;
