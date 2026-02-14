"use client";

import { useCourseImage } from "@/lib/hooks/useCourseImage";

interface CourseImageProps {
  courseName: string;
  areaName: string;
}

export function CourseImage({ courseName, areaName }: CourseImageProps) {
  const { imageData, isLoading, error } = useCourseImage(courseName, areaName);

  if (isLoading) {
    return (
      <div className="w-full h-64 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center animate-pulse">
        <div className="text-center">
          <span className="text-4xl animate-spin inline-block">🌀</span>
          <p className="mt-2 text-gray-500 font-medium">画像を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="w-full h-48 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <span className="text-4xl">🖼️</span>
          <p className="mt-2 text-gray-400 text-sm">画像を取得できませんでした</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-64 rounded-2xl overflow-hidden shadow-lg mb-6">
      <img
        src={imageData.url}
        alt={`${areaName} ${courseName}`}
        className="w-full h-full object-cover"
      />
      {/* グラデーションオーバーレイ */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      {/* 撮影者クレジット（Unsplash利用規約） */}
      <div className="absolute bottom-2 right-2 text-xs text-white/80 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg">
        Photo by{" "}
        <a
          href={`${imageData.photographerUrl}?utm_source=tokyo_walk_randomizer&utm_medium=referral`}
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          {imageData.photographer}
        </a>
        {" "}on{" "}
        <a
          href="https://unsplash.com?utm_source=tokyo_walk_randomizer&utm_medium=referral"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-white"
        >
          Unsplash
        </a>
      </div>
    </div>
  );
}
