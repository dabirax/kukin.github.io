import React from "react";
import { useLocation } from "react-router-dom";
import { Heart, CirclePlus } from "lucide-react";

const Category = () => {
  const location = useLocation();
  const { data, accessor } = location.state;
  console.log(accessor);

  const categorizedItems = data.filter((item) => item.foodType === accessor);
  console.log(categorizedItems);

  return (
    <div className="container text-white md:pl-60">

      {/* Items in the current category */}
      <div className=" grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 place-items-center gap-12 ">
        {categorizedItems.map((item) => {
          const { id, name, img, price, rating } = item;
          return (
            <div key={id} className="w-40">
              {/* Image */}
              <div>
                <img src={img} alt="" className="w-full h-40 rounded-t-2xl object-cover" />
              </div>

              {/* Details */}
              <div className="bg-gray-900 rounded-2xl -translate-y-4 p-2 flex flex-col gap-2">
                {/* Name */}
                <div className="text-center">{name}</div>

                {/* Price and Favorite */}
                <div className="flex justify-between">
                  <div>₦ {price}</div>
                  <button>
                    <Heart />
                  </button>
                </div>

                {/* Rating and Add to Cart */}
                <div className="flex justify-between">
                  <div>{rating}</div>{" "}
                  <button>
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
