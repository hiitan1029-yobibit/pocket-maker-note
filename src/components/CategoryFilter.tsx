import {
  getCategoryIconTone,
  type CategoryIconTone
} from "../data/categoryIconTemplates";
import type { CategoryIconKey } from "../types/CategoryIconKey";
import CategoryIcon from "./CategoryIcon";

export type CategoryFilterOption = {
  value: string;
  name: string;
  iconKey?: CategoryIconKey;
  count: number;
};

type CategoryFilterProps = {
  categories: CategoryFilterOption[];
  selectedCategory: string;
  onSelect: (category: string) => void;
};

const allCategory = "すべて";
const allCategoryTone: CategoryIconTone = getCategoryIconTone("seasoning-other");

export default function CategoryFilter({
  categories,
  selectedCategory,
  onSelect
}: CategoryFilterProps) {
  const categoryOptions: CategoryFilterOption[] = [
    {
      value: allCategory,
      name: allCategory,
      iconKey: "seasoning-other",
      count: categories.reduce((total, category) => total + category.count, 0)
    },
    ...categories
  ];

  return (
    <div
      aria-label="カテゴリー絞り込み"
      className="-mx-4 overflow-x-auto px-4 pb-1 scrollbar-none"
    >
      <div className="grid auto-cols-[5.1rem] grid-flow-col gap-2 pr-12">
        {categoryOptions.map((category) => {
          const isSelected = category.value === selectedCategory;
          const tone = category.iconKey
            ? getCategoryIconTone(category.iconKey)
            : allCategoryTone;

          return (
            <button
              key={category.value}
              type="button"
              onClick={() => onSelect(category.value)}
              className={`flex min-h-20 flex-col items-center justify-between rounded-lg border p-2 text-center shadow-sm transition ${
                isSelected ? tone.tileSelected : tone.tileUnselected
              }`}
            >
              <CategoryIcon iconKey={category.iconKey} className="h-6 w-6" />
              <span className="w-full min-w-0">
                <span className="block truncate text-xs font-bold leading-4">
                  {category.name}
                </span>
                <span
                  className={`mx-auto mt-1 block w-fit rounded-full px-2 py-0.5 text-[11px] font-bold leading-3 ${
                    isSelected ? tone.tileCountSelected : tone.tileCountUnselected
                  }`}
                >
                  {category.count}件
                </span>
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export { allCategory };
