import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Heart, Utensils } from "lucide-react";
import { useProducts } from "../../hooks/useProducts.js";
import { useGlobalContext } from "../../useGlobalContext.js";
import {
  getCartProducts,
  getFavouriteProducts,
  getHeroProductImage,
  getNewProducts,
  getPopularProducts,
  getPreferredCategories,
  getRecommendedProducts,
} from "../../utils/homeRecommendations.js";
import Hero from "./components/Hero";
import Section from "./components/Section";
import SectionCard from "./components/SectionCard";
import TrendingArticles from "./components/TrendingArticles";
import CategoryShortcuts from "./components/CategoryShortcuts";

const DISCOVER_ID = "discover-dishes";
const PERSONAL_ID = "made-for-you";

const DISCOVER_TABS = [
  { id: "popular", label: "Popular" },
  { id: "new", label: "New" },
];

const PERSONAL_TABS = [
  { id: "favourites", label: "Favourites" },
  { id: "foryou", label: "For you" },
];

const SkeletonCards = ({ count = 4 }) =>
  Array.from({ length: count }).map((_, index) => (
    <div
      key={index}
      className="w-[min(72vw,16rem)] shrink-0 snap-start overflow-hidden rounded-2xl bg-[#05010f]/50 ring-1 ring-white/10 sm:w-[16rem] xl:w-[15rem]"
    >
      <div className="h-28 animate-pulse bg-white/5" />
      <div className="space-y-2 p-2.5">
        <div className="h-4 w-4/5 animate-pulse rounded bg-white/10" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-white/5" />
        <div className="h-8 animate-pulse rounded-xl bg-white/10" />
      </div>
    </div>
  ));

const EmptyState = ({ icon: Icon, message, to, label }) => (
  <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-4 text-center">
    <Icon aria-hidden="true" className="h-6 w-6 text-[#1ABC9C]/60" />
    <p className="max-w-sm text-sm text-[#CED4DA]/60">{message}</p>
    <Link
      to={to}
      className="rounded-full bg-[#1ABC9C]/15 px-4 py-1.5 text-xs font-bold text-[#1ABC9C] ring-1 ring-[#1ABC9C]/20 transition hover:bg-[#1ABC9C]/25"
    >
      {label}
    </Link>
  </div>
);

export function Home() {
  const { products, categories, loading, error, retry } = useProducts();
  const { favorites, cart } = useGlobalContext();
  const [discoverTab, setDiscoverTab] = useState("popular");
  const [personalTab, setPersonalTab] = useState("foryou");

  const favouriteProducts = useMemo(
    () => getFavouriteProducts(products, favorites),
    [favorites, products]
  );
  const cartProducts = useMemo(
    () => getCartProducts(products, cart),
    [cart, products]
  );
  const preferredCategories = useMemo(
    () => getPreferredCategories(products, favorites, cart),
    [cart, favorites, products]
  );
  const heroImage = useMemo(() => getHeroProductImage(products), [products]);

  const discoverItems = useMemo(
    () =>
      discoverTab === "new" ? getNewProducts(products) : getPopularProducts(products),
    [discoverTab, products]
  );

  const personalItems = useMemo(() => {
    if (personalTab === "favourites") return favouriteProducts;

    return getRecommendedProducts(products, preferredCategories.all, {
      excludeIds: [
        ...favouriteProducts.map((product) => product.id),
        ...cartProducts.map((product) => product.id),
      ],
      limit: 12,
    });
  }, [
    cartProducts,
    favouriteProducts,
    personalTab,
    preferredCategories.all,
    products,
  ]);

  const personalTabs = PERSONAL_TABS.map((tab) => ({
    ...tab,
    count: tab.id === "favourites" ? favouriteProducts.length : undefined,
  }));

  const getEmptyState = (tab) =>
    error ? (
      <div className="flex min-h-28 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 px-6 py-4 text-center">
        <p className="text-sm text-[#CED4DA]/70">{error}</p>
        <button
          type="button"
          onClick={retry}
          className="rounded-full bg-[#1ABC9C]/15 px-4 py-1.5 text-xs font-bold text-[#1ABC9C] ring-1 ring-[#1ABC9C]/20 transition hover:bg-[#1ABC9C]/25"
        >
          Try again
        </button>
      </div>
    ) : tab === "favourites" ? (
      <EmptyState
        icon={Heart}
        message="You have not favourited any dishes yet. Tap the heart on a dish to keep it close."
        to="/menu"
        label="Browse dishes"
      />
    ) : (
      <EmptyState
        icon={Utensils}
        message="No dishes available here yet. Explore the menu to find something you will love."
        to="/menu"
        label="Explore menu"
      />
    );

  return (
    <div className="container pb-8">
      <Hero image={heroImage} />

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="flex min-w-0 flex-col gap-4 xl:col-span-2">
          <Section
            id={DISCOVER_ID}
            title="Discover dishes"
            action={
              <Link
                to="/menu"
                className="inline-flex items-center gap-1 text-xs font-bold text-[#1ABC9C] hover:text-[#16a085]"
              >
                View full menu
                <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
              </Link>
            }
            tabs={DISCOVER_TABS}
            activeTab={discoverTab}
            onTabChange={setDiscoverTab}
            empty={
              !loading && (error || discoverItems.length === 0)
                ? getEmptyState(discoverTab)
                : null
            }
          >
            {loading ? <SkeletonCards /> : null}
            {!loading && !error
              ? discoverItems.map((product) => (
                  <SectionCard key={product.id} product={product} />
                ))
              : null}
          </Section>

          <Section
            id={PERSONAL_ID}
            title="Made for you"
            tabs={personalTabs}
            activeTab={personalTab}
            onTabChange={setPersonalTab}
            empty={
              !loading && (error || personalItems.length === 0)
                ? getEmptyState(personalTab)
                : null
            }
          >
            {loading ? <SkeletonCards /> : null}
            {!loading && !error
              ? personalItems.map((product) => (
                  <SectionCard key={product.id} product={product} />
                ))
              : null}
          </Section>

          <CategoryShortcuts categories={categories} />
        </div>

        <TrendingArticles />
      </div>
    </div>
  );
}
