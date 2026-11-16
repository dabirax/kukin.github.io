import { clearToken, getToken } from "../auth/storage.js";

const FALLBACK_API_BASE = import.meta.env.DEV
  ? "http://localhost:5000"
  : "https://kukinbackend.onrender.com";

export const API_BASE = (
  import.meta.env.VITE_API_URL || FALLBACK_API_BASE
).replace(/\/$/, "");

const DEFAULT_TIMEOUT = 30000;

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
      const message =
        (payload && payload.message) ||
        (typeof payload === "string" && payload) ||
        `Request failed with status ${response.status}`;

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
