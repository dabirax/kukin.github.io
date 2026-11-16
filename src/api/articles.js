import { request } from "./client.js";

const buildQuery = (params = {}) => {
  const query = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    query.set(key, String(value));
  });

  const value = query.toString();
  return value ? `?${value}` : "";
};

export const normalizeArticle = (article = {}) => {
  const author =
    article.author && typeof article.author === "object"
      ? article.author
      : {};

  return {
    id: String(article.id || article._id || ""),
    slug: article.slug || "",
    title: article.title || "",
    excerpt: article.excerpt || "",
    content: article.content || "",
    coverImage: article.coverImage || "",
    category: article.category || "Health News",
    tags: Array.isArray(article.tags) ? article.tags : [],
    author: {
      id: String(author.id || article.authorId || ""),
      name: author.name || article.authorName || "Kukin contributor",
      avatarUrl: author.avatarUrl || article.authorAvatar || "",
    },
    status: article.status || "published",
    featured: Boolean(article.featured),
    sources: Array.isArray(article.sources) ? article.sources : [],
    readTime: Number(article.readTime) || 1,
    likeCount: Number(article.likeCount) || 0,
    bookmarkCount: Number(article.bookmarkCount) || 0,
    viewCount: Number(article.viewCount) || 0,
    publishedAt: article.publishedAt || article.createdAt || null,
    createdAt: article.createdAt || null,
    updatedAt: article.updatedAt || null,
    likedByMe: Boolean(article.likedByMe),
    savedByMe: Boolean(article.savedByMe),
    isOwner: Boolean(article.isOwner),
  };
};

export const normalizeArticleList = (payload) => {
  const items = Array.isArray(payload)
    ? payload
    : Array.isArray(payload?.items)
      ? payload.items
      : [];

  return items.map(normalizeArticle);
};

export const normalizeArticlePage = (payload) => ({
  items: normalizeArticleList(payload),
  total: Number(payload?.total) || 0,
  page: Number(payload?.page) || 1,
  totalPages: Number(payload?.totalPages) || 0,
  hasMore: Boolean(payload?.hasMore),
});

export const fetchArticles = (params = {}) =>
  request(`/api/articles${buildQuery(params)}`);

export const fetchFeaturedArticle = () => request("/api/articles/featured");

export const fetchMyArticles = (params = {}) =>
  request(`/api/articles/mine${buildQuery(params)}`);

export const fetchSavedArticles = (params = {}) =>
  request(`/api/articles/saved${buildQuery(params)}`);

export const fetchArticle = (slug) =>
  request(`/api/articles/${encodeURIComponent(slug)}`);

export const recordArticleView = (slug) =>
  request(`/api/articles/${encodeURIComponent(slug)}/view`, {
    method: "POST",
  });

export const createArticle = (payload) =>
  request("/api/articles", {
    method: "POST",
    body: payload,
  });

export const updateArticle = (id, payload) =>
  request(`/api/articles/${encodeURIComponent(id)}`, {
    method: "PATCH",
    body: payload,
  });

export const publishArticle = (id) =>
  request(`/api/articles/${encodeURIComponent(id)}/publish`, {
    method: "PATCH",
  });

export const deleteArticle = (id) =>
  request(`/api/articles/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });

export const likeArticle = (id) =>
  request(`/api/articles/${encodeURIComponent(id)}/like`, {
    method: "POST",
  });

export const unlikeArticle = (id) =>
  request(`/api/articles/${encodeURIComponent(id)}/like`, {
    method: "DELETE",
  });

export const saveArticle = (id) =>
  request(`/api/articles/${encodeURIComponent(id)}/save`, {
    method: "POST",
  });

export const unsaveArticle = (id) =>
  request(`/api/articles/${encodeURIComponent(id)}/save`, {
    method: "DELETE",
  });

export const reportArticle = (id, payload) =>
  request(`/api/articles/${encodeURIComponent(id)}/report`, {
    method: "POST",
    body: payload,
  });

export const uploadArticleCover = (file) => {
  const formData = new FormData();
  formData.append("image", file);

  return request("/api/articles/cover", {
    method: "POST",
    body: formData,
    timeout: 60000,
  });
};
