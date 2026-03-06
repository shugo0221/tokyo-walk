import { useState, useEffect } from "react";

interface CourseImageData {
  url: string;
  photographer: string;
  photographerUrl: string;
}

interface UseCourseImageResult {
  imageData: CourseImageData | null;
  isLoading: boolean;
  error: string | null;
}

export function useCourseImage(
  courseName: string | null,
  areaName: string | null
): UseCourseImageResult {
  const [imageData, setImageData] = useState<CourseImageData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseName || !areaName) {
      setImageData(null);
      setError(null);
      return;
    }

    const fetchImage = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 公園名を抽出（「〇〇公園」「〇〇庭園」「〇〇渓谷」などのパターン）
        const parkMatch = courseName.match(/([\u4e00-\u9faf]+(?:公園|御苑|庭園|渓谷|植物公園))/);
        const parkName = parkMatch ? parkMatch[1] : null;

        // 検索クエリを構築（公園名があればそれを優先）
        const query = parkName
          ? `${parkName} Tokyo Japan`
          : `${areaName} ${courseName} Tokyo Japan`;

        const response = await fetch(
          `/api/image?query=${encodeURIComponent(query)}`
        );
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "画像の取得に失敗しました");
        }

        setImageData({
          url: data.url,
          photographer: data.photographer,
          photographerUrl: data.photographerUrl,
        });
      } catch (err) {
        console.error("画像取得エラー:", err);
        setError(err instanceof Error ? err.message : "画像の取得に失敗しました");
        setImageData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [courseName, areaName]);

  return { imageData, isLoading, error };
}
