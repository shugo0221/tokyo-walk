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
        // 検索クエリを構築
        const query = `${areaName} ${courseName} Tokyo Japan`;
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
