import { useCallback, useEffect, useRef, useState } from "react";
import {
  fetchArticles,
  fetchMyArticles,
  fetchSavedArticles,
  normalizeArticlePage,
} from "../api/articles.js";

const initialState = {
  items: [],
  loading: true,
  loadingMore: false,
  error: null,
  nextError: null,
  page: 0,
  total: 0,
  totalPages: 0,
  hasMore: true,
};

export const useArticles = (params = {}) => {
  const paramsKey = JSON.stringify(params);
  const paramsRef = useRef(params);
  paramsRef.current = params;

  const [state, setState] = useState(initialState);
  const stateRef = useRef(state);
  stateRef.current = state;

  const requestRef = useRef(0);
  const fetchingRef = useRef(false);

  const loadPage = useCallback(async (page, { replace = false } = {}) => {
    if (fetchingRef.current && !replace) return;

    const requestId = replace
      ? requestRef.current + 1
      : requestRef.current;

    if (replace) requestRef.current = requestId;
    fetchingRef.current = true;

    setState((previous) =>
      replace
        ? {
            ...previous,
            items: [],
            loading: true,
            loadingMore: false,
            error: null,
            nextError: null,
            page: 0,
            total: 0,
            totalPages: 0,
            hasMore: true,
          }
        : {
            ...previous,
            loadingMore: true,
            nextError: null,
          }
    );

    const { source = "all", ...query } = paramsRef.current;
    const fetchPage =
      source === "saved"
        ? fetchSavedArticles
        : source === "mine"
          ? fetchMyArticles
          : fetchArticles;

    try {
      const payload = await fetchPage({ ...query, page });

      if (requestId !== requestRef.current) return;

      const pageData = normalizeArticlePage(payload);
      const fallbackLimit = Number(query.limit) || 12;
      const totalPages =
        pageData.totalPages ||
        (pageData.total
          ? Math.ceil(pageData.total / fallbackLimit)
          : 0);

      setState((previous) => {
        const seen = new Set();
        const items = [];

        for (const item of [
          ...(replace ? [] : previous.items),
          ...pageData.items,
        ]) {
          if (!item.id || seen.has(item.id)) continue;
          seen.add(item.id);
          items.push(item);
        }

        return {
          ...previous,
          items,
          loading: false,
          loadingMore: false,
          error: null,
          nextError: null,
          page,
          total: pageData.total || items.length,
          totalPages,
          hasMore: pageData.hasMore || page < totalPages,
        };
      });
    } catch (error) {
      if (requestId !== requestRef.current) return;

      const message =
        error?.message || "Unable to load articles right now.";

      setState((previous) =>
        replace
          ? {
              ...previous,
              loading: false,
              loadingMore: false,
              error: message,
              hasMore: false,
            }
          : {
              ...previous,
              loadingMore: false,
              nextError: message,
            }
      );
    } finally {
      if (requestId === requestRef.current) {
        fetchingRef.current = false;
      }
    }
  }, []);

  useEffect(() => {
    fetchingRef.current = false;
    loadPage(1, { replace: true });

    return () => {
      requestRef.current += 1;
      fetchingRef.current = false;
    };
  }, [paramsKey, loadPage]);

  const loadMore = useCallback(() => {
    const current = stateRef.current;

    if (
      current.loading ||
      current.loadingMore ||
      !current.hasMore ||
      current.nextError ||
      fetchingRef.current
    ) {
      return;
    }

    loadPage(current.page + 1);
  }, [loadPage]);

  const retry = useCallback(() => {
    const current = stateRef.current;
    const hasItems = current.items.length > 0;

    setState((previous) => ({ ...previous, nextError: null }));
    loadPage(hasItems ? current.page + 1 : 1, { replace: !hasItems });
  }, [loadPage]);

  const reload = useCallback(() => {
    loadPage(1, { replace: true });
  }, [loadPage]);

  const updateArticle = useCallback((id, patch) => {
    setState((previous) => ({
      ...previous,
      items: previous.items.map((item) =>
        item.id === id ? { ...item, ...patch } : item
      ),
    }));
  }, []);

  const removeArticle = useCallback((id) => {
    setState((previous) => ({
      ...previous,
      items: previous.items.filter((item) => item.id !== id),
      total: Math.max(0, previous.total - 1),
    }));
  }, []);

  return {
    ...state,
    loadMore,
    retry,
    reload,
    updateArticle,
    removeArticle,
  };
};
