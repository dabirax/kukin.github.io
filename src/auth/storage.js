export const TOKEN_KEY = "kukin:auth:token";

export const getToken = () => {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(TOKEN_KEY) || "";
};

export const setToken = (token) => {
  if (typeof window === "undefined") return;

  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

export const clearToken = () => setToken("");
