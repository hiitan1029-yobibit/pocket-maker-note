import { useState } from "react";

type PhotoInputProps = {
  value: string;
  onChange: (value: string) => void;
  variant?: "default" | "compact";
};

const maxSourceBytes = 12 * 1024 * 1024;
const maxImageSide = 1280;
const imageQuality = 0.82;

const resizeImageFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Image file is required."));
      return;
    }

    if (file.size > maxSourceBytes) {
      reject(new Error("Image file is too large."));
      return;
    }

    const image = new Image();
    const objectUrl = URL.createObjectURL(file);

    image.addEventListener("load", () => {
      const scale = Math.min(
        1,
        maxImageSide / Math.max(image.naturalWidth, image.naturalHeight)
      );
      const width = Math.max(1, Math.round(image.naturalWidth * scale));
      const height = Math.max(1, Math.round(image.naturalHeight * scale));
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");

      URL.revokeObjectURL(objectUrl);

      if (!context) {
        reject(new Error("Canvas is unavailable."));
        return;
      }

      canvas.width = width;
      canvas.height = height;
      context.drawImage(image, 0, 0, width, height);
      resolve(canvas.toDataURL("image/jpeg", imageQuality));
    });

    image.addEventListener("error", () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error("Image file could not be loaded."));
    });

    image.src = objectUrl;
  });
};

export default function PhotoInput({
  value,
  onChange,
  variant = "default"
}: PhotoInputProps) {
  const [errorMessage, setErrorMessage] = useState("");
  const [isReading, setIsReading] = useState(false);
  const isCompact = variant === "compact";

  const handleFileChange = async (file: File | undefined) => {
    if (!file) {
      return;
    }

    setErrorMessage("");
    setIsReading(true);

    try {
      const resizedDataUrl = await resizeImageFile(file);
      onChange(resizedDataUrl);
    } catch (error) {
      setErrorMessage("12MB以下の画像ファイルを選択してください。");
      console.error(error);
    } finally {
      setIsReading(false);
    }
  };

  return (
    <div className="space-y-3">
      <span className="block text-sm font-bold text-gray-800">写真</span>
      <div className={isCompact ? "flex gap-3" : "space-y-3"}>
        <div
          className={`flex items-center justify-center overflow-hidden rounded-lg border border-dashed border-teal-300 bg-white text-sm font-bold text-teal-800 ${
            isCompact ? "h-28 w-28" : "aspect-[4/3] w-full"
          }`}
        >
          {value ? (
            <img
              src={value}
              alt="選択した商品の写真"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="px-2 text-center">写真未登録</span>
          )}
        </div>
        <label
          className={`inline-flex cursor-pointer items-center justify-center rounded-lg border border-dashed border-gray-300 bg-white text-sm font-bold text-gray-600 ${
            isCompact ? "h-28 w-28" : "min-h-11 px-4"
          }`}
        >
          {isReading ? "処理中" : isCompact ? "写真を追加" : "写真を撮る"}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="sr-only"
            disabled={isReading}
            onChange={(event) => {
              void handleFileChange(event.target.files?.[0]);
              event.target.value = "";
            }}
          />
        </label>
      </div>
      <div className="flex flex-wrap gap-2">
        {value ? (
          <button
            type="button"
            onClick={() => onChange("")}
            className="min-h-11 rounded-full border border-gray-300 bg-white px-4 text-sm font-bold text-gray-700"
          >
            写真を外す
          </button>
        ) : null}
      </div>
      {errorMessage ? (
        <p className="text-sm font-semibold text-red-700">{errorMessage}</p>
      ) : null}
    </div>
  );
}
