import { request } from "./client.js";

export const getPaymentQuote = () => request("/api/payments/quote");

export const initializePayment = () =>
  request("/api/payments/initialize", { method: "POST" });

export const verifyPayment = (reference) =>
  request(`/api/payments/verify/${encodeURIComponent(reference)}`);

export const getOrders = () => request("/api/orders");

export const getOrder = (reference) =>
  request(`/api/orders/${encodeURIComponent(reference)}`);
