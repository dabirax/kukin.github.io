import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchArticle,
  normalizeArticle,
  recordArticleView,
} from "../api/articles.js";

export const useArticle = (slug) => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);
  const requestRef = useRef(0);

  useEffect(() => {
    if (!slug) {
      setArticle(null);
      setLoading(false);
      return undefined;
    }

    const requestId = requestRef.current + 1;
    requestRef.current = requestId;
    setLoading(true);
    setError(null);

    fetchArticle(slug)
      .then((payload) => {
        if (requestId !== requestRef.current) return;
        setArticle(normalizeArticle(payload?.article || payload));
        setLoading(false);
      })
      .catch((requestError) => {
        if (requestId !== requestRef.current) return;
        setArticle(null);
        setError(
          requestError?.message || "Unable to load this article."
        );
        setLoading(false);
      });

    return () => {
      requestRef.current += 1;
    };
  }, [slug, attempt]);

  useEffect(() => {
    if (!article?.slug || article.status !== "published") return;

    const key = `kukin:article-view:${article.slug}`;

    try {
      if (window.sessionStorage.getItem(key)) return;
      window.sessionStorage.setItem(key, "1");
    } catch {
      return;
    }

    recordArticleView(article.slug)
      .then((data) => {
        if (typeof data?.viewCount !== "number") return;
        setArticle((current) =>
          current
            ? { ...current, viewCount: data.viewCount }
            : current
        );
      })
      .catch(() => {
        // A failed view count should never block reading the article.
      });
  }, [article?.slug, article?.status]);

  const retry = useCallback(() => {
    setAttempt((value) => value + 1);
  }, []);

  const updateArticle = useCallback((patch) => {
    setArticle((current) =>
      current ? { ...current, ...patch } : current
    );
  }, []);

  return {
    article,
    loading,
    error,
    retry,
    updateArticle,
  };
};
