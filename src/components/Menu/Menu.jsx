import { Link } from "react-router-dom";
import { useProducts } from "../../hooks/useProducts.js";

const explorePill =
  "inline-block bg-[#1ABC9C]/50 text-[#CED4DA] dark:text-gray-800/70 duration-300 py-2 px-8 rounded-full font-bold relative z-10 capitalize";

const Menu = () => {
  const { categories, loading, error, retry } = useProducts();

  if (loading) {
    return (
      <div className="container mt-8 text-[#CED4DA]">
        <div className="mb-8 space-y-3">
          <div className="h-9 w-48 animate-pulse rounded-lg bg-slate-700/50" />
          <div className="h-4 w-72 max-w-full animate-pulse rounded bg-slate-700/40" />
        </div>
        <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 w-72 max-w-full animate-pulse rounded-3xl bg-slate-700/40"
            />
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

  if (!categories.length) {
    return (
      <div className="container mt-8 flex min-h-[50vh] items-center justify-center text-[#CED4DA]">
        <p>No dishes on the menu yet. Check back soon.</p>
      </div>
    );
  }

  return (
    <div className="container pb-6">
      <div className="mb-8 text-[#CED4DA]">
        <h1 className="text-3xl font-bold xl:text-4xl">Our Menu</h1>
        <p className="mt-2 text-sm opacity-70">
          From smoky jollof to hot suya. Pick your local favourite.
        </p>
      </div>

      <div className="grid grid-cols-1 justify-items-center gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => {
          const { id, title, image, name } = category;
          const categoryPath = `/menu/${encodeURIComponent(name)}`;
          const isEven = index % 2 === 0;

          return (
            <Link
              key={id}
              to={categoryPath}
              className={`group py-5 pl-5 bg-gradient-to-br from-slate-800 to-slate-900 text-white rounded-3xl relative overflow-hidden h-80 w-72 max-w-full flex flex-col shadow-2xl transition-transform duration-300 hover:scale-[1.03] active:scale-95 ${
                isEven ? "items-start" : "items-end"
              }`}
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-cover bg-center opacity-40 transition-opacity duration-300 group-hover:opacity-60"
                style={{ backgroundImage: `url(${image})` }}
              />
              <div
                className={`relative z-10 mb-4 ${
                  isEven ? "" : "mt-auto flex w-full flex-col items-start"
                }`}
              >
                <p className="text-4xl xl:text-5xl font-bold opacity-90 mb-4">
                  {title}
                </p>
                <span className={explorePill}>Explore</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Menu;
