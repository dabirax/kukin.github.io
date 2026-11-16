import { request } from "./client.js";

export const getCart = () => request("/api/cart");

export const replaceCart = (items) =>
  request("/api/cart", {
    method: "PUT",
    body: { items },
  });

export const clearCart = () =>
  request("/api/cart", {
    method: "DELETE",
  });
