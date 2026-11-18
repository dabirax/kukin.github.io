import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Check, CirclePlus, Heart, Utensils } from "lucide-react";
import { useGlobalContext } from "../../../useGlobalContext.js";
import { CATEGORY_LABELS } from "../../../hooks/useProducts.js";
import { formatNaira } from "../../../utils/format.js";

const SectionCard = ({ product }) => {
  const { addItem, notify, favorites, toggleFavorite } = useGlobalContext();
  const [justAdded, setJustAdded] = useState(false);
  const timerRef = useRef(null);
  const categoryPath = `/menu/${encodeURIComponent(product.category || "Others")}`;
  const isFavorite = favorites.includes(product.id);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const handleAdd = () => {
    if (!addItem(product)) return;

    notify(`${product.name} added to cart`);
    setJustAdded(true);
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(() => setJustAdded(false), 1200);
  };

  return (
    <article className="group w-[min(72vw,16rem)] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#05010f]/50 ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-[#1ABC9C]/30 sm:w-[16rem] xl:w-[15rem]">
      <Link
        to={categoryPath}
        aria-label={`View ${product.name}`}
        className="block h-28 overflow-hidden bg-gradient-to-br from-[#1ABC9C]/20 via-slate-800 to-[#05010f]"
      >
        {product.img ? (
          <img
            src={product.img}
            alt={product.name}
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <span className="flex h-full items-center justify-center">
            <Utensils aria-hidden="true" className="h-10 w-10 text-white/20" />
          </span>
        )}
      </Link>

      <div className="p-2.5">
        <Link to={categoryPath} className="group/title">
          <h3 className="truncate text-sm font-bold text-[#CED4DA] transition group-hover/title:text-[#1ABC9C]">
            {product.name}
          </h3>
        </Link>
        <p className="mt-0.5 truncate text-xs text-[#CED4DA]/45">
          {CATEGORY_LABELS[product.category] || product.category}
        </p>

        <div className="mt-2 flex items-center justify-between gap-2">
          <span className="min-w-0 truncate font-bold text-[#1ABC9C]">
            {formatNaira(product.price)}
          </span>
          <span
            className="shrink-0 text-xs text-amber-300"
            title={`Rating: ${product.rating}`}
          >
            ★ {product.rating || "—"}
          </span>
        </div>

        <div className="mt-2 flex items-center gap-2">
          <button
            type="button"
            aria-label={`${isFavorite ? "Remove" : "Add"} ${product.name} ${
              isFavorite ? "from" : "to"
            } favourites`}
            aria-pressed={isFavorite}
            onClick={() => toggleFavorite(product.id)}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10 transition hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C]"
          >
            <Heart
              aria-hidden="true"
              className={`h-4 w-4 ${
                isFavorite ? "fill-red-500 text-red-500" : "text-[#CED4DA]/70"
              }`}
            />
          </button>

          <button
            type="button"
            onClick={handleAdd}
            className="flex h-9 flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#1ABC9C] text-xs font-bold text-white transition hover:bg-[#16a085] focus:outline-none focus-visible:ring-2 focus-visible:ring-white"
          >
            {justAdded ? (
              <>
                <Check aria-hidden="true" className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <CirclePlus aria-hidden="true" className="h-4 w-4" />
                Add to cart
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default SectionCard;
