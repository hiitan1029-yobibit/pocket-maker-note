import { useState } from "react";
import {
  getCategoryIconTone,
  resolvePocketItemCategoryIconKey
} from "../data/categoryIconTemplates";
import type { PocketItem } from "../types/PocketItem";
import { getPocketItemDisplayDate } from "../utils/pocketItemDisplayDate";
import { sharePocketItem } from "../utils/sharePocketItem";
import CategoryIcon from "./CategoryIcon";

type ItemCardProps = {
  item: PocketItem;
  onSelect: (itemId: string) => void;
  variant?: "default" | "compact";
};

export default function ItemCard({
  item,
  onSelect,
  variant = "default"
}: ItemCardProps) {
  const [shareLabel, setShareLabel] = useState("共有");
  const [isSharing, setIsSharing] = useState(false);
  const categoryIconKey = resolvePocketItemCategoryIconKey(item);
  const categoryTone = getCategoryIconTone(categoryIconKey);
  const isCompact = variant === "compact";
  const displayDate = getPocketItemDisplayDate(item);

  const handleShare = async () => {
    setIsSharing(true);

    try {
      const result = await sharePocketItem(item);

      if (result === "shared") {
        setShareLabel("共有済み");
      }

      if (result === "copied") {
        setShareLabel("コピー済み");
      }

      if (result !== "cancelled") {
        window.setTimeout(() => setShareLabel("共有"), 2000);
      }
    } catch (error) {
      setShareLabel("失敗");
      window.setTimeout(() => setShareLabel("共有"), 2000);
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <article
      className={
        isCompact
          ? "relative bg-white"
          : "relative rounded-lg border border-gray-200 bg-white shadow-sm"
      }
    >
      {!isCompact ? (
        <button
          type="button"
          onClick={handleShare}
          disabled={isSharing}
          className="absolute right-3 top-3 z-10 min-h-11 min-w-14 rounded-full border border-teal-200 bg-teal-50 px-3 text-sm font-bold text-teal-800 shadow-sm disabled:cursor-wait disabled:bg-gray-100 disabled:text-gray-400"
        >
          {isSharing ? "準備中" : shareLabel}
        </button>
      ) : null}

      <button
        type="button"
        onClick={() => onSelect(item.id)}
        className={`grid w-full gap-3 text-left transition active:scale-[0.99] ${
          isCompact
            ? "grid-cols-[76px_1fr_18px] p-2"
            : "grid-cols-[88px_1fr] p-3"
        }`}
        aria-label={`${item.makerName} ${item.itemName}の詳細を開く`}
      >
        <div
          className={`flex items-center justify-center overflow-hidden rounded-md text-xs font-semibold ${
            isCompact
              ? `h-24 w-[76px] ${categoryTone.iconSurface}`
              : "h-24 w-[88px] bg-teal-50 text-teal-800"
          }`}
        >
          {item.photoDataUrl ? (
            <img
              src={item.photoDataUrl}
              alt={`${item.itemName}の写真`}
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center leading-5">写真未登録</span>
          )}
        </div>

        <div className={`min-w-0 space-y-1 ${isCompact ? "" : "pr-16"}`}>
          <p className={`font-bold leading-snug ${isCompact ? "text-sm text-gray-900" : "text-xl text-teal-900"}`}>
            {item.makerName}
          </p>
          <h2 className={`font-bold leading-snug text-gray-950 ${isCompact ? "text-lg" : "text-lg"}`}>
            {item.itemName}
          </h2>
          <p className="line-clamp-2 text-sm leading-5 text-gray-700">
            {item.productDetail}
          </p>
          <div className="flex flex-wrap gap-2 pt-1 text-xs font-semibold">
            {!isCompact ? (
              <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 ${categoryTone.badge}`}>
                <CategoryIcon
                  iconKey={categoryIconKey}
                  className="h-3.5 w-3.5"
                />
                {item.categoryName || "未分類"}
              </span>
            ) : null}
            <span className="rounded-full bg-gray-100 px-2 py-1 text-gray-700">
              {displayDate.shortLabel} {displayDate.formattedDate}
            </span>
          </div>
        </div>
        {isCompact ? (
          <span className="self-center text-3xl font-light leading-none text-gray-500">
            ›
          </span>
        ) : null}
      </button>
    </article>
  );
}
