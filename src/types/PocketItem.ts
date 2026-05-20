import type { CategoryIconKey } from "./CategoryIconKey";

export type PocketItem = {
  id: string;
  itemName: string;
  makerName: string;
  categoryName: string;
  categoryIconKey?: CategoryIconKey;
  productDetail: string;
  photoDataUrl: string;
  lastPurchasedAt: string;
  memo: string;
  createdAt: string;
  updatedAt: string;
};

export type PocketItemInput = Omit<
  PocketItem,
  "id" | "createdAt" | "updatedAt"
>;
