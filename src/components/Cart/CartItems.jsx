import { Heart, Trash2, Minus, Plus } from "lucide-react";
import { useGlobalContext } from "../../useGlobalContext.js";
import { formatNaira } from "../../utils/format.js";

const CartItems = () => {
  const { removeItem, cart, increase, decrease } = useGlobalContext();

  return (
    <div>
      {cart.map((item) => {
        const { id, name, price, img, amount } = item;
        return (
          <div
            className="flex w-full flex-col gap-3 p-3 shadow-md sm:flex-row sm:items-center sm:justify-between sm:p-4"
            key={id}
          >
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={img}
                alt={name}
                className="h-16 w-16 shrink-0 rounded-full object-cover sm:h-20 sm:w-20"
              />
              <div className="flex min-w-0 flex-col items-start justify-center gap-1">
                <div className="break-words text-base font-semibold sm:text-xl">
                  {name}
                </div>
                <div>{formatNaira(price)}</div>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3">
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
            <div className="self-end text-right sm:self-auto sm:shrink-0">
              {formatNaira(amount * price)}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CartItems;

