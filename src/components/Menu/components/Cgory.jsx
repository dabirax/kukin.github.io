import { useState } from "react";
import { useParams } from "react-router-dom";
import { Heart, CirclePlus, Check } from "lucide-react";
import { useGlobalContext } from "../../../useGlobalContext.js";
import { CATEGORY_LABELS, useProducts } from "../../../hooks/useProducts.js";
import { formatNaira } from "../../../utils/format.js";
import BackButton from "../../Shared/BackButton.jsx";

const Category = () => {
  const { category } = useParams();
  const { products, loading, error, retry } = useProducts();
  const { addItem, notify, favorites, toggleFavorite } = useGlobalContext();
  const [justAdded, setJustAdded] = useState(null);

  const accessor = decodeURIComponent(category ?? "");
  const title = CATEGORY_LABELS[accessor] ?? accessor;
  const categorizedItems = products.filter(
    (item) => item.category.toLowerCase() === accessor.toLowerCase()
  );

  const handleAdd = (item) => {
    const wasAdded = addItem(item);

    if (!wasAdded) return;

    notify(`${item.name} added to cart`);
    setJustAdded(item.id);
    window.setTimeout(() => {
      setJustAdded((current) => (current === item.id ? null : current));
    }, 1200);
  };

  if (loading) {
    return (
      <div className="container text-[#CED4DA]">
        <div className="my-8 flex items-center gap-4">
          <div className="h-10 w-10 animate-pulse rounded-full bg-slate-700/50" />
          <div className="h-9 w-40 animate-pulse rounded-lg bg-slate-700/50" />
        </div>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="w-full max-w-[16rem]">
              <div className="h-44 w-full animate-pulse rounded-t-2xl bg-slate-700/40 sm:h-52" />
              <div className="relative -translate-y-4 h-28 animate-pulse rounded-2xl bg-slate-700/50" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-8 flex min-h-[50vh] flex-col items-center justify-center gap-4 text-center text-[#CED4DA]">
        <p>{error}</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-xl bg-[#1ABC9C]/50 px-6 py-2 font-semibold text-[#CED4DA]"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="container text-[#CED4DA]">
      <div className="mb-6 flex items-center gap-4">
        <BackButton to="/menu" label="Back to menu" />
        <h1 className="text-3xl font-bold xl:text-4xl">{title}</h1>
      </div>

      {categorizedItems.length === 0 ? (
        <p className="py-16 text-center">No dishes in this category yet.</p>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-6 xl:grid-cols-4">
          {categorizedItems.map((item) => {
            const { id, name, img, price, rating, desc } = item;
            const isFav = favorites.includes(id);
            const isAdded = justAdded === id;

            return (
              <div
                key={id}
                className="w-full max-w-[16rem] transition-transform duration-300 hover:scale-[1.03] "
              >
                <img
                  src={img}
                  alt={name}
                  className="h-44 w-full rounded-t-2xl object-cover sm:h-52"
                />

                <div className="relative -translate-y-4 flex flex-col gap-2 rounded-2xl bg-gray-900 p-3 shadow-2xl">
                  <div className="text-center font-semibold">{name}</div>

                  <div className="flex items-center justify-between">
                    <div className="font-bold">{formatNaira(price)}</div>
                    <button
                      type="button"
                      aria-label={`Favourite ${name}`}
                      aria-pressed={isFav}
                      onClick={() => toggleFavorite(id)}
                      className="transition-transform hover:scale-110 active:scale-90"
                    >
                      <Heart
                        className={isFav ? "fill-red-500 text-red-500" : ""}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div title={desc}>⭐ {rating}</div>
                    <button
                      type="button"
                      aria-label={`Add ${name} to cart`}
                      onClick={() => handleAdd(item)}
                      className="transition-transform hover:scale-110 active:scale-90"
                    >
                      {isAdded ? (
                        <Check className="text-[#1ABC9C]" />
                      ) : (
                        <CirclePlus />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Category;
