import Dexie, { type Table } from "dexie";
import { resolvePocketItemCategoryIconKey } from "../data/categoryIconTemplates";
import { sampleItems } from "../data/sampleItems";
import type { PocketItem, PocketItemInput } from "../types/PocketItem";

type AppMeta = {
  key: string;
  value: string;
};

class PocketItemsDatabase extends Dexie {
  pocketItems!: Table<PocketItem, string>;
  appMeta!: Table<AppMeta, string>;

  constructor() {
    super("pocket-maker-note");

    this.version(1).stores({
      pocketItems:
        "id, itemName, makerName, categoryName, lastPurchasedAt, updatedAt"
    });

    this.version(2).stores({
      pocketItems:
        "id, itemName, makerName, categoryName, lastPurchasedAt, updatedAt",
      appMeta: "key"
    });
  }
}

export const pocketItemsDb = new PocketItemsDatabase();
const sampleSeededKey = "sample-seeded";
const removedSampleItemIds = ["6", "7"];
const maxCategoryOptions = 10;
const maxMakerOptions = 20;

const createItemId = () => {
  if (globalThis.crypto?.randomUUID) {
    return globalThis.crypto.randomUUID();
  }

  return `item_${Date.now()}_${Math.random().toString(36).slice(2)}`;
};

const normalizeInput = (input: PocketItemInput): PocketItemInput => ({
  itemName: input.itemName.trim(),
  makerName: input.makerName.trim(),
  categoryName: input.categoryName.trim(),
  categoryIconKey: resolvePocketItemCategoryIconKey(input),
  productDetail: input.productDetail.trim(),
  photoDataUrl: input.photoDataUrl,
  lastPurchasedAt: input.lastPurchasedAt,
  memo: input.memo.trim()
});

export const listPocketItems = async () => {
  return pocketItemsDb.pocketItems.orderBy("updatedAt").reverse().toArray();
};

export const listPocketItemCategories = async () => {
  const items = await pocketItemsDb.pocketItems.toArray();
  const categories = items
    .map((item) => item.categoryName.trim())
    .filter(Boolean);

  return Array.from(new Set(categories)).sort((current, next) =>
    current.localeCompare(next, "ja")
  ).slice(0, maxCategoryOptions);
};

export const listPocketItemMakers = async () => {
  const items = await pocketItemsDb.pocketItems.toArray();
  const makers = items.map((item) => item.makerName.trim()).filter(Boolean);

  return Array.from(new Set(makers)).sort((current, next) =>
    current.localeCompare(next, "ja")
  ).slice(0, maxMakerOptions);
};

export const getPocketItem = async (id: string) => {
  return pocketItemsDb.pocketItems.get(id);
};

export const addPocketItem = async (input: PocketItemInput) => {
  const now = new Date().toISOString();
  const item: PocketItem = {
    id: createItemId(),
    ...normalizeInput(input),
    createdAt: now,
    updatedAt: now
  };

  await pocketItemsDb.pocketItems.add(item);
  return item;
};

export const updatePocketItem = async (
  id: string,
  input: PocketItemInput
) => {
  const existing = await getPocketItem(id);

  if (!existing) {
    throw new Error("Pocket item was not found.");
  }

  const updatedItem: PocketItem = {
    ...existing,
    ...normalizeInput(input),
    updatedAt: new Date().toISOString()
  };

  await pocketItemsDb.pocketItems.put(updatedItem);
  return updatedItem;
};

export const deletePocketItem = async (id: string) => {
  await pocketItemsDb.pocketItems.delete(id);
};

export const seedPocketItemsIfEmpty = async () => {
  await pocketItemsDb.pocketItems.bulkDelete(removedSampleItemIds);

  const wasSeeded = await pocketItemsDb.appMeta.get(sampleSeededKey);

  if (wasSeeded?.value === "true") {
    return;
  }

  const itemCount = await pocketItemsDb.pocketItems.count();

  if (itemCount > 0) {
    await pocketItemsDb.appMeta.put({
      key: sampleSeededKey,
      value: "true"
    });
    return;
  }

  await pocketItemsDb.pocketItems.bulkPut(sampleItems);
  await pocketItemsDb.appMeta.put({
    key: sampleSeededKey,
    value: "true"
  });
};
