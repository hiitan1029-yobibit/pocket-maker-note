import type { CategoryIconKey } from "../types/CategoryIconKey";

export type CategoryIconTemplate = {
  key: CategoryIconKey;
  label: string;
  hint: string;
};

export type CategoryIconTone = {
  tileSelected: string;
  tileUnselected: string;
  tileCountSelected: string;
  tileCountUnselected: string;
  bar: string;
  barCount: string;
  badge: string;
  iconSurface: string;
  text: string;
};

export const defaultCategoryIconKey: CategoryIconKey = "seasoning-other";

export const categoryIconTemplates: CategoryIconTemplate[] = [
  {
    key: "soy-sauce",
    label: "醤油・つゆ系",
    hint: "醤油、めんつゆ、白だし"
  },
  {
    key: "mayo-sauce",
    label: "マヨ・ソース系",
    hint: "マヨネーズ、ケチャップ、ソース"
  },
  {
    key: "tube-condiment",
    label: "チューブ薬味",
    hint: "にんにく、しょうが、わさび"
  },
  {
    key: "dashi-powder",
    label: "だし・顆粒",
    hint: "顆粒だし、中華だし、コンソメ"
  },
  {
    key: "miso-paste",
    label: "味噌・ペースト",
    hint: "味噌、練りごま、豆板醤"
  },
  {
    key: "vinegar-sauce",
    label: "酢・ぽん酢・たれ",
    hint: "酢、ぽん酢、焼肉のたれ"
  },
  {
    key: "oil",
    label: "油・オイル",
    hint: "ごま油、オリーブオイル、サラダ油"
  },
  {
    key: "milk",
    label: "牛乳・乳飲料",
    hint: "牛乳、乳飲料、飲むヨーグルト"
  },
  {
    key: "drink",
    label: "飲料",
    hint: "お茶、水、ジュース"
  },
  {
    key: "seasoning-other",
    label: "その他",
    hint: "迷ったらここ"
  }
];

const categoryIconKeys = new Set<CategoryIconKey>(
  categoryIconTemplates.map((template) => template.key)
);

const categoryIconTones: Record<CategoryIconKey, CategoryIconTone> = {
  "soy-sauce": {
    tileSelected: "border-blue-700 bg-blue-700 text-white",
    tileUnselected: "border-blue-200 bg-white text-blue-800",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-blue-50 text-blue-700",
    bar: "bg-blue-700 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-blue-50 text-blue-800",
    iconSurface: "bg-blue-50 text-blue-800",
    text: "text-blue-800"
  },
  "mayo-sauce": {
    tileSelected: "border-red-600 bg-red-600 text-white",
    tileUnselected: "border-red-200 bg-white text-red-700",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-red-50 text-red-700",
    bar: "bg-red-600 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-red-50 text-red-700",
    iconSurface: "bg-red-50 text-red-700",
    text: "text-red-700"
  },
  "tube-condiment": {
    tileSelected: "border-teal-700 bg-teal-700 text-white",
    tileUnselected: "border-teal-200 bg-white text-teal-800",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-teal-50 text-teal-800",
    bar: "bg-teal-700 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-teal-50 text-teal-800",
    iconSurface: "bg-teal-50 text-teal-800",
    text: "text-teal-800"
  },
  "dashi-powder": {
    tileSelected: "border-amber-500 bg-amber-500 text-white",
    tileUnselected: "border-amber-200 bg-white text-amber-700",
    tileCountSelected: "bg-white/25 text-white",
    tileCountUnselected: "bg-amber-50 text-amber-700",
    bar: "bg-amber-500 text-white",
    barCount: "bg-white/25 text-white",
    badge: "bg-amber-50 text-amber-700",
    iconSurface: "bg-amber-50 text-amber-700",
    text: "text-amber-700"
  },
  "miso-paste": {
    tileSelected: "border-lime-700 bg-lime-700 text-white",
    tileUnselected: "border-lime-200 bg-white text-lime-800",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-lime-50 text-lime-800",
    bar: "bg-lime-700 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-lime-50 text-lime-800",
    iconSurface: "bg-lime-50 text-lime-800",
    text: "text-lime-800"
  },
  "vinegar-sauce": {
    tileSelected: "border-rose-600 bg-rose-600 text-white",
    tileUnselected: "border-rose-200 bg-white text-rose-700",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-rose-50 text-rose-700",
    bar: "bg-rose-600 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-rose-50 text-rose-700",
    iconSurface: "bg-rose-50 text-rose-700",
    text: "text-rose-700"
  },
  oil: {
    tileSelected: "border-cyan-700 bg-cyan-700 text-white",
    tileUnselected: "border-cyan-200 bg-white text-cyan-800",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-cyan-50 text-cyan-800",
    bar: "bg-cyan-700 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-cyan-50 text-cyan-800",
    iconSurface: "bg-cyan-50 text-cyan-800",
    text: "text-cyan-800"
  },
  milk: {
    tileSelected: "border-sky-600 bg-sky-600 text-white",
    tileUnselected: "border-sky-200 bg-white text-sky-700",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-sky-50 text-sky-700",
    bar: "bg-sky-600 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-sky-50 text-sky-700",
    iconSurface: "bg-sky-50 text-sky-700",
    text: "text-sky-700"
  },
  drink: {
    tileSelected: "border-cyan-600 bg-cyan-600 text-white",
    tileUnselected: "border-cyan-200 bg-white text-cyan-700",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-cyan-50 text-cyan-700",
    bar: "bg-cyan-600 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-cyan-50 text-cyan-700",
    iconSurface: "bg-cyan-50 text-cyan-700",
    text: "text-cyan-700"
  },
  "seasoning-other": {
    tileSelected: "border-teal-800 bg-teal-800 text-white",
    tileUnselected: "border-gray-200 bg-white text-gray-700",
    tileCountSelected: "bg-white/20 text-white",
    tileCountUnselected: "bg-gray-100 text-gray-600",
    bar: "bg-gray-700 text-white",
    barCount: "bg-white/20 text-white",
    badge: "bg-gray-100 text-gray-700",
    iconSurface: "bg-gray-100 text-gray-700",
    text: "text-gray-700"
  }
};

const keywordRules: { iconKey: CategoryIconKey; keywords: string[] }[] = [
  {
    iconKey: "tube-condiment",
    keywords: ["チューブ", "にんにく", "しょうが", "わさび", "からし"]
  },
  {
    iconKey: "milk",
    keywords: ["牛乳", "乳飲料", "ヨーグルト"]
  },
  {
    iconKey: "drink",
    keywords: ["飲料", "お茶", "水", "ジュース", "コーヒー"]
  },
  {
    iconKey: "mayo-sauce",
    keywords: ["マヨ", "ソース", "ケチャップ"]
  },
  {
    iconKey: "soy-sauce",
    keywords: ["醤油", "しょうゆ", "つゆ", "白だし"]
  },
  {
    iconKey: "dashi-powder",
    keywords: ["だし", "顆粒", "コンソメ"]
  },
  {
    iconKey: "miso-paste",
    keywords: ["味噌", "みそ", "ペースト", "豆板醤"]
  },
  {
    iconKey: "vinegar-sauce",
    keywords: ["酢", "ぽん酢", "たれ"]
  },
  {
    iconKey: "oil",
    keywords: ["油", "オイル"]
  },
  {
    iconKey: "seasoning-other",
    keywords: ["調味料"]
  }
];

export const isCategoryIconKey = (
  value: string | undefined
): value is CategoryIconKey => {
  return Boolean(value && categoryIconKeys.has(value as CategoryIconKey));
};

export const getCategoryIconTemplate = (
  iconKey: string | undefined
): CategoryIconTemplate => {
  return (
    categoryIconTemplates.find((template) => template.key === iconKey) ??
    categoryIconTemplates[categoryIconTemplates.length - 1]
  );
};

export const getCategoryIconTone = (
  iconKey: string | undefined
): CategoryIconTone => {
  return categoryIconTones[resolveCategoryIconKey("", iconKey)];
};

export const resolveCategoryIconKey = (
  categoryName: string,
  iconKey?: string
): CategoryIconKey => {
  if (isCategoryIconKey(iconKey)) {
    return iconKey;
  }

  return findCategoryIconKey(categoryName) ?? defaultCategoryIconKey;
};

const findCategoryIconKey = (searchableText: string) => {
  const normalizedCategoryName = searchableText.trim();
  const matchedRule = keywordRules.find((rule) =>
    rule.keywords.some((keyword) => normalizedCategoryName.includes(keyword))
  );

  return matchedRule?.iconKey;
};

export const resolvePocketItemCategoryIconKey = (input: {
  categoryName: string;
  itemName?: string;
  productDetail?: string;
  categoryIconKey?: string;
}): CategoryIconKey => {
  if (isCategoryIconKey(input.categoryIconKey)) {
    return input.categoryIconKey;
  }

  const searchableText = [
    input.categoryName,
    input.itemName,
    input.productDetail
  ]
    .filter(Boolean)
    .join(" ");

  return findCategoryIconKey(searchableText) ?? defaultCategoryIconKey;
};
