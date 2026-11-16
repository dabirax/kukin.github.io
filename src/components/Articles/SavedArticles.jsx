import { useCallback } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Bookmark, Loader2 } from "lucide-react";
import { useArticles } from "../../hooks/useArticles.js";
import { useArticleActions } from "../../hooks/useArticleActions.js";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll.js";
import ArticleCard from "./ArticleCard.jsx";
import ArticleEmptyState from "./ArticleEmptyState.jsx";
import ArticleSkeletonGrid from "./ArticleSkeleton.jsx";
import { ARTICLE_PAGE_SIZE } from "./constants.js";

const SavedArticles = () => {
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
  } = useArticles({ source: "saved", limit: ARTICLE_PAGE_SIZE });

  const { toggleLike, toggleSave } = useArticleActions(updateArticle);

  const handleSave = useCallback(
    async (article) => {
      const wasSaved = Boolean(article.savedByMe);
      const result = await toggleSave(article);

      if (wasSaved && result) {
        removeArticle(article.id);
      }
    },
    [removeArticle, toggleSave]
  );

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
      <div className="mb-6">
        <Link
          to="/articles"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#1ABC9C] hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          All articles
        </Link>
        <h1 className="mt-2 text-3xl font-extrabold sm:text-4xl">
          Saved articles
        </h1>
        <p className="mt-1 text-sm text-[#CED4DA]/60" aria-live="polite">
          {loading
            ? "Loading your saved articles..."
            : `${total} saved ${total === 1 ? "article" : "articles"}`}
        </p>
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
          icon={Bookmark}
          title="Nothing saved yet"
          description="Tap the bookmark icon on any article and it will appear here."
          action={
            <Link
              to="/articles"
              className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
            >
              Browse articles
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
                onSave={handleSave}
              />
            ))}
          </div>

          <div ref={sentinelRef} aria-hidden="true" className="h-2" />

          {loadingMore ? (
            <div className="flex items-center justify-center gap-2 py-4 text-sm text-[#CED4DA]/55">
              <Loader2 className="h-5 w-5 animate-spin text-[#1ABC9C]" />
              Loading more saved articles...
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

export default SavedArticles;
