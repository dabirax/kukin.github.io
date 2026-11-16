import { ARTICLE_CATEGORIES } from "./constants.js";

const sorts = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "popular", label: "Most liked" },
];

const ArticleFilters = ({
  category,
  onCategoryChange,
  sort,
  onSortChange,
}) => {
  const options = ["All", ...ARTICLE_CATEGORIES];

  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div
        className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1"
        role="group"
        aria-label="Filter articles by category"
      >
        {options.map((option) => {
          const active = category === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onCategoryChange(option)}
              aria-pressed={active}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                active
                  ? "bg-[#1ABC9C] text-white shadow-lg shadow-[#1ABC9C]/20"
                  : "bg-[#1E1E2F] text-[#CED4DA]/70 ring-1 ring-white/10 hover:text-[#CED4DA]"
              }`}
            >
              {option}
            </button>
          );
        })}
      </div>

      <label className="flex items-center gap-3 text-sm text-[#CED4DA]/70">
        <span className="shrink-0">Sort by</span>
        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#1E1E2F] px-3 py-2 text-sm font-semibold text-[#CED4DA] outline-none focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/25"
        >
          {sorts.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
};

export default ArticleFilters;
