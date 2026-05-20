import { useEffect, useState } from "react";
import CategoryIcon from "../components/CategoryIcon";
import {
  getCategoryIconTemplate,
  getCategoryIconTone,
  resolvePocketItemCategoryIconKey
} from "../data/categoryIconTemplates";
import { getPocketItem } from "../db/pocketItemsDb";
import type { PocketItem } from "../types/PocketItem";
import headerImageUrl from "../assets/head.png";
import { getPocketItemDisplayDate } from "../utils/pocketItemDisplayDate";
import { sharePocketItem } from "../utils/sharePocketItem";

type ItemDetailPageProps = {
  itemId: string;
  saveMessage?: string;
  onClearSaveMessage?: () => void;
  onBack: () => void;
  onEdit: (item: PocketItem) => void;
  onDelete: (itemId: string) => Promise<void>;
};

export default function ItemDetailPage({
  itemId,
  saveMessage = "",
  onClearSaveMessage,
  onBack,
  onEdit,
  onDelete
}: ItemDetailPageProps) {
  const [item, setItem] = useState<PocketItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [shareLabel, setShareLabel] = useState("共有する");
  const [errorMessage, setErrorMessage] = useState("");
  const categoryIconKey = item
    ? resolvePocketItemCategoryIconKey(item)
    : undefined;
  const categoryTemplate = getCategoryIconTemplate(categoryIconKey);
  const categoryTone = getCategoryIconTone(categoryIconKey);
  const displayDate = item ? getPocketItemDisplayDate(item) : null;

  useEffect(() => {
    const loadItem = async () => {
      try {
        const storedItem = await getPocketItem(itemId);

        if (!storedItem) {
          setErrorMessage("商品が見つかりませんでした。");
          return;
        }

        setItem(storedItem);
      } catch (error) {
        setErrorMessage("商品データを読み込めませんでした。");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    void loadItem();
  }, [itemId]);

  useEffect(() => {
    if (!saveMessage || !onClearSaveMessage) {
      return;
    }

    const timeoutId = window.setTimeout(onClearSaveMessage, 2500);
    return () => window.clearTimeout(timeoutId);
  }, [onClearSaveMessage, saveMessage]);

  const handleShare = async () => {
    if (!item) {
      return;
    }

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
        window.setTimeout(() => setShareLabel("共有する"), 2000);
      }
    } catch (error) {
      setShareLabel("失敗");
      window.setTimeout(() => setShareLabel("共有する"), 2000);
      console.error(error);
    } finally {
      setIsSharing(false);
    }
  };

  const handleDelete = async () => {
    if (!item) {
      return;
    }

    const confirmed = window.confirm(
      `${item.makerName} ${item.itemName}を削除しますか？`
    );

    if (!confirmed) {
      return;
    }

    setIsDeleting(true);

    try {
      await onDelete(item.id);
    } catch (error) {
      setErrorMessage("削除できませんでした。");
      console.error(error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FCEED0] text-gray-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col px-4 pb-6 pt-4">
        <header className="sticky top-0 z-10 mb-4 grid min-h-12 grid-cols-[4.75rem_1fr_4.75rem] items-center gap-0 bg-[#FCEED0] pb-3 pt-4">
          <button
            type="button"
            onClick={onBack}
            className="min-h-10 justify-self-start rounded-full px-1 text-base font-bold text-gray-900"
          >
            ‹ 戻る
          </button>
          <img
            src={headerImageUrl}
            alt="いつも買ってるあのメーカー ポケット帳"
            className="h-12 w-auto max-w-full justify-self-end object-contain"
          />
          <button
            type="button"
            onClick={handleShare}
            disabled={!item || isSharing}
            className="min-h-10 w-full justify-self-end whitespace-nowrap rounded-full border border-teal-200 bg-white px-2 text-sm font-bold text-teal-800 disabled:cursor-wait disabled:border-gray-200 disabled:text-gray-400"
          >
            {isSharing ? "準備中" : shareLabel}
          </button>
        </header>

        {saveMessage ? (
          <p className="mb-4 rounded-lg border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-bold text-teal-800">
            {saveMessage}
          </p>
        ) : null}

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

        {item ? (
          <article className="space-y-5">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className={`inline-flex shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-bold ${categoryTone.tileSelected}`}>
                  <CategoryIcon iconKey={categoryIconKey} className="h-5 w-5" />
                  <span className="max-w-[7.5rem] truncate">
                    {item.categoryName || categoryTemplate.label}
                  </span>
                </span>
                <div className="flex min-w-0 flex-1 items-baseline gap-2">
                  <h1 className="min-w-0 truncate text-2xl font-bold leading-tight text-gray-950">
                    {item.itemName}
                  </h1>
                  <p className="shrink-0 truncate text-base font-bold leading-tight text-gray-700">
                    {item.makerName}
                  </p>
                </div>
              </div>

              <p className="text-xl leading-7 text-gray-800">
                {item.productDetail}
              </p>

              <div className="mx-auto flex aspect-[3/4] w-56 items-center justify-center overflow-hidden rounded-lg bg-white text-sm font-bold text-gray-500">
                {item.photoDataUrl ? (
                  <img
                    src={item.photoDataUrl}
                    alt={`${item.itemName}の写真`}
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span>写真未登録</span>
                )}
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <span className="text-sm font-bold text-gray-600">
                  {displayDate?.detailLabel}
                </span>
                <span className="text-2xl font-bold text-gray-950">
                  {displayDate?.formattedDate}
                </span>
              </div>

              <div className="rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
                <dl className="divide-y divide-gray-100 text-base leading-7">
                  <div className="grid grid-cols-[5.5rem_1fr] gap-3 py-1">
                    <dt className="text-sm font-bold text-gray-500">
                      メモ
                    </dt>
                    <dd className="whitespace-pre-wrap font-semibold text-gray-900">
                      {item.memo || "未登録"}
                    </dd>
                  </div>
                </dl>
              </div>
            </section>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => onEdit(item)}
                className="min-h-14 rounded-lg border border-teal-800 bg-white px-4 text-base font-bold text-teal-800"
              >
                編集する
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting}
                className="min-h-14 rounded-lg border border-red-500 bg-white px-4 text-base font-bold text-red-600 disabled:cursor-not-allowed disabled:border-gray-200 disabled:bg-gray-100 disabled:text-gray-400"
              >
                {isDeleting ? "削除中" : "削除する"}
              </button>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}
