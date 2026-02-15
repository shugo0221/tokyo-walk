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
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl animate-spin inline-block">🌀</span>
          <p className="mt-4 text-white font-bold text-lg">画像を読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error || !imageData) {
    return (
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 flex items-center justify-center">
        <div className="text-center">
          <span className="text-6xl">🏙️</span>
          <p className="mt-4 text-white/80 font-medium">Tokyo Walk</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <img
        src={imageData.url}
        alt={`${areaName} ${courseName}`}
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* 撮影者クレジット（Unsplash利用規約） */}
      <div className="absolute top-4 left-4 text-xs text-white/70 bg-black/30 backdrop-blur-sm px-2 py-1 rounded-lg z-10">
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
    </>
  );
}
