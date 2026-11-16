import { Link } from "react-router-dom";
import {
  Bookmark,
  Clock,
  Heart,
  Newspaper,
} from "lucide-react";
import { formatCount, formatDate } from "../../utils/format.js";
import { getCategoryStyle } from "./constants.js";

const ArticleCard = ({
  article,
  onLike,
  onSave,
  footer = null,
}) => {
  const authorInitial = String(article.author?.name || "K")
    .charAt(0)
    .toUpperCase();
  const articlePath = `/articles/${article.slug}`;

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-[#1E1E2F] shadow-2xl ring-1 ring-white/10 transition duration-300 hover:-translate-y-1 hover:ring-[#1ABC9C]/30">
      <Link
        to={articlePath}
        className="relative block h-48 overflow-hidden bg-gradient-to-br from-[#1ABC9C]/30 via-slate-800 to-[#05010f]"
        aria-label={`Read ${article.title}`}
      >
        {article.coverImage ? (
          <img
            src={article.coverImage}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <Newspaper
              aria-hidden="true"
              className="h-14 w-14 text-[#CED4DA]/30"
            />
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1E1E2F] to-transparent" />
        <span
          className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold ring-1 ${getCategoryStyle(
            article.category
          )}`}
        >
          {article.category}
        </span>
        {article.status === "draft" ? (
          <span className="absolute right-4 top-4 rounded-full bg-amber-400 px-3 py-1 text-xs font-black text-amber-950">
            Draft
          </span>
        ) : null}
      </Link>

      <div className="flex flex-1 flex-col p-5">
        <Link to={articlePath} className="group/title">
          <h2 className="line-clamp-2 text-xl font-bold leading-snug text-[#CED4DA] transition group-hover/title:text-[#1ABC9C]">
            {article.title}
          </h2>
        </Link>

        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#CED4DA]/60">
          {article.excerpt}
        </p>

        <div className="mt-4 flex items-center gap-3 text-xs text-[#CED4DA]/50">
          <span className="inline-flex items-center gap-1.5">
            <Clock aria-hidden="true" className="h-4 w-4" />
            {article.readTime} min read
          </span>
          <span aria-hidden="true">·</span>
          <span>{formatDate(article.publishedAt)}</span>
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-5">
          <div className="flex min-w-0 items-center gap-2.5">
            {article.author?.avatarUrl ? (
              <img
                src={article.author.avatarUrl}
                alt=""
                className="h-9 w-9 rounded-full object-cover ring-1 ring-white/10"
              />
            ) : (
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#1ABC9C]/20 text-sm font-black text-[#1ABC9C]">
                {authorInitial}
              </span>
            )}
            <span className="truncate text-sm font-semibold text-[#CED4DA]/75">
              {article.author?.name}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => onLike?.(article)}
              aria-label={
                article.likedByMe
                  ? `Unlike ${article.title}`
                  : `Like ${article.title}`
              }
              aria-pressed={Boolean(article.likedByMe)}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-bold transition hover:bg-white/10 ${
                article.likedByMe ? "text-rose-400" : "text-[#CED4DA]/60"
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
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-2 text-xs font-bold transition hover:bg-white/10 ${
                article.savedByMe ? "text-[#1ABC9C]" : "text-[#CED4DA]/60"
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

        {footer ? (
          <div className="mt-4 border-t border-white/10 pt-4">{footer}</div>
        ) : null}
      </div>
    </article>
  );
};

export default ArticleCard;
