import type { PocketItem } from "../types/PocketItem";
import { getPocketItemDisplayDate } from "./pocketItemDisplayDate";

export type SharePocketItemResult = "shared" | "copied" | "cancelled";

const createShareText = (item: PocketItem) => {
  const displayDate = getPocketItemDisplayDate(item);

  return [
    "これを買ってきてください。",
    "",
    item.itemName,
    `メーカー: ${item.makerName}`,
    `商品詳細: ${item.productDetail}`,
    item.categoryName ? `カテゴリー: ${item.categoryName}` : "",
    `${displayDate.shareLabel}: ${displayDate.formattedDate}`,
    item.memo ? `メモ: ${item.memo}` : ""
  ]
    .filter(Boolean)
    .join("\n");
};

const isAbortError = (error: unknown) => {
  return error instanceof DOMException && error.name === "AbortError";
};

const copyText = async (text: string) => {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement("textarea");
  textarea.value = text;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "fixed";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    document.execCommand("copy");
  } finally {
    document.body.removeChild(textarea);
  }
};

const dataUrlToFile = async (dataUrl: string) => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();

  return new File([blob], "pocket-maker-note-item.jpg", {
    type: blob.type || "image/jpeg"
  });
};

export const sharePocketItem = async (
  item: PocketItem
): Promise<SharePocketItemResult> => {
  const text = createShareText(item);
  const title = `${item.makerName} ${item.itemName}`;

  if (navigator.share) {
    if (item.photoDataUrl) {
      try {
        const file = await dataUrlToFile(item.photoDataUrl);
        const canShareFiles = navigator.canShare?.({ files: [file] }) ?? false;

        if (canShareFiles) {
          await navigator.share({
            title,
            text,
            files: [file]
          });
          return "shared";
        }
      } catch (error) {
        if (isAbortError(error)) {
          return "cancelled";
        }
      }
    }

    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (error) {
      if (isAbortError(error)) {
        return "cancelled";
      }
    }
  }

  await copyText(text);
  return "copied";
};
