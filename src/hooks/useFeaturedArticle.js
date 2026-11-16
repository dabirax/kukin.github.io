import { useEffect, useState } from "react";
import {
  fetchFeaturedArticle,
  normalizeArticle,
} from "../api/articles.js";

export const useFeaturedArticle = () => {
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    fetchFeaturedArticle()
      .then((payload) => {
        if (!active) return;
        setArticle(
          payload?.article ? normalizeArticle(payload.article) : null
        );
      })
      .catch(() => {
        if (active) setArticle(null);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  const updateArticle = (id, patch) => {
    setArticle((current) =>
      current && current.id === id ? { ...current, ...patch } : current
    );
  };

  return { article, loading, updateArticle };
};
