import { useCallback, useEffect, useState } from "react";
import { fetchProducts } from "../api/products.js";

export const CATEGORY_LABELS = {
  Soups: "Nigerian Soups",
  Rice: "Rice Dishes",
  Meat: "Grilled & Meat",
  Swallows: "Swallows & Staples",
  Street: "Street Food",
  Drinks: "Drinks",
};

const buildCategories = (products) => {
  const grouped = new Map();

  products.forEach((product) => {
    const name = product.category || "Others";

    if (!grouped.has(name)) {
      grouped.set(name, {
        id: name,
        name,
        title: CATEGORY_LABELS[name] ?? name,
        accessor: name,
        image: product.img,
        items: [],
      });
    }

    grouped.get(name).items.push(product);
  });

  return Array.from(grouped.values());
};

let cache = null;
let inflight = null;

const loadProducts = () => {
  if (cache) return Promise.resolve(cache);

  if (!inflight) {
    inflight = fetchProducts()
      .then((products) => {
        cache = products;
        return products;
      })
      .finally(() => {
        inflight = null;
      });
  }

  return inflight;
};

export const useProducts = () => {
  const [products, setProducts] = useState(cache ?? []);
  const [loading, setLoading] = useState(!cache);
  const [error, setError] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let active = true;

    if (cache && attempt === 0) {
      setProducts(cache);
      setLoading(false);
      return () => {
        active = false;
      };
    }

    setLoading(true);
    setError(null);

    loadProducts()
      .then((items) => {
        if (!active) return;
        setProducts(items);
        setLoading(false);
      })
      .catch((err) => {
        if (!active) return;
        const message =
          err.name === "AbortError"
            ? "The kitchen is taking too long to respond. Please try again."
            : err.message || "Unable to load the menu.";
        setError(message);
        setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [attempt]);

  const retry = useCallback(() => {
    cache = null;
    inflight = null;
    setAttempt((value) => value + 1);
  }, []);

  return {
    products,
    categories: buildCategories(products),
    loading,
    error,
    retry,
  };
};
