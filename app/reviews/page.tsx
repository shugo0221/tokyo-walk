"use client";

import { useState, useEffect, useMemo } from "react";
import { supabase, type CourseReview } from "@/lib/supabase";
import { courses } from "@/lib/courses";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<CourseReview[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<number | null>(null);
  const [rating, setRating] = useState<number>(5);
  const [content, setContent] = useState("");
  const [nickname, setNickname] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [filterCourseId, setFilterCourseId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // コース検索フィルター
  const filteredCourses = useMemo(() => {
    if (!searchQuery.trim()) return courses;
    const query = searchQuery.toLowerCase();
    return courses.filter(
      (course) =>
        course.name.toLowerCase().includes(query) ||
        course.area.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  // 口コミを取得
  const fetchReviews = async () => {
    setFetching(true);
    let query = supabase
      .from("course_reviews")
      .select("*")
      .order("created_at", { ascending: false });

    if (filterCourseId !== null) {
      query = query.eq("course_id", filterCourseId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("口コミの取得に失敗:", error);
    } else {
      setReviews(data || []);
    }
    setFetching(false);
  };

  // 口コミを投稿
  const submitReview = async () => {
    if (!selectedCourseId || !content.trim()) return;

    const selectedCourse = courses.find((c) => c.id === selectedCourseId);
    if (!selectedCourse) return;

    setLoading(true);
    const { error } = await supabase.from("course_reviews").insert([
      {
        course_id: selectedCourseId,
        course_name: selectedCourse.name,
        rating,
        content: content.trim(),
        nickname: nickname.trim() || "匿名さん",
      },
    ]);

    if (error) {
      console.error("口コミの投稿に失敗:", error);
      alert("投稿に失敗しました: " + error.message);
    } else {
      setContent("");
      setNickname("");
      setRating(5);
      setSelectedCourseId(null);
      setSearchQuery("");
      fetchReviews();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchReviews();
  }, [filterCourseId]);

  // 星評価を表示
  const renderStars = (value: number, interactive = false, size = "text-2xl") => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={!interactive}
            onClick={() => interactive && setRating(star)}
            className={`${size} ${
              interactive
                ? "cursor-pointer hover:scale-125 transition-transform"
                : "cursor-default"
            }`}
          >
            {star <= value ? "★" : "☆"}
          </button>
        ))}
      </div>
    );
  };

  // 平均評価を計算
  const getAverageRating = (courseId: number) => {
    const courseReviews = reviews.filter((r) => r.course_id === courseId);
    if (courseReviews.length === 0) return null;
    const avg =
      courseReviews.reduce((sum, r) => sum + r.rating, 0) / courseReviews.length;
    return avg.toFixed(1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fadeIn">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 shadow-2xl">
            <span className="text-7xl">⭐</span>
          </div>
          <h1 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-4 tracking-tight">
            コース口コミ
          </h1>
          <p className="text-lg text-white/90 mt-4 max-w-2xl mx-auto leading-relaxed">
            散歩コースの感想を共有しよう
          </p>
        </header>

        {/* 口コミ投稿フォーム */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-10 border border-white/30 animate-fadeIn">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            口コミを投稿
          </h2>

          {/* コース選択 */}
          <div className="mb-6">
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">🗺️</span>
              <span>コースを選択</span>
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="コース名やエリアで検索..."
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors mb-3"
            />
            <div className="max-h-48 overflow-y-auto border-2 border-gray-200 rounded-2xl">
              {filteredCourses.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  該当するコースがありません
                </div>
              ) : (
                filteredCourses.map((course) => (
                  <button
                    key={course.id}
                    type="button"
                    onClick={() => {
                      setSelectedCourseId(course.id);
                      setSearchQuery(course.name);
                    }}
                    className={`w-full p-4 text-left border-b border-gray-100 last:border-b-0 transition-colors ${
                      selectedCourseId === course.id
                        ? "bg-gradient-to-r from-indigo-100 to-purple-100"
                        : "hover:bg-gray-50"
                    }`}
                  >
                    <div className="font-bold text-gray-800">{course.name}</div>
                    <div className="text-sm text-gray-600">
                      📍 {course.area} ・ {course.duration}分
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* 星評価 */}
          <div className="mb-6">
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">⭐</span>
              <span>評価</span>
            </label>
            <div className="flex items-center gap-4">
              <div className="text-amber-500">{renderStars(rating, true, "text-4xl")}</div>
              <span className="text-2xl font-bold text-gray-700">{rating}/5</span>
            </div>
          </div>

          {/* ニックネーム */}
          <div className="mb-6">
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">👤</span>
              <span>ニックネーム（任意）</span>
            </label>
            <input
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              placeholder="匿名さん"
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors"
              disabled={loading}
            />
          </div>

          {/* コメント */}
          <div className="mb-6">
            <label className="block text-base font-bold text-gray-800 mb-3 flex items-center gap-2">
              <span className="text-xl">💬</span>
              <span>コメント</span>
            </label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="コースの感想を書いてください..."
              className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors resize-none h-32 text-lg"
              disabled={loading}
            />
          </div>

          {/* 投稿ボタン */}
          <button
            onClick={submitReview}
            disabled={loading || !selectedCourseId || !content.trim()}
            className={`w-full py-5 rounded-2xl font-bold text-xl transition-all transform ${
              loading || !selectedCourseId || !content.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "投稿中..." : "⭐ 口コミを投稿する"}
          </button>
        </div>

        {/* 口コミ一覧 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30 animate-fadeIn">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              口コミ一覧
            </h2>
            <div className="flex items-center gap-3">
              <select
                value={filterCourseId ?? ""}
                onChange={(e) =>
                  setFilterCourseId(e.target.value ? Number(e.target.value) : null)
                }
                className="px-4 py-2 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-sm"
              >
                <option value="">全てのコース</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>
                    {course.name}
                  </option>
                ))}
              </select>
              <button
                onClick={fetchReviews}
                disabled={fetching}
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:scale-105 transition-transform disabled:opacity-50"
              >
                {fetching ? "🔄" : "🔄 更新"}
              </button>
            </div>
          </div>

          {fetching ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl">⏳</div>
              <p className="mt-4 text-gray-600 font-medium">読み込み中...</p>
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg font-medium">
                まだ口コミがありません
              </p>
              <p className="text-gray-500 mt-2">
                最初の口コミを投稿してみましょう！
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  {/* コース名と評価 */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🗺️</span>
                      <span className="font-bold text-indigo-600">
                        {review.course_name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-amber-500">
                        {renderStars(review.rating, false, "text-lg")}
                      </span>
                      <span className="font-bold text-gray-700">
                        {review.rating}/5
                      </span>
                    </div>
                  </div>

                  {/* コメント */}
                  <p className="text-gray-800 text-lg leading-relaxed mb-4">
                    {review.content}
                  </p>

                  {/* メタ情報 */}
                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                    <span className="flex items-center gap-1">
                      <span>👤</span>
                      <span>{review.nickname}</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span>🕐</span>
                      <span>
                        {new Date(review.created_at).toLocaleString("ja-JP", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ホームに戻るボタン */}
        <div className="mt-8 text-center">
          <a
            href="/"
            className="inline-block px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-3xl font-bold text-lg hover:bg-white/30 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            ← ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
