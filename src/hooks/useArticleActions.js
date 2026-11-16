import { useCallback, useRef } from "react";
import {
  likeArticle,
  saveArticle,
  unlikeArticle,
  unsaveArticle,
} from "../api/articles.js";
import { useAuth } from "../auth/useAuth.js";
import { useGlobalContext } from "../useGlobalContext.js";

export const useArticleActions = (onUpdate) => {
  const { isAuthenticated, openAuth } = useAuth();
  const { notify } = useGlobalContext();
  const pendingRef = useRef(new Set());

  const toggleLike = useCallback(
    async (article) => {
      if (!article?.id) return null;

      if (!isAuthenticated) {
        openAuth("login", { notice: "Sign in to like articles." });
        return null;
      }

      const key = `like:${article.id}`;
      if (pendingRef.current.has(key)) return null;
      pendingRef.current.add(key);

      const wasLiked = Boolean(article.likedByMe);
      const originalCount = Number(article.likeCount) || 0;
      const nextLiked = !wasLiked;
      const nextCount = Math.max(0, originalCount + (nextLiked ? 1 : -1));

      onUpdate?.(article.id, {
        likedByMe: nextLiked,
        likeCount: nextCount,
      });

      try {
        const data = wasLiked
          ? await unlikeArticle(article.id)
          : await likeArticle(article.id);

        onUpdate?.(article.id, {
          likedByMe: Boolean(data?.liked),
          likeCount: Number(data?.likeCount) || 0,
        });

        notify(wasLiked ? "Like removed" : "Article liked");
        return data;
      } catch (error) {
        onUpdate?.(article.id, {
          likedByMe: wasLiked,
          likeCount: originalCount,
        });
        notify(error?.message || "Unable to update your like.");
        return null;
      } finally {
        pendingRef.current.delete(key);
      }
    },
    [isAuthenticated, notify, onUpdate, openAuth]
  );

  const toggleSave = useCallback(
    async (article) => {
      if (!article?.id) return null;

      if (!isAuthenticated) {
        openAuth("login", { notice: "Sign in to save articles." });
        return null;
      }

      const key = `save:${article.id}`;
      if (pendingRef.current.has(key)) return null;
      pendingRef.current.add(key);

      const wasSaved = Boolean(article.savedByMe);
      const originalCount = Number(article.bookmarkCount) || 0;
      const nextSaved = !wasSaved;
      const nextCount = Math.max(0, originalCount + (nextSaved ? 1 : -1));

      onUpdate?.(article.id, {
        savedByMe: nextSaved,
        bookmarkCount: nextCount,
      });

      try {
        const data = wasSaved
          ? await unsaveArticle(article.id)
          : await saveArticle(article.id);

        onUpdate?.(article.id, {
          savedByMe: Boolean(data?.saved),
          bookmarkCount: Number(data?.bookmarkCount) || 0,
        });

        notify(wasSaved ? "Removed from saved" : "Article saved");
        return data;
      } catch (error) {
        onUpdate?.(article.id, {
          savedByMe: wasSaved,
          bookmarkCount: originalCount,
        });
        notify(error?.message || "Unable to update saved articles.");
        return null;
      } finally {
        pendingRef.current.delete(key);
      }
    },
    [isAuthenticated, notify, onUpdate, openAuth]
  );

  return { toggleLike, toggleSave };
};
