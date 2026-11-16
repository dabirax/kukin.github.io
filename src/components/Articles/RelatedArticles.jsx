import { useCallback, useMemo } from "react";
import { useArticles } from "../../hooks/useArticles.js";
import { useArticleActions } from "../../hooks/useArticleActions.js";
import ArticleCard from "./ArticleCard.jsx";
import { ArticleSkeletonGrid } from "./ArticleSkeleton.jsx";

const RelatedArticles = ({ article }) => {
  const params = useMemo(
    () => ({
      category: article?.category || "",
      sort: "popular",
      limit: 4,
    }),
    [article?.category]
  );

  const {
    items,
    loading,
    updateArticle,
  } = useArticles(params);

  const handleUpdate = useCallback(
    (id, patch) => updateArticle(id, patch),
    [updateArticle]
  );

  const { toggleLike, toggleSave } = useArticleActions(handleUpdate);

  const related = items
    .filter((item) => item.id !== article?.id)
    .slice(0, 3);

  if (!article?.category) return null;

  if (loading) {
    return (
      <section className="mt-12">
        <h2 className="mb-5 text-2xl font-extrabold">More like this</h2>
        <ArticleSkeletonGrid count={3} />
      </section>
    );
  }

  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <div className="mb-5 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1ABC9C]">
            Keep reading
          </p>
          <h2 className="mt-1 text-2xl font-extrabold">More like this</h2>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {related.map((item) => (
          <ArticleCard
            key={item.id}
            article={item}
            onLike={toggleLike}
            onSave={toggleSave}
          />
        ))}
      </div>
    </section>
  );
};

export default RelatedArticles;
