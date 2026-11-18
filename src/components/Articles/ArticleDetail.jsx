import { useCallback, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  Bookmark,
  CalendarDays,
  Clock,
  Eye,
  Flag,
  Heart,
  Newspaper,
  Share2,
  ShieldAlert,
} from "lucide-react";
import { useArticle } from "../../hooks/useArticle.js";
import { useArticleActions } from "../../hooks/useArticleActions.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import { formatCount, formatDate } from "../../utils/format.js";
import { getCategoryStyle } from "./constants.js";
import RelatedArticles from "./RelatedArticles.jsx";
import ReportArticleDialog from "./ReportArticleDialog.jsx";
import BackButton from "../Shared/BackButton.jsx";

const DetailSkeleton = () => (
  <div className="container animate-pulse pb-10">
    <div className="mt-8 h-10 w-40 rounded bg-slate-700/40" />
    <div className="mt-6 h-72 rounded-3xl bg-slate-700/35" />
    <div className="mx-auto mt-8 max-w-3xl space-y-4">
      <div className="h-5 w-32 rounded bg-slate-700/40" />
      <div className="h-12 w-full rounded bg-slate-700/50" />
      <div className="h-5 w-2/3 rounded bg-slate-700/40" />
      <div className="h-64 rounded-2xl bg-slate-700/30" />
    </div>
  </div>
);

const ArticleDetail = () => {
  const { slug } = useParams();
  const { article, loading, error, retry, updateArticle } = useArticle(slug);
  const { notify } = useGlobalContext();
  const [reportOpen, setReportOpen] = useState(false);

  const handleUpdate = useCallback(
    (_id, patch) => updateArticle(patch),
    [updateArticle]
  );

  const { toggleLike, toggleSave } = useArticleActions(handleUpdate);

  const closeReport = useCallback(() => setReportOpen(false), []);

  const handleShare = async () => {
    const url = window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({ title: article.title, url });
      } else {
        await navigator.clipboard.writeText(url);
        notify("Article link copied");
      }
    } catch (shareError) {
      if (shareError?.name !== "AbortError") {
        notify("Unable to share this article.");
      }
    }
  };

  if (loading) return <DetailSkeleton />;

  if (error) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-[#CED4DA]">
        <Newspaper className="h-12 w-12 text-[#1ABC9C]" />
        <p>{error}</p>
        <div className="flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={retry}
            className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
          >
            Try again
          </button>
          <Link
            to="/articles"
            className="rounded-full border border-white/15 px-6 py-2.5 font-bold text-[#CED4DA]"
          >
            Back to articles
          </Link>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="container flex min-h-[60vh] flex-col items-center justify-center gap-4 text-center text-[#CED4DA]">
        <Newspaper className="h-12 w-12 text-[#1ABC9C]" />
        <h1 className="text-2xl font-extrabold">Article not found</h1>
        <Link
          to="/articles"
          className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
        >
          Browse articles
        </Link>
      </div>
    );
  }

  const isDraft = article.status === "draft";
  const authorInitial = String(article.author?.name || "K")
    .charAt(0)
    .toUpperCase();
  const paragraphs = String(article.content || "")
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);

  return (
    <div className="container pb-10 text-[#CED4DA]">
      <div className="mb-5 flex items-center justify-between gap-4">
        <BackButton to="/articles" label="Back to articles" />

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-[#CED4DA]/70 transition hover:border-[#1ABC9C]/40 hover:text-[#1ABC9C]"
          >
            <Share2 className="h-4 w-4" />
            Share
          </button>
          {!isDraft && !article.isOwner ? (
            <button
              type="button"
              onClick={() => setReportOpen(true)}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-[#CED4DA]/60 transition hover:border-rose-400/40 hover:text-rose-300"
            >
              <Flag className="h-4 w-4" />
              Report
            </button>
          ) : null}
        </div>
      </div>

      {isDraft ? (
        <div className="mb-5 rounded-2xl border border-amber-400/25 bg-amber-400/10 px-4 py-3 text-sm font-semibold text-amber-200">
          This is a draft. Only you can see it until you publish it.
        </div>
      ) : null}

      <article className="overflow-hidden rounded-3xl bg-[#1E1E2F] shadow-2xl ring-1 ring-white/10">
        <div className="relative h-64 overflow-hidden bg-gradient-to-br from-[#1ABC9C]/30 via-slate-800 to-[#05010f] sm:h-80 lg:h-[420px]">
          {article.coverImage ? (
            <img
              src={article.coverImage}
              alt={article.title}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full items-center justify-center">
              <Newspaper
                aria-hidden="true"
                className="h-20 w-20 text-[#CED4DA]/25"
              />
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1E1E2F] via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-3xl px-5 pb-10 sm:px-8">
          <div className="-mt-6 relative z-10">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold ring-1 ${getCategoryStyle(
                  article.category
                )}`}
              >
                {article.category}
              </span>
              {article.featured ? (
                <span className="rounded-full bg-[#1ABC9C]/15 px-3 py-1 text-xs font-bold text-[#1ABC9C] ring-1 ring-[#1ABC9C]/20">
                  Featured
                </span>
              ) : null}
              {isDraft ? (
                <span className="rounded-full bg-amber-400/15 px-3 py-1 text-xs font-bold text-amber-300 ring-1 ring-amber-400/20">
                  Draft
                </span>
              ) : null}
            </div>

            <h1 className="mt-4 text-3xl font-extrabold leading-tight sm:text-4xl lg:text-5xl">
              {article.title}
            </h1>
            <p className="mt-4 text-base leading-7 text-[#CED4DA]/65">
              {article.excerpt}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-3 border-y border-white/10 py-4 text-sm text-[#CED4DA]/55">
            <span className="inline-flex items-center gap-2 font-semibold text-[#CED4DA]/80">
              {article.author?.avatarUrl ? (
                <img
                  src={article.author.avatarUrl}
                  alt=""
                  className="h-10 w-10 rounded-full object-cover ring-1 ring-white/10"
                />
              ) : (
                <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#1ABC9C]/20 text-sm font-black text-[#1ABC9C]">
                  {authorInitial}
                </span>
              )}
              {article.author?.name}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-4 w-4" />
              {formatDate(article.publishedAt)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              {article.readTime} min read
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Eye className="h-4 w-4" />
              {formatCount(article.viewCount)} views
            </span>
          </div>

          {!isDraft ? (
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => toggleLike(article)}
                aria-label={article.likedByMe ? "Unlike article" : "Like article"}
                aria-pressed={Boolean(article.likedByMe)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  article.likedByMe
                    ? "border-rose-400/30 bg-rose-400/10 text-rose-300"
                    : "border-white/10 text-[#CED4DA]/70 hover:bg-white/5"
                }`}
              >
                <Heart
                  className={`h-4 w-4 ${
                    article.likedByMe ? "fill-current" : ""
                  }`}
                />
                {formatCount(article.likeCount)} likes
              </button>

              <button
                type="button"
                onClick={() => toggleSave(article)}
                aria-label={
                  article.savedByMe
                    ? "Remove article from saved"
                    : "Save article"
                }
                aria-pressed={Boolean(article.savedByMe)}
                className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-bold transition ${
                  article.savedByMe
                    ? "border-[#1ABC9C]/30 bg-[#1ABC9C]/10 text-[#1ABC9C]"
                    : "border-white/10 text-[#CED4DA]/70 hover:bg-white/5"
                }`}
              >
                <Bookmark
                  className={`h-4 w-4 ${
                    article.savedByMe ? "fill-current" : ""
                  }`}
                />
                {formatCount(article.bookmarkCount)} bookmarks
              </button>
            </div>
          ) : null}

          <div className="mt-8 space-y-5 text-base leading-8 text-[#CED4DA]/80">
            {paragraphs.length > 0 ? (
              paragraphs.map((paragraph, index) => (
                <p key={index} className="whitespace-pre-line">
                  {paragraph}
                </p>
              ))
            ) : (
              <p>No article body yet.</p>
            )}
          </div>

          {article.sources?.length > 0 ? (
            <section className="mt-10 rounded-2xl border border-white/10 bg-[#05010f]/40 p-5">
              <h2 className="text-lg font-bold">Sources</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {article.sources.map((source) => (
                  <li key={`${source.label}-${source.url}`}>
                    <a
                      href={source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="font-semibold text-[#1ABC9C] hover:underline"
                    >
                      {source.label}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          <div className="mt-8 flex gap-3 rounded-2xl border border-[#1ABC9C]/20 bg-[#1ABC9C]/5 p-5 text-sm leading-6 text-[#CED4DA]/65">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-[#1ABC9C]" />
            <p>
              This article is for general information and is not medical
              advice. Speak to a qualified health professional about your
              personal needs.
            </p>
          </div>

          {article.tags?.length > 0 ? (
            <div className="mt-6 flex flex-wrap gap-2">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-white/5 px-3 py-1 text-xs font-semibold text-[#CED4DA]/55"
                >
                  #{tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      </article>

      <RelatedArticles article={article} />

      {reportOpen ? (
        <ReportArticleDialog article={article} onClose={closeReport} />
      ) : null}
    </div>
  );
};

export default ArticleDetail;
