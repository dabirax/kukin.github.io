import React from "react";
import { useLocation } from "react-router-dom";
import { Heart, CirclePlus } from "lucide-react";
import { useGlobalContext } from "../../../context.jsx";

const Category = () => {
  const location = useLocation();
  const { data, accessor } = location.state;
  const { addItem } = useGlobalContext();

  const categorizedItems = data.filter((item) => item.foodType === accessor);

  return (
    <div className="container text-[#CED4DA] mx-auto">
      {/* Items in the current category */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 place-items-center gap-8 px-4 ">
        {categorizedItems.map((item) => {
          const { id, name, img, price, rating } = item;
          return (
            <div key={id} className="w-full max-w-[200px]">
              {/* Image */}
              <div>
                <img
                  src={img}
                  alt=""
                  className="w-full h-40 rounded-t-2xl object-cover"
                />
              </div>

              {/* Details */}
              <div className="bg-gray-900 rounded-2xl -translate-y-4 p-2 flex flex-col gap-2 shadow-2xl">
                {/* Name */}
                <div className="text-center font-semibold text-sm">{name}</div>

                {/* Price and Favorite */}
                <div className="flex justify-between items-center text-sm">
                  <div>₦ {price}</div>
                  <button className="hover:text-red-500">
                    <Heart />
                  </button>
                </div>

                {/* Rating and Add to Cart */}
                <div className="flex justify-between items-center text-sm">
                  <div>{rating}</div>
                  <button
                    className="hover:text-green-500"
                    onClick={() => addItem(id)}
                  >
                    <CirclePlus />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Category;