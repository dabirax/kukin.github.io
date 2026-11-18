import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";

const CategoryShortcuts = ({ categories = [] }) => {
  if (categories.length === 0) return null;

  return (
    <section
      aria-labelledby="category-shortcuts-title"
      className="rounded-3xl bg-[#1E1E2F]/80 p-4 shadow-2xl ring-1 ring-white/10 sm:p-5"
    >
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1ABC9C]">
            Explore
          </p>
          <h2
            id="category-shortcuts-title"
            className="mt-1 text-2xl font-extrabold text-white sm:text-3xl"
          >
            Find your craving
          </h2>
        </div>
        <Link
          to="/menu"
          className="inline-flex items-center gap-1 text-xs font-bold text-[#1ABC9C] hover:text-[#16a085]"
        >
          Full menu
          <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-3 2xl:grid-cols-6">
        {categories.map((category) => (
          <Link
            key={category.id}
            to={`/menu/${encodeURIComponent(category.name)}`}
            className="group relative flex h-20 items-end overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800 to-[#05010f] p-3 ring-1 ring-white/10 transition hover:-translate-y-1 hover:ring-[#1ABC9C]/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C] sm:h-24"
          >
            <span
              aria-hidden="true"
              className="absolute inset-0 bg-cover bg-center opacity-35 transition duration-500 group-hover:scale-105 group-hover:opacity-55"
              style={{ backgroundImage: `url(${category.image})` }}
            />
            <span className="absolute inset-0 bg-gradient-to-t from-[#05010f]/90 via-transparent to-transparent" />
            <span className="relative z-10 line-clamp-2 text-xs font-bold leading-tight text-white sm:text-sm">
              {category.title}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default CategoryShortcuts;
