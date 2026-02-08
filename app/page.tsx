"use client";

import { useState, useEffect } from "react";
import { courses, type Season, type WeatherStyle, type Duration, type Course, getGoogleMapsUrl } from "@/lib/courses";

export default function Home() {
  const [currentSeason, setCurrentSeason] = useState<Season>("春");
  const [temperature, setTemperature] = useState<number>(20);
  const [weather, setWeather] = useState<WeatherStyle>("晴天");
  const [duration, setDuration] = useState<Duration>(60);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filteredCount, setFilteredCount] = useState<number>(0);

  // 季節を自動判定
  useEffect(() => {
    const month = new Date().getMonth() + 1;
    if (month >= 3 && month <= 5) setCurrentSeason("春");
    else if (month >= 6 && month <= 8) setCurrentSeason("夏");
    else if (month >= 9 && month <= 11) setCurrentSeason("秋");
    else setCurrentSeason("冬");
  }, []);

  // フィルタリング関数
  const filterCourses = () => {
    return courses.filter((course) => {
      return (
        course.seasons.includes(currentSeason) &&
        course.weatherStyles.includes(weather) &&
        course.duration === duration
      );
    });
  };

  // ランダム選択
  const randomizeCourse = () => {
    const filtered = filterCourses();
    setFilteredCount(filtered.length);

    if (filtered.length === 0) {
      setSelectedCourse(null);
      return;
    }

    const randomIndex = Math.floor(Math.random() * filtered.length);
    setSelectedCourse(filtered[randomIndex]);
  };

  useEffect(() => {
    setFilteredCount(filterCourses().length);
  }, [currentSeason, weather, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4 relative overflow-hidden">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-16 animate-fadeIn">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 animate-float shadow-2xl">
            <span className="text-7xl">🚶‍♂️</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-tight">
            Tokyo Walk Randomizer
          </h1>
          <div className="inline-block bg-white/20 backdrop-blur-md rounded-full px-8 py-3 mb-4">
            <p className="text-2xl md:text-3xl text-white font-bold">✨ 東京散歩ガチャ ✨</p>
          </div>
          <p className="text-lg text-white/90 mt-4 max-w-2xl mx-auto leading-relaxed">
            今の状況に合わせて、最適な散歩コースをAIが提案します
          </p>
        </header>

        {/* 条件設定カード */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-10 border border-white/30 animate-fadeIn hover:shadow-3xl transition-shadow duration-500" style={{animationDelay: '0.1s'}}>
          <div className="text-center mb-10">
            <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-2">現在の状況</h2>
            <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 mx-auto rounded-full"></div>
          </div>

          {/* 季節選択 */}
          <div className="mb-10">
            <label className="block text-base font-bold text-gray-800 mb-5 flex items-center gap-3">
              <span className="text-2xl">🌸</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">季節</span>
            </label>
            <div className="grid grid-cols-4 gap-4">
              {(["春", "夏", "秋", "冬"] as Season[]).map((season) => {
                const seasonEmojis = { "春": "🌸", "夏": "☀️", "秋": "🍂", "冬": "❄️" };
                return (
                  <button
                    key={season}
                    onClick={() => setCurrentSeason(season)}
                    className={`py-5 px-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                      currentSeason === season
                        ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl scale-105"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-indigo-50 hover:to-purple-50 shadow-md hover:shadow-xl"
                    }`}
                  >
                    <div className="text-3xl mb-1">{seasonEmojis[season]}</div>
                    <div>{season}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 気温入力 */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-gray-700 mb-4 flex items-center gap-2">
              <span className="text-xl">🌡️</span> 気温: <span className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">{temperature}°C</span>
            </label>
            <div className="relative">
              <input
                type="range"
                min="-5"
                max="40"
                value={temperature}
                onChange={(e) => setTemperature(Number(e.target.value))}
                className="w-full h-3 bg-gradient-to-r from-blue-200 via-yellow-200 to-red-200 rounded-full appearance-none cursor-pointer accent-indigo-600 shadow-inner"
                style={{
                  background: `linear-gradient(to right, #93c5fd 0%, #fde68a ${((temperature + 5) / 45) * 100}%, #fca5a5 100%)`
                }}
              />
            </div>
            <div className="flex justify-between text-xs font-medium text-gray-600 mt-2">
              <span>❄️ -5°C</span>
              <span>🔥 40°C</span>
            </div>
          </div>

          {/* 天候選択 */}
          <div className="mb-10">
            <label className="block text-base font-bold text-gray-800 mb-5 flex items-center gap-3">
              <span className="text-2xl">🌤️</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">天候</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {(["晴天", "曇天", "雨天"] as WeatherStyle[]).map((w) => {
                const icons = { "晴天": "☀️", "曇天": "☁️", "雨天": "🌧️" };
                return (
                  <button
                    key={w}
                    onClick={() => setWeather(w)}
                    className={`py-6 px-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 flex flex-col items-center gap-3 ${
                      weather === w
                        ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl scale-105"
                        : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-indigo-50 hover:to-purple-50 shadow-md hover:shadow-xl"
                    }`}
                  >
                    <span className="text-4xl">{icons[w]}</span>
                    <span className="text-base">{w}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 時間選択 */}
          <div className="mb-10">
            <label className="block text-base font-bold text-gray-800 mb-5 flex items-center gap-3">
              <span className="text-2xl">⏱️</span>
              <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">散歩時間</span>
            </label>
            <div className="grid grid-cols-3 gap-4">
              {([30, 60, 90] as Duration[]).map((d) => (
                <button
                  key={d}
                  onClick={() => setDuration(d)}
                  className={`py-6 px-4 rounded-2xl font-bold transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 ${
                    duration === d
                      ? "bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl scale-105"
                      : "bg-gradient-to-br from-gray-50 to-gray-100 text-gray-700 hover:from-indigo-50 hover:to-purple-50 shadow-md hover:shadow-xl"
                  }`}
                >
                  <div className="text-3xl font-extrabold">{d}</div>
                  <div className="text-sm mt-1">分</div>
                </button>
              ))}
            </div>
          </div>

          {/* 該当コース数表示 */}
          <div className="text-center mb-8">
            <div className="inline-block bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 px-8 py-4 rounded-full shadow-lg border-2 border-white">
              <span className="text-base font-bold text-gray-700">該当コース: </span>
              <span className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mx-2">{filteredCount}</span>
              <span className="text-base font-bold text-gray-700">件</span>
            </div>
          </div>

          {/* ランダム選択ボタン */}
          <button
            onClick={randomizeCourse}
            disabled={filteredCount === 0}
            className={`relative w-full py-7 rounded-3xl font-extrabold text-2xl transition-all duration-300 transform overflow-hidden ${
              filteredCount === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
            }`}
          >
            <span className={filteredCount === 0 ? "" : "relative z-10"}>
              {filteredCount === 0 ? "❌ 条件に合うコースがありません" : "🎲 散歩コースをガチャる！"}
            </span>
            {filteredCount > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            )}
          </button>
        </div>

        {/* 結果表示カード */}
        {selectedCourse && (
          <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border-2 border-white/30 animate-fadeIn overflow-hidden relative hover:shadow-pink-500/20 transition-shadow duration-500">
            {/* 背景装飾 */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-300/40 to-yellow-300/40 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>

            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent flex items-center gap-3">
                  <span className="text-4xl animate-float">✨</span> おすすめコース
                </h2>
                <span className="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-lg font-bold px-6 py-3 rounded-full shadow-xl">
                  ⏱️ {selectedCourse.duration}分
                </span>
              </div>

              <div className="mb-8 p-8 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-3xl shadow-inner border-2 border-white/50">
                <h3 className="text-5xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4 leading-tight">
                  {selectedCourse.name}
                </h3>
                <p className="text-gray-800 text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">📍</span> {selectedCourse.area}
                </p>
              </div>

              <div className="mb-8 p-6 bg-white/70 backdrop-blur-sm rounded-2xl shadow-md border border-gray-100">
                <p className="text-gray-800 leading-relaxed text-lg font-medium">
                  {selectedCourse.description}
                </p>
              </div>

              <div className="flex flex-wrap gap-4 mb-8">
                <span className="text-base font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                  {selectedCourse.seasons.join(" ・ ")}
                </span>
                <span className="text-base font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white px-6 py-3 rounded-full shadow-lg transform hover:scale-105 transition-transform">
                  {selectedCourse.weatherStyles.join(" ・ ")}
                </span>
              </div>

              {/* Google Mapボタン */}
              <div className="flex gap-4">
                <a
                  href={getGoogleMapsUrl(selectedCourse)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-5 px-6 bg-gradient-to-r from-red-500 via-pink-500 to-rose-500 text-white rounded-2xl font-bold text-lg text-center hover:from-red-600 hover:via-pink-600 hover:to-rose-600 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3"
                >
                  <span className="text-2xl">📍</span>
                  <span>Google Mapで見る</span>
                </a>
                <button
                  onClick={randomizeCourse}
                  className="py-5 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  🔄 再抽選
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 投稿ページへのリンク */}
        <div className="mt-10 text-center animate-fadeIn" style={{animationDelay: '0.3s'}}>
          <a
            href="/posts"
            className="inline-block px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-3xl font-bold text-lg hover:bg-white/30 transition-all hover:scale-105 shadow-xl hover:shadow-2xl"
          >
            💬 投稿掲示板へ
          </a>
        </div>
      </div>
    </div>
  );
}
