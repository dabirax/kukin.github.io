import { API_BASE } from "./client.js";

const REQUEST_TIMEOUT = 90000;

export const normalizeProduct = (product) => {
  const category = (product.category ?? product.foodType ?? "Others")
    .toString()
    .trim();

  return {
    ...product,
    id: Number(product.id),
    category,
    price: Number(product.price),
    rating: String(product.rating ?? "").trim(),
    amount: Number(product.amount) || 1,
    img: product.img || "",
  };
};

export const fetchProducts = async () => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_BASE}/api/products`, {
      signal: controller.signal,
    });

    if (!response.ok) {
      throw new Error(`Request failed with status ${response.status}`);
    }

    const payload = await response.json();

    if (!Array.isArray(payload)) {
      throw new Error("Unexpected response from the server");
    }

    return payload.map(normalizeProduct);
  } finally {
    clearTimeout(timer);
  }
};
