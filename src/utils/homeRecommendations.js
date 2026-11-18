const toNumber = (value) => {
  const parsed = Number.parseFloat(String(value ?? "").replace(/[^0-9.-]/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
};

const getId = (item) => Number(item?.id) || 0;

const byRating = (a, b) => toNumber(b.rating) - toNumber(a.rating) || getId(b) - getId(a);

const getCreatedAt = (product) => {
  const value =
    product?.createdAt ?? product?.created_at ?? product?.date ?? product?.publishedAt;

  if (!value) return 0;

  const timestamp = Date.parse(value);
  return Number.isFinite(timestamp) ? timestamp : 0;
};

export const getPopularProducts = (products = []) => [...products].sort(byRating);

const getProductName = (product) => String(product?.name ?? "").toLowerCase();

export const getHeroProductImage = (products = []) => {
  const jollofRice = products.find(
    (product) => product.img && getProductName(product).includes("jollof rice")
  );
  const jollof = jollofRice
    ? jollofRice
    : products.find(
        (product) => product.img && getProductName(product).includes("jollof")
      );

  return (
    jollof?.img ||
    getPopularProducts(products).find((product) => product.img)?.img ||
    ""
  );
};

export const getNewProducts = (products = []) =>
  [...products].sort(
    (a, b) => getCreatedAt(b) - getCreatedAt(a) || getId(b) - getId(a)
  );

const toProductsById = (products = []) =>
  new Map(products.map((product) => [getId(product), product]));

export const getFavouriteProducts = (products = [], favourites = []) => {
  const byId = toProductsById(products);

  return (Array.isArray(favourites) ? favourites : [])
    .map((id) => byId.get(Number(id)))
    .filter(Boolean);
};

export const getCartProducts = (products = [], cart = []) => {
  const byId = toProductsById(products);

  return (Array.isArray(cart) ? cart : [])
    .map((item) => byId.get(getId(item)))
    .filter(Boolean);
};

export const getPreferredCategories = (products = [], favourites = [], cart = []) => {
  const favouriteCategories = [
    ...new Set(
      getFavouriteProducts(products, favourites)
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];
  const cartCategories = [
    ...new Set(
      getCartProducts(products, cart)
        .map((product) => product.category)
        .filter(Boolean)
    ),
  ];

  return {
    favourites: favouriteCategories,
    cart: cartCategories,
    all: [...new Set([...favouriteCategories, ...cartCategories])],
  };
};

export const getRecommendedProducts = (
  products = [],
  categories = [],
  { excludeIds = [], limit = 8 } = {}
) => {
  const excluded = new Set(
    (Array.isArray(excludeIds) ? excludeIds : []).map((id) => Number(id))
  );
  const preferred = new Set((Array.isArray(categories) ? categories : []).filter(Boolean));

  return [...products]
    .filter((product) => !excluded.has(getId(product)))
    .map((product) => ({
      product,
      score:
        (preferred.has(product.category) ? 3 : 0) +
        toNumber(product.rating) +
        (getCreatedAt(product) ? 0.25 : 0),
    }))
    .sort((a, b) => b.score - a.score || byRating(a.product, b.product))
    .slice(0, limit)
    .map(({ product }) => product);
};
