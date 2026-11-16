import { clearToken, getToken } from "../auth/storage.js";

const FALLBACK_API_BASE = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://kukinbackend.onrender.com";

export const API_BASE = (
  import.meta.env.VITE_API_URL || FALLBACK_API_BASE
).replace(/\/$/, "");

const DEFAULT_TIMEOUT = 30000;

const STATUS_MESSAGES = {
  400: "The request could not be processed. Please check your details.",
  401: "Please sign in to continue.",
  403: "You do not have permission to do that.",
  404: "This page or resource could not be found.",
  408: "The request took too long. Please try again.",
  409: "That action conflicts with something that already exists.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "The server had a problem. Please try again.",
  502: "The server is temporarily unavailable. Please try again.",
  503: "The service is temporarily unavailable. Please try again.",
  504: "The server took too long to respond. Please try again.",
};

const looksLikeHtml = (value) =>
  typeof value === "string" &&
  /<!doctype|<html|<head|<body|Cannot (GET|POST|PUT|PATCH|DELETE)/i.test(
    value
  );

const extractMessage = (payload, status) => {
  if (payload && typeof payload === "object") {
    const message = String(payload.message || "").trim();

    if (message) return message;
  }

  if (typeof payload === "string") {
    const text = payload.trim();

    if (text && !looksLikeHtml(text)) return text;
  }

  return (
    STATUS_MESSAGES[status] ||
    `Request failed with status ${status || "unknown"}`
  );
};

export class ApiError extends Error {
  constructor(message, { status = 0, code = "", errors = null, payload = null } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = code;
    this.errors = errors;
    this.payload = payload;
  }
}

export const request = async (
  path,
  {
    method = "GET",
    body,
    auth = true,
    timeout = DEFAULT_TIMEOUT,
    headers = {},
  } = {}
) => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeout);
  const token = getToken();
  const isFormData = body instanceof FormData;
  const requestHeaders = { ...headers };

  if (!isFormData && body !== undefined) {
    requestHeaders["content-type"] = "application/json";
  }

  if (auth && token) {
    requestHeaders.authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE}${path}`, {
      method,
      headers: requestHeaders,
      body:
        body === undefined || isFormData
          ? body
          : JSON.stringify(body),
      signal: controller.signal,
    });

    const contentType = response.headers.get("content-type") || "";
    const payload = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      const message = extractMessage(payload, response.status);

      const error = new ApiError(message, {
        status: response.status,
        code: payload?.code || "",
        errors: payload?.errors || null,
        payload,
      });

      if (response.status === 401 && auth && token) {
        clearToken();
        window.dispatchEvent(new CustomEvent("kukin:auth-expired"));
      }

      throw error;
    }

    return payload;
  } catch (error) {
    if (error instanceof ApiError) throw error;

    if (error.name === "AbortError") {
      throw new ApiError("The request took too long. Please try again.", {
        code: "REQUEST_TIMEOUT",
      });
    }

    throw new ApiError(
      error.message || "Unable to reach the server. Check your connection.",
      { code: "NETWORK_ERROR" }
    );
  } finally {
    clearTimeout(timer);
  }
};
