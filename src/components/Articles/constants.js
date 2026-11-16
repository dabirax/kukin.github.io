export const ARTICLE_CATEGORIES = [
  "Health News",
  "Nutrition",
  "Recipes",
  "Food Safety",
  "Myths & Facts",
];

export const REPORT_REASONS = [
  "Misleading information",
  "Harmful health advice",
  "Inappropriate content",
  "Spam or advertising",
  "Copyright issue",
  "Other",
];

export const CATEGORY_STYLES = {
  "Health News": "bg-sky-500/15 text-sky-300 ring-sky-400/20",
  Nutrition: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/20",
  Recipes: "bg-amber-500/15 text-amber-300 ring-amber-400/20",
  "Food Safety": "bg-rose-500/15 text-rose-300 ring-rose-400/20",
  "Myths & Facts": "bg-violet-500/15 text-violet-300 ring-violet-400/20",
};

export const getCategoryStyle = (category) =>
  CATEGORY_STYLES[category] ||
  "bg-[#1ABC9C]/15 text-[#1ABC9C] ring-[#1ABC9C]/20";

export const ARTICLE_PAGE_SIZE = 12;
