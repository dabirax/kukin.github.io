import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Clock,
  Flame,
  Heart,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { useArticles } from "../../../hooks/useArticles.js";
import { useFeaturedArticle } from "../../../hooks/useFeaturedArticle.js";
import { formatCount } from "../../../utils/format.js";
import {
  ARTICLE_CATEGORIES,
  getCategoryStyle,
} from "../../Articles/constants.js";

const panelClass =
  "min-w-0 rounded-3xl bg-[#1E1E2F] p-4 shadow-2xl ring-1 ring-white/10";

const TrendingArticles = () => {
  const [category, setCategory] = useState("");
  const { article: featured, loading: featuredLoading } = useFeaturedArticle();
  const { items, loading, error, retry } = useArticles({
    sort: "popular",
    category: category || undefined,
    limit: 5,
  });

  return (
    <aside className="grid min-w-0 gap-4 sm:grid-cols-2 xl:sticky xl:top-24 xl:grid-cols-1 xl:self-start">
      <section className={panelClass} aria-labelledby="editors-pick-title">
        <div className="flex items-center gap-2">
          <Sparkles aria-hidden="true" className="h-4 w-4 text-[#1ABC9C]" />
          <h2
            id="editors-pick-title"
            className="text-sm font-black uppercase tracking-widest text-white"
          >
            Editor&apos;s pick
          </h2>
        </div>

        {featuredLoading ? (
          <div className="mt-3 flex gap-3">
            <div className="h-20 w-20 shrink-0 animate-pulse rounded-2xl bg-white/5" />
            <div className="flex-1 space-y-3 py-1">
              <div className="h-3 w-20 animate-pulse rounded bg-white/10" />
              <div className="h-4 w-full animate-pulse rounded bg-white/10" />
              <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
            </div>
          </div>
        ) : featured ? (
          <Link
            to={`/articles/${featured.slug}`}
            className="group mt-3 flex gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C]"
          >
            <span className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#1ABC9C]/25 to-[#05010f]">
              {featured.coverImage ? (
                <img
                  src={featured.coverImage}
                  alt=""
                  loading="lazy"
                  className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                />
              ) : (
                <Newspaper aria-hidden="true" className="h-8 w-8 text-white/25" />
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span
                className={`inline-flex rounded-full px-2 py-0.5 text-[0.65rem] font-bold ring-1 ${getCategoryStyle(
                  featured.category
                )}`}
              >
                {featured.category}
              </span>
              <span className="mt-2 line-clamp-2 block text-sm font-bold leading-snug text-[#CED4DA] transition group-hover:text-[#1ABC9C]">
                {featured.title}
              </span>
              <span className="mt-2 inline-flex items-center gap-1 text-xs text-[#CED4DA]/50">
                <Clock aria-hidden="true" className="h-3 w-3" />
                {featured.readTime} min read
              </span>
            </span>
          </Link>
        ) : (
          <p className="mt-3 text-sm text-[#CED4DA]/50">
            No featured article yet.
          </p>
        )}
      </section>

      <section className={panelClass} aria-labelledby="trending-title">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Flame aria-hidden="true" className="h-4 w-4 text-orange-400" />
            <h2
              id="trending-title"
              className="text-sm font-black uppercase tracking-widest text-white"
            >
              Trending
            </h2>
          </div>
          <Link
            to="/articles"
            className="inline-flex items-center gap-1 text-xs font-bold text-[#1ABC9C] hover:text-[#16a085]"
          >
            View all
            <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div
          aria-label="Filter trending articles by topic"
          className="mt-3 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
          {["All", ...ARTICLE_CATEGORIES].map((item) => {
            const value = item === "All" ? "" : item;
            const isActive = value === category;

            return (
              <button
                key={item}
                type="button"
                aria-pressed={isActive}
                onClick={() => setCategory(value)}
                className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-bold transition focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C] ${
                  isActive
                    ? "bg-[#1ABC9C] text-white"
                    : "bg-white/5 text-[#CED4DA]/60 ring-1 ring-white/10 hover:bg-white/10 hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <div className="mt-4">
          {loading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="flex gap-3">
                  <div className="h-14 w-14 shrink-0 animate-pulse rounded-xl bg-white/5" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 w-full animate-pulse rounded bg-white/10" />
                    <div className="h-3 w-2/3 animate-pulse rounded bg-white/5" />
                  </div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="py-6 text-center">
              <p className="text-sm text-[#CED4DA]/60">{error}</p>
              <button
                type="button"
                onClick={retry}
                className="mt-3 rounded-full bg-[#1ABC9C]/15 px-4 py-2 text-xs font-bold text-[#1ABC9C] ring-1 ring-[#1ABC9C]/20 transition hover:bg-[#1ABC9C]/25"
              >
                Try again
              </button>
            </div>
          ) : items.length === 0 ? (
            <p className="py-6 text-center text-sm text-[#CED4DA]/50">
              No articles in this topic yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="flex border-t border-white/5 pt-3 first:border-0 first:pt-0"
                >
                  <Link
                    to={`/articles/${item.slug}`}
                    className="group flex min-w-0 flex-1 gap-3 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#1ABC9C]"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-[#1ABC9C]/20 to-[#05010f] ring-1 ring-white/10">
                      {item.coverImage ? (
                        <img
                          src={item.coverImage}
                          alt=""
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <Newspaper aria-hidden="true" className="h-5 w-5 text-white/25" />
                      )}
                    </span>
                    <div className="min-w-0">
                      <h3 className="line-clamp-2 text-sm font-bold leading-snug text-[#CED4DA] transition group-hover:text-[#1ABC9C]">
                        {item.title}
                      </h3>
                      <div className="mt-2 flex flex-wrap items-center gap-2 text-[0.7rem] text-[#CED4DA]/50">
                        <span
                          className={`rounded-full px-2 py-0.5 font-bold ring-1 ${getCategoryStyle(
                            item.category
                          )}`}
                        >
                          {item.category}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Clock aria-hidden="true" className="h-3 w-3" />
                          {item.readTime} min
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Heart aria-hidden="true" className="h-3 w-3" />
                          {formatCount(item.likeCount)}
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>
    </aside>
  );
};

export default TrendingArticles;
