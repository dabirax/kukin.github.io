import { Heart, Trash2, Minus, Plus } from "lucide-react";
import { useGlobalContext } from "../../context.jsx";

const CartItems = () => {
  const { removeItem, cart, increase, decrease } = useGlobalContext();

  return (
    <div>
      {cart.map((item) => {
        const { id, name, price, img, amount } = item;
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
                    <span className="flex items-center gap-3  bg-slate-800 text-[#CED4DA] text-sm px-2 py-1 rounded-full font-semibold">
                      {/* Increase */}
                      <button onClick={() => decrease(id)}>
                        <Minus size={14} />
                      </button>
                      {/* Amount */}
                      <span>{amount}</span>
                      {/* Decrease */}
                      <button onClick={() => increase(id)}>
                        <Plus size={14} />
                      </button>
                    </span>
                    <span>
                      <button onClick={() => removeItem(id)}>
                        <Trash2 />
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <div> ₦ {amount * price}</div>
            </div>
          </>
        );
      })}
    </div>
  );
};

export default CartItems;
