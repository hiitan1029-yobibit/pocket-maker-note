import { useEffect, useMemo, useState } from "react";
import CategoryFilter, {
  allCategory,
  type CategoryFilterOption
} from "../components/CategoryFilter";
import CategoryIcon from "../components/CategoryIcon";
import ItemCard from "../components/ItemCard";
import SearchBox from "../components/SearchBox";
import {
  categoryIconTemplates,
  getCategoryIconTemplate,
  getCategoryIconTone,
  resolvePocketItemCategoryIconKey
} from "../data/categoryIconTemplates";
import { listPocketItems, seedPocketItemsIfEmpty } from "../db/pocketItemsDb";
import type { PocketItem } from "../types/PocketItem";
import headerImageUrl from "../assets/head.png";

type ItemListPageProps = {
  onSelectItem: (itemId: string) => void;
  onAddItem: () => void;
  saveMessage?: string;
  onClearSaveMessage?: () => void;
};

type ItemGroup = CategoryFilterOption & {
  items: PocketItem[];
};

const categoryOrder = new Map(
  categoryIconTemplates.map((template, index) => [template.key, index])
);

const getItemDateTime = (item: PocketItem) => {
  const dateValue = item.lastPurchasedAt || item.updatedAt || item.createdAt;
  const time = new Date(dateValue).getTime();

  return Number.isNaN(time) ? 0 : time;
};

export default function ItemListPage({
  onSelectItem,
  onAddItem,
  saveMessage = "",
  onClearSaveMessage
}: ItemListPageProps) {
  const [items, setItems] = useState<PocketItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(allCategory);
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadItems = async () => {
      try {
        await seedPocketItemsIfEmpty();
        const storedItems = await listPocketItems();
        setItems(storedItems);
      } catch (error) {
        setErrorMessage("商品データを読み込めませんでした。");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadItems();
  }, []);

  useEffect(() => {
    if (!saveMessage || !onClearSaveMessage) {
      return;
    }

    const timeoutId = window.setTimeout(onClearSaveMessage, 2500);
    return () => window.clearTimeout(timeoutId);
  }, [onClearSaveMessage, saveMessage]);

  const getItemCategory = (item: PocketItem) => {
    const iconKey = resolvePocketItemCategoryIconKey(item);
    const categoryName =
      item.categoryName.trim() || getCategoryIconTemplate(iconKey).label;

    return {
      iconKey,
      name: categoryName,
      value: `${iconKey}:${categoryName}`
    };
  };

  const categories = useMemo<CategoryFilterOption[]>(() => {
    const categoryMap = new Map<string, CategoryFilterOption>();

    items.forEach((item) => {
      const itemCategory = getItemCategory(item);
      const category = categoryMap.get(itemCategory.value);

      if (category) {
        category.count += 1;
        return;
      }

      categoryMap.set(itemCategory.value, {
        value: itemCategory.value,
        name: itemCategory.name,
        iconKey: itemCategory.iconKey,
        count: 1
      });
    });

    return Array.from(categoryMap.values()).sort((current, next) =>
      (categoryOrder.get(current.iconKey ?? "seasoning-other") ?? 999) -
      (categoryOrder.get(next.iconKey ?? "seasoning-other") ?? 999)
    );
  }, [items]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return items.filter((item) => {
      const matchesCategory =
        selectedCategory === allCategory ||
        getItemCategory(item).value === selectedCategory;
      const searchableText = [
        item.itemName,
        item.makerName,
        item.productDetail,
        item.memo
      ]
        .join(" ")
        .toLowerCase();
      const matchesSearch =
        normalizedQuery.length === 0 ||
        searchableText.includes(normalizedQuery);

      return matchesCategory && matchesSearch;
    });
  }, [items, searchQuery, selectedCategory]);

  const itemGroups = useMemo<ItemGroup[]>(() => {
    const groupMap = new Map<string, ItemGroup>();

    filteredItems.forEach((item) => {
      const itemCategory = getItemCategory(item);
      const existingGroup = groupMap.get(itemCategory.value);

      if (existingGroup) {
        existingGroup.count += 1;
        existingGroup.items.push(item);

        return;
      }

      groupMap.set(itemCategory.value, {
        value: itemCategory.value,
        name: itemCategory.name,
        iconKey: itemCategory.iconKey,
        count: 1,
        items: [item]
      });
    });

    return Array.from(groupMap.values())
      .map((group) => ({
        ...group,
        items: group.items.sort(
          (current, next) => getItemDateTime(next) - getItemDateTime(current)
        )
      }))
      .sort(
        (current, next) =>
          (categoryOrder.get(current.iconKey ?? "seasoning-other") ?? 999) -
          (categoryOrder.get(next.iconKey ?? "seasoning-other") ?? 999)
      );
  }, [filteredItems]);

  const toggleExpandedCategory = (categoryValue: string) => {
    if (selectedCategory !== allCategory && selectedCategory === categoryValue) {
      return;
    }

    setExpandedCategory((currentValue) =>
      currentValue === categoryValue ? null : categoryValue
    );
  };

  const handleSelectCategory = (categoryValue: string) => {
    setSelectedCategory(categoryValue);
    setExpandedCategory(categoryValue === allCategory ? null : categoryValue);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="min-h-screen bg-[#FCEED0] text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-3 pb-24 pt-4">
        <section className="sticky top-0 z-10 mb-3 space-y-3 bg-[#FCEED0] pb-3 pt-4">
          <div className="grid min-h-12 grid-cols-[4.75rem_1fr_4.75rem] items-center gap-0">
            <span aria-hidden="true" />
            <img
              src={headerImageUrl}
              alt="いつも買ってるあのメーカー ポケット帳"
              className="h-12 w-auto max-w-full justify-self-end object-contain"
            />
            <button
              type="button"
              onClick={scrollToTop}
              aria-label="先頭へ戻る"
              className="min-h-10 w-full justify-self-end rounded-full border border-teal-200 bg-white px-2 text-lg font-bold leading-none text-teal-800 shadow-sm"
            >
              ↑
            </button>
          </div>
          {saveMessage ? (
            <p className="rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
              {saveMessage}
            </p>
          ) : null}
          <SearchBox
            value={searchQuery}
            onChange={setSearchQuery}
            showLabel={false}
          />
          <CategoryFilter
            categories={categories}
            selectedCategory={selectedCategory}
            onSelect={handleSelectCategory}
          />
        </section>

        {isLoading ? (
          <p className="rounded-lg bg-white p-4 text-gray-700">
            読み込み中です。
          </p>
        ) : null}

        {errorMessage ? (
          <p className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {errorMessage}
          </p>
        ) : null}

        {!isLoading && !errorMessage ? (
          <section className="space-y-3" aria-label="登録済み商品">
            {itemGroups.map((group) => {
              const tone = getCategoryIconTone(group.iconKey);
              const isSelectedGroup =
                selectedCategory !== allCategory && selectedCategory === group.value;
              const isExpanded = isSelectedGroup || expandedCategory === group.value;
              const visibleItems = isExpanded ? group.items : group.items.slice(0, 1);

              return (
                <section key={group.value} className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
                  <button
                    type="button"
                    onClick={() => toggleExpandedCategory(group.value)}
                    aria-expanded={isExpanded}
                    className={`flex min-h-9 w-full items-center gap-2 px-3 py-2 text-left ${tone.bar}`}
                  >
                      <CategoryIcon
                        iconKey={group.iconKey}
                        className="h-5 w-5 shrink-0"
                      />
                    <h2 className="min-w-0 flex-1 truncate text-base font-bold">
                      {group.name}
                    </h2>
                    <span className={`rounded-full px-2 py-0.5 text-xs font-bold ${tone.barCount}`}>
                      {group.count}件
                    </span>
                    <span className="text-lg font-bold leading-none">
                      {isExpanded ? "×" : "≡"}
                    </span>
                  </button>
                  <div className="space-y-2 p-2">
                    {visibleItems.map((item) => (
                      <ItemCard
                        key={item.id}
                        item={item}
                        onSelect={onSelectItem}
                        variant="compact"
                      />
                    ))}
                  </div>
                </section>
              );
            })}
            {filteredItems.length === 0 ? (
              <p className="rounded-lg bg-white p-4 text-gray-700">
                該当する商品がありません。
              </p>
            ) : null}
          </section>
        ) : null}

        <button
          type="button"
          onClick={onAddItem}
          className="fixed bottom-5 right-5 z-20 min-h-14 rounded-full bg-teal-800 px-5 text-base font-bold text-white shadow-lg shadow-teal-900/20"
        >
          + 追加
        </button>
      </div>
    </main>
  );
}
