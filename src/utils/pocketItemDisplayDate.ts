import type { PocketItem } from "../types/PocketItem";

const dateOnlyPattern = /^\d{4}-\d{2}-\d{2}$/;

export const formatPocketItemDate = (date: string) => {
  if (!date) {
    return "未登録";
  }

  if (dateOnlyPattern.test(date)) {
    return date.replaceAll("-", "/");
  }

  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return date.replaceAll("-", "/");
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).format(parsedDate);
};

export const getPocketItemDisplayDate = (item: PocketItem) => {
  const hasLastPurchasedAt = item.lastPurchasedAt.trim().length > 0;
  const date = hasLastPurchasedAt
    ? item.lastPurchasedAt
    : item.updatedAt || item.createdAt;

  return {
    date,
    formattedDate: formatPocketItemDate(date),
    shortLabel: hasLastPurchasedAt ? "最終購入" : "保存",
    detailLabel: hasLastPurchasedAt ? "最終購入日" : "保存日",
    shareLabel: hasLastPurchasedAt ? "最後に買った日" : "保存日"
  };
};
