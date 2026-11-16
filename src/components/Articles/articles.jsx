import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  Bookmark,
  Loader2,
  Plus,
  SearchX,
} from "lucide-react";
import { useArticles } from "../../hooks/useArticles.js";
import { useArticleActions } from "../../hooks/useArticleActions.js";
import { useDebouncedValue } from "../../hooks/useDebouncedValue.js";
import { useFeaturedArticle } from "../../hooks/useFeaturedArticle.js";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll.js";
import ArticleCard from "./ArticleCard.jsx";
import ArticleEmptyState from "./ArticleEmptyState.jsx";
import ArticleFilters from "./ArticleFilters.jsx";
import ArticleSearchBar from "./ArticleSearchBar.jsx";
import ArticleSkeletonGrid from "./ArticleSkeleton.jsx";
import FeaturedArticle from "./FeaturedArticle.jsx";
import { ARTICLE_PAGE_SIZE } from "./constants.js";

const Articles = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(initialQuery);
  const debouncedSearch = useDebouncedValue(searchInput, 350);

  const category = searchParams.get("category") || "All";
  const sort = searchParams.get("sort") || "newest";
  const urlQuery = searchParams.get("q") || "";
  const lastUrlQueryRef = useRef(urlQuery);

  useEffect(() => {
    if (lastUrlQueryRef.current === urlQuery) return;

    lastUrlQueryRef.current = urlQuery;
    setSearchInput(urlQuery);
  }, [urlQuery]);

  const updateParam = useCallback(
    (key, value) => {
      const next = new URLSearchParams(searchParams);

      if (!value || value === "All" || value === "newest") {
        if (key !== "sort" || value !== "newest") next.delete(key);
        if (key === "sort" && value === "newest") next.delete(key);
      } else {
        next.set(key, value);
      }

      setSearchParams(next, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  useEffect(() => {
    const nextQuery = debouncedSearch.trim();
    const currentQuery = searchParams.get("q") || "";
    if (nextQuery === currentQuery) return;

    const next = new URLSearchParams(searchParams);

    if (nextQuery) {
      next.set("q", nextQuery);
    } else {
      next.delete("q");
    }

    setSearchParams(next, { replace: true });
  }, [debouncedSearch, searchParams, setSearchParams]);

  const params = useMemo(
    () => ({
      q: debouncedSearch.trim(),
      category: category === "All" ? "" : category,
      sort,
      limit: ARTICLE_PAGE_SIZE,
    }),
    [category, debouncedSearch, sort]
  );

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
  } = useArticles(params);

  const {
    article: featured,
    updateArticle: updateFeatured,
  } = useFeaturedArticle();

  const handleUpdate = useCallback(
    (id, patch) => {
      updateArticle(id, patch);
      updateFeatured(id, patch);
    },
    [updateArticle, updateFeatured]
  );

  const { toggleLike, toggleSave } = useArticleActions(handleUpdate);
  const showFeatured =
    Boolean(featured) &&
    !debouncedSearch.trim() &&
    category === "All" &&
    sort === "newest";
  const visibleItems = showFeatured
    ? items.filter((item) => item.id !== featured.id)
    : items;
  const searching = searchInput !== debouncedSearch;

  const sentinelRef = useInfiniteScroll({
    enabled:
      hasMore &&
      !loading &&
      !loadingMore &&
      !nextError &&
      visibleItems.length > 0,
    onLoadMore: loadMore,
  });

  return (
    <div className="container pb-10 text-[#CED4DA]">
      <div className="mb-8 flex flex-col gap-1 lg:flex-row lg:items-end lg:justify-between">
        <div>
         
          <h1 className=" text-3xl font-extrabold sm:text-4xl">
            Articles, recipes & food facts
          </h1>
        
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/articles/saved"
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-3 py-2.5 text-sm font-bold text-[#CED4DA] transition hover:border-[#1ABC9C]/40 hover:text-[#1ABC9C]"
          >
            <Bookmark className="h-4 w-4" />
            Saved
          </Link>
          <Link
            to="/articles/mine"
            className="rounded-full border border-white/10 px-3 py-2.5 text-sm font-bold text-[#CED4DA] transition hover:border-[#1ABC9C]/40 hover:text-[#1ABC9C]"
          >
            My articles
          </Link>
          <Link
            to="/articles/new"
            className="inline-flex items-center gap-2 rounded-full bg-[#1ABC9C] px-3 py-2.5 text-xs font-bold text-white transition hover:bg-[#16a085]"
          >
            <Plus className="h-4 w-4" />
            Add article
          </Link>
        </div>
      </div>

      <div className="space-y-4 rounded-3xl bg-[#1E1E2F]/60 p-4 ring-1 ring-white/10 sm:p-5">
        <ArticleSearchBar
          value={searchInput}
          onChange={setSearchInput}
          onClear={() => setSearchInput("")}
          loading={searching || (loading && Boolean(debouncedSearch.trim()))}
        />
        <ArticleFilters
          category={category}
          onCategoryChange={(value) => updateParam("category", value)}
          sort={sort}
          onSortChange={(value) => updateParam("sort", value)}
        />
      </div>

      <div className="mt-5 flex items-center justify-between gap-4">
        <p
          className="text-sm text-[#CED4DA]/50"
          aria-live="polite"
        >
          {loading
            ? "Loading articles..."
            : ""
              }
        </p>
        {debouncedSearch.trim() ? (
          <button
            type="button"
            onClick={() => setSearchInput("")}
            className="text-sm font-semibold text-[#1ABC9C] hover:underline"
          >
            Clear search
          </button>
        ) : null}
      </div>

      <div className="mt-5 space-y-8">
        {showFeatured ? (
          <FeaturedArticle
            article={featured}
            onLike={toggleLike}
            onSave={toggleSave}
          />
        ) : null}

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
        ) : visibleItems.length === 0 ? (
          <ArticleEmptyState
            icon={SearchX}
            title={debouncedSearch.trim() ? "No matching articles" : "No articles yet"}
            description={
              debouncedSearch.trim()
                ? `We could not find anything for “${debouncedSearch.trim()}”. Try another search or clear your filters.`
                : "Nothing has been published here yet. Check back soon or start the first article."
            }
            action={
              debouncedSearch.trim() || category !== "All" ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchInput("");
                    setSearchParams({}, { replace: true });
                  }}
                  className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
                >
                  Clear filters
                </button>
              ) : (
                <Link
                  to="/articles/new"
                  className="rounded-full bg-[#1ABC9C] px-6 py-2.5 font-bold text-white"
                >
                  Write an article
                </Link>
              )
            }
          />
        ) : (
          <>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {visibleItems.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onLike={toggleLike}
                  onSave={toggleSave}
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
    </div>
  );
};

export default Articles;
