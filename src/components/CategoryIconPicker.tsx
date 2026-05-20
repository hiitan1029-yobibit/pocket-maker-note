import {
  categoryIconTemplates,
  defaultCategoryIconKey,
  getCategoryIconTone,
  getCategoryIconTemplate
} from "../data/categoryIconTemplates";
import type { CategoryIconKey } from "../types/CategoryIconKey";
import CategoryIcon from "./CategoryIcon";

type CategoryIconPickerProps = {
  value?: CategoryIconKey;
  onChange: (value: CategoryIconKey) => void;
};

export default function CategoryIconPicker({
  value,
  onChange
}: CategoryIconPickerProps) {
  const selectedIconKey =
    getCategoryIconTemplate(value).key ?? defaultCategoryIconKey;

  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-bold text-gray-800">
        カテゴリーアイコン
      </legend>
      <div className="grid grid-cols-5 gap-2">
        {categoryIconTemplates.map((template) => {
          const isSelected = template.key === selectedIconKey;
          const tone = getCategoryIconTone(template.key);

          return (
            <button
              key={template.key}
              type="button"
              aria-label={`${template.label}: ${template.hint}`}
              aria-pressed={isSelected}
              onClick={() => onChange(template.key)}
              title={template.label}
              className={`flex h-14 items-center justify-center rounded-lg border transition ${
                isSelected
                  ? `${tone.tileSelected} ring-2 ring-offset-1`
                  : tone.tileUnselected
              }`}
            >
              <CategoryIcon iconKey={template.key} className="h-7 w-7" />
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
