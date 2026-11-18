import { useState } from "react";
import { Link } from "react-router-dom";
import {
  FileText,
  Loader2,
  Plus,
  Send,
  Trash2,
} from "lucide-react";
import { deleteArticle, publishArticle } from "../../api/articles.js";
import { useArticles } from "../../hooks/useArticles.js";
import { useArticleActions } from "../../hooks/useArticleActions.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll.js";
import ArticleCard from "./ArticleCard.jsx";
import ArticleEmptyState from "./ArticleEmptyState.jsx";
import ArticleSkeletonGrid from "./ArticleSkeleton.jsx";
import { ARTICLE_PAGE_SIZE } from "./constants.js";
import BackButton from "../Shared/BackButton.jsx";

const statusFilters = [
  { value: "all", label: "All" },
  { value: "published", label: "Published" },
  { value: "draft", label: "Drafts" },
];

const MyArticles = () => {
  const { notify } = useGlobalContext();
  const [status, setStatus] = useState("all");
  const [pendingId, setPendingId] = useState("");

  const {
    items,
    loading,
    loadingMore,
    error,
    nextError,
    hasMore,
    total,
    loadMore,
    retry,
    updateArticle,
    removeArticle,
  } = useArticles({
    source: "mine",
    status: status === "all" ? "" : status,
    limit: ARTICLE_PAGE_SIZE,
  });

  const { toggleLike, toggleSave } = useArticleActions(updateArticle);

  const handlePublish = async (article) => {
    setPendingId(article.id);

    try {
      const data = await publishArticle(article.id);

      if (status === "draft") {
        removeArticle(article.id);
      } else {
        updateArticle(article.id, {
          status: "published",
          publishedAt:
            data?.article?.publishedAt || new Date().toISOString(),
        });
      }

      notify("Article published");
    } catch (requestError) {
      notify(requestError?.message || "Unable to publish this article.");
    } finally {
      setPendingId("");
    }
  };

  const handleDelete = async (article) => {
    const confirmed = window.confirm(
      `Delete “${article.title}”? This cannot be undone.`
    );

    if (!confirmed) return;

    setPendingId(article.id);

    try {
      await deleteArticle(article.id);
      removeArticle(article.id);
      notify("Article deleted");
    } catch (requestError) {
      notify(requestError?.message || "Unable to delete this article.");
    } finally {
      setPendingId("");
    }
  };

  const sentinelRef = useInfiniteScroll({
    enabled:
      hasMore &&
      !loading &&
      !loadingMore &&
      !nextError &&
      items.length > 0,
    onLoadMore: loadMore,
  });

  return (
    <div className="container pb-10 text-[#CED4DA]">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex items-center gap-4">
          <BackButton to="/articles" label="Back to articles" />
          <div>
            <h1 className="text-3xl font-extrabold sm:text-4xl">
              My articles
            </h1>
            <p className="mt-1 text-sm text-[#CED4DA]/60" aria-live="polite">
              {loading
                ? "Loading your articles..."
                : `${total} ${total === 1 ? "article" : "articles"}`}
            </p>
          </div>
        </div>

        <Link
          to="/articles/new"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#1ABC9C] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#16a085]"
        >
          <Plus className="h-4 w-4" />
          New article
        </Link>
      </div>

      <div
        className="mb-5 flex gap-2 overflow-x-auto pb-1"
        role="group"
        aria-label="Filter your articles by status"
      >
        {statusFilters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => setStatus(filter.value)}
            aria-pressed={status === filter.value}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
              status === filter.value
                ? "bg-[#1ABC9C] text-white"
                : "bg-[#1E1E2F] text-[#CED4DA]/70 ring-1 ring-white/10"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {loading ? (
        <ArticleSkeletonGrid count={6} />
      ) : error ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-white/10 bg-[#1E1E2F]/60 p-8 text-center">
          <p className="text-[#CED4DA]/75">{error}</p>
          <button
            type="button"
            onClick={retry}
            className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <ArticleEmptyState
          icon={FileText}
          title={
            status === "draft"
              ? "No drafts yet"
              : status === "published"
                ? "Nothing published yet"
                : "You have not written anything yet"
          }
          description="Start with a recipe, a nutrition guide, or a food safety tip."
          action={
            <Link
              to="/articles/new"
              className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
            >
              Write an article
            </Link>
          }
        />
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onLike={toggleLike}
                onSave={toggleSave}
                footer={
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-bold uppercase tracking-wide text-[#CED4DA]/45">
                      {article.status === "draft" ? "Private draft" : "Published"}
                    </span>
                    <div className="flex items-center gap-2">
                      {article.status === "draft" ? (
                        <button
                          type="button"
                          onClick={() => handlePublish(article)}
                          disabled={pendingId === article.id}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#1ABC9C]/15 px-3 py-2 text-xs font-bold text-[#1ABC9C] transition hover:bg-[#1ABC9C]/25 disabled:opacity-60"
                        >
                          {pendingId === article.id ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Send className="h-3.5 w-3.5" />
                          )}
                          Publish
                        </button>
                      ) : null}
                      <button
                        type="button"
                        onClick={() => handleDelete(article)}
                        disabled={pendingId === article.id}
                        className="inline-flex items-center gap-1.5 rounded-full bg-rose-500/10 px-3 py-2 text-xs font-bold text-rose-300 transition hover:bg-rose-500/20 disabled:opacity-60"
                      >
                        {pendingId === article.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                        Delete
                      </button>
                    </div>
                  </div>
                }
              />
            ))}
          </div>

          <div ref={sentinelRef} aria-hidden="true" className="h-2" />

          {loadingMore ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#CED4DA]/55">
              <Loader2 className="h-5 w-5 animate-spin text-[#1ABC9C]" />
              Loading more articles...
            </div>
          ) : null}

          {nextError ? (
            <div className="flex flex-col items-center gap-3 py-4 text-center text-sm text-[#CED4DA]/65">
              <p>{nextError}</p>
              <button
                type="button"
                onClick={retry}
                className="rounded-full border border-[#1ABC9C]/40 px-5 py-2 font-bold text-[#1ABC9C]"
              >
                Try again
              </button>
            </div>
          ) : null}

          {!hasMore && !nextError ? (
            <p className="py-4 text-center text-sm text-[#CED4DA]/45">
              You’re all caught up.
            </p>
          ) : null}
        </>
      )}
    </div>
  );
};

export default MyArticles;
