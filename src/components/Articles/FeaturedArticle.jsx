import { Link } from "react-router-dom";
import {
  Bookmark,
  Clock,
  Heart,
  Newspaper,
  Sparkles,
} from "lucide-react";
import { formatCount, formatDate } from "../../utils/format.js";
import { getCategoryStyle } from "./constants.js";

const FeaturedArticle = ({ article, onLike, onSave }) => {
  const articlePath = `/articles/${article.slug}`;
  const authorInitial = String(article.author?.name || "K")
    .charAt(0)
    .toUpperCase();

  return (
    <section className="overflow-hidden rounded-3xl bg-[#1E1E2F] shadow-2xl ring-1 ring-white/10">
      <div className="grid lg:grid-cols-[1.05fr_1fr]">
        <Link
          to={articlePath}
          className="relative min-h-[260px] overflow-hidden bg-gradient-to-br from-[#1ABC9C]/30 via-slate-800 to-[#05010f] lg:min-h-[380px]"
          aria-label={`Read featured article: ${article.title}`}
        >
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt=""
              className="h-full w-full object-cover transition duration-700 hover:scale-105"
            />
          ) : (
            <div className="flex h-full min-h-[260px] items-center justify-center lg:min-h-[380px]">
              <Newspaper
                aria-hidden="true"
                className="h-20 w-20 text-[#CED4DA]/25"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#05010f]/65 via-transparent to-transparent" />
        </Link>

        <div className="flex flex-col justify-center p-6 sm:p-8">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-[#1ABC9C]/15 px-3 py-1 text-xs font-black uppercase tracking-wide text-[#1ABC9C] ring-1 ring-[#1ABC9C]/20">
              <Sparkles aria-hidden="true" className="h-3.5 w-3.5" />
              Featured
            </span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${getCategoryStyle(
                article.category
              )}`}
            >
              {article.category}
            </span>
          </div>

          <Link to={articlePath} className="group mt-4">
            <h2 className="text-3xl font-extrabold leading-tight text-[#CED4DA] transition group-hover:text-[#1ABC9C] sm:text-4xl">
              {article.title}
            </h2>
          </Link>

          <p className="mt-3 line-clamp-3 text-sm leading-6 text-[#CED4DA]/65 sm:text-base">
            {article.excerpt}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-4 text-sm text-[#CED4DA]/55">
            <span className="inline-flex items-center gap-2">
              {article.author?.avatarUrl ? (
                <img
                  src={article.author.avatarUrl}
                  alt=""
                  className="h-9 w-9 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#1ABC9C]/20 text-sm font-black text-[#1ABC9C]">
                  {authorInitial}
                </span>
              )}
              {article.author?.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock aria-hidden="true" className="h-4 w-4" />
              {article.readTime} min read
            </span>
            <span>{formatDate(article.publishedAt)}</span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Link
              to={articlePath}
              className="rounded-full bg-[#1ABC9C] px-6 py-2.5 text-sm font-bold text-white transition hover:bg-[#16a085]"
            >
              Read article
            </Link>

            <button
              type="button"
              onClick={() => onLike?.(article)}
              aria-label={
                article.likedByMe
                  ? `Unlike ${article.title}`
                  : `Like ${article.title}`
              }
              aria-pressed={Boolean(article.likedByMe)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                article.likedByMe
                  ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                  : "border-white/10 text-[#CED4DA]/70 hover:bg-white/5"
              }`}
            >
              <Heart
                aria-hidden="true"
                className={`h-4 w-4 ${
                  article.likedByMe ? "fill-current" : ""
                }`}
              />
              {formatCount(article.likeCount)}
            </button>

            <button
              type="button"
              onClick={() => onSave?.(article)}
              aria-label={
                article.savedByMe
                  ? `Remove ${article.title} from saved`
                  : `Save ${article.title}`
              }
              aria-pressed={Boolean(article.savedByMe)}
              className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                article.savedByMe
                  ? "border-[#1ABC9C]/30 bg-[#1ABC9C]/10 text-[#1ABC9C]"
                  : "border-white/10 text-[#CED4DA]/70 hover:bg-white/5"
              }`}
            >
              <Bookmark
                aria-hidden="true"
                className={`h-4 w-4 ${
                  article.savedByMe ? "fill-current" : ""
                }`}
              />
              {formatCount(article.bookmarkCount)}
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedArticle;
