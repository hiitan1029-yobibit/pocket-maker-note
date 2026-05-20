import { defaultCategoryIconKey, isCategoryIconKey } from "../data/categoryIconTemplates";
import type { CategoryIconKey } from "../types/CategoryIconKey";

type CategoryIconProps = {
  iconKey?: string;
  className?: string;
};

const getIconKey = (iconKey: string | undefined): CategoryIconKey => {
  return isCategoryIconKey(iconKey) ? iconKey : defaultCategoryIconKey;
};

const renderPath = (iconKey: CategoryIconKey) => {
  switch (iconKey) {
    case "soy-sauce":
      return (
        <>
          <path d="M9 3h6" />
          <path d="M10 3v4l-2 3v9a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2v-9l-2-3V3" />
          <path d="M9 13h6" />
          <path d="M11 16h2" />
        </>
      );
    case "mayo-sauce":
      return (
        <>
          <path d="M12 3c3 2 5 5 5 9 0 5-2 9-5 9s-5-4-5-9c0-4 2-7 5-9Z" />
          <path d="M9 12h6" />
          <path d="M10 15h4" />
        </>
      );
    case "tube-condiment":
      return (
        <>
          <path d="M7 5h10l-1 5H8L7 5Z" />
          <path d="M8 10l2 10h4l2-10" />
          <path d="M10 14h4" />
          <path d="M11 17h2" />
        </>
      );
    case "dashi-powder":
      return (
        <>
          <path d="M8 5h8" />
          <path d="M7 8h10l-1 12H8L7 8Z" />
          <path d="M9 12h6" />
          <path d="M10 16h4" />
        </>
      );
    case "miso-paste":
      return (
        <>
          <path d="M6 9h12l-1 10a2 2 0 0 1-2 2H9a2 2 0 0 1-2-2L6 9Z" />
          <path d="M8 6h8l2 3H6l2-3Z" />
          <path d="M9 13h6" />
        </>
      );
    case "vinegar-sauce":
      return (
        <>
          <path d="M10 3h4v5l3 5v5a3 3 0 0 1-3 3h-4a3 3 0 0 1-3-3v-5l3-5V3Z" />
          <path d="M9 14h6" />
          <path d="M11 6h2" />
        </>
      );
    case "oil":
      return (
        <>
          <path d="M12 3c3 4 5 7 5 11a5 5 0 0 1-10 0c0-4 2-7 5-11Z" />
          <path d="M10 15a2 2 0 0 0 2 2" />
        </>
      );
    case "milk":
      return (
        <>
          <path d="M8 7h8l1 13H7L8 7Z" />
          <path d="M9 3h6l1 4H8l1-4Z" />
          <path d="M9 12h6" />
          <path d="M10 16h4" />
        </>
      );
    case "drink":
      return (
        <>
          <path d="M7 5h10l-1 15H8L7 5Z" />
          <path d="M9 9h6" />
          <path d="M10 2h5" />
          <path d="M13 2l-1 3" />
        </>
      );
    case "seasoning-other":
      return (
        <>
          <path d="M4 7V4h3l12 12-3 3L4 7Z" />
          <path d="M7 7h.01" />
          <path d="M13 16l3-3" />
        </>
      );
  }
};

export default function CategoryIcon({
  iconKey,
  className = "h-5 w-5"
}: CategoryIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      viewBox="0 0 24 24"
    >
      {renderPath(getIconKey(iconKey))}
    </svg>
  );
}
