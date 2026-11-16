import { Loader2, Search, X } from "lucide-react";

const ArticleSearchBar = ({ value, onChange, onClear, loading = false }) => (
  <div className="relative w-full">
    <label htmlFor="article-search" className="sr-only">
      Search articles
    </label>
    <Search
      aria-hidden="true"
      className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[#CED4DA]/50"
    />
    <input
      id="article-search"
      type="search"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Search recipes, nutrition, health news..."
      className="w-full rounded-2xl border border-white/10 bg-[#1E1E2F] py-3.5 pl-12 pr-12 text-sm text-[#CED4DA] outline-none transition placeholder:text-[#CED4DA]/40 focus:border-[#1ABC9C] focus:ring-2 focus:ring-[#1ABC9C]/25"
    />
    <div className="absolute inset-y-0 right-3 flex items-center">
      {loading ? (
        <Loader2
          aria-hidden="true"
          className="h-5 w-5 animate-spin text-[#1ABC9C]"
        />
      ) : value ? (
        <button
          type="button"
          onClick={onClear}
          aria-label="Clear article search"
          className="rounded-full p-1.5 text-[#CED4DA]/60 transition hover:bg-white/10 hover:text-[#CED4DA]"
        >
          <X className="h-5 w-5" />
        </button>
      ) : null}
    </div>
  </div>
);

export default ArticleSearchBar;
