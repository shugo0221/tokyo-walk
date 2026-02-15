"use client";

import { useState, useEffect } from "react";
import { courses, type Season, type WeatherStyle, type Duration, type Course, getGoogleMapsUrl, formatDistance } from "@/lib/courses";
import { CourseImage } from "@/app/components/CourseImage";

export default function Home() {
  const [currentSeason, setCurrentSeason] = useState<Season>("春");
  const [temperature, setTemperature] = useState<number>(20);
  const [weather, setWeather] = useState<WeatherStyle>("晴天");
  const [duration, setDuration] = useState<Duration>(60);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [filteredCount, setFilteredCount] = useState<number>(0);
  const [history, setHistory] = useState<Course[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]); // お気に入りコースのIDリスト
  const [isLoadingWeather, setIsLoadingWeather] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [isGachaAnimating, setIsGachaAnimating] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"overview" | "highlights" | "access">("overview");

  // 季節ごとの平均気温
  const seasonTemperatures: Record<Season, number> = {
    "春": 18,
    "夏": 28,
    "秋": 18,
    "冬": 8,
  };

  // 季節を変更する関数（気温も自動設定）
  const handleSeasonChange = (season: Season) => {
    setCurrentSeason(season);
    setTemperature(seasonTemperatures[season]);
  };

  // 条件をリセットする関数
  const resetConditions = () => {
    // 現在の月から季節を判定
    const month = new Date().getMonth() + 1;
    let detectedSeason: Season;
    if (month >= 3 && month <= 5) detectedSeason = "春";
    else if (month >= 6 && month <= 8) detectedSeason = "夏";
    else if (month >= 9 && month <= 11) detectedSeason = "秋";
    else detectedSeason = "冬";

    setCurrentSeason(detectedSeason);
    setTemperature(seasonTemperatures[detectedSeason]);
    setWeather("晴天");
    setDuration(60);
  };

  // 東京の現在の天気を取得する関数
  const fetchWeather = async () => {
    setIsLoadingWeather(true);
    setWeatherError(null);

    try {
      const response = await fetch("/api/weather");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "天気情報の取得に失敗しました");
      }

      // 天候と気温を設定
      setWeather(data.weatherStyle);
      setTemperature(data.temperature);

      // 気温に応じて季節も自動調整
      if (data.temperature >= 25) {
        setCurrentSeason("夏");
      } else if (data.temperature >= 15) {
        const month = new Date().getMonth() + 1;
        setCurrentSeason(month >= 3 && month <= 5 ? "春" : "秋");
      } else {
        setCurrentSeason("冬");
      }
    } catch (error) {
      console.error("天気取得エラー:", error);
      setWeatherError(error instanceof Error ? error.message : "天気情報の取得に失敗しました");
    } finally {
      setIsLoadingWeather(false);
    }
  };

  // 初期表示時：保存された条件と履歴を復元、なければ季節を自動判定
  useEffect(() => {
    // localStorageから保存された条件を取得
    const savedSeason = localStorage.getItem('tokyoWalk_season') as Season | null;
    const savedTemperature = localStorage.getItem('tokyoWalk_temperature');
    const savedWeather = localStorage.getItem('tokyoWalk_weather') as WeatherStyle | null;
    const savedDuration = localStorage.getItem('tokyoWalk_duration');

    // localStorageから履歴を取得
    const savedHistory = localStorage.getItem('tokyoWalk_history');
    if (savedHistory) {
      try {
        setHistory(JSON.parse(savedHistory));
      } catch (e) {
        console.error('履歴の読み込みに失敗しました', e);
      }
    }

    // localStorageからお気に入りを取得
    const savedFavorites = localStorage.getItem('tokyoWalk_favorites');
    if (savedFavorites) {
      try {
        setFavorites(JSON.parse(savedFavorites));
      } catch (e) {
        console.error('お気に入りの読み込みに失敗しました', e);
      }
    }

    if (savedSeason && savedTemperature && savedWeather && savedDuration) {
      // 保存された条件がある場合は復元
      setCurrentSeason(savedSeason);
      setTemperature(Number(savedTemperature));
      setWeather(savedWeather);
      setDuration(Number(savedDuration) as Duration);
    } else {
      // 保存された条件がない場合は季節を自動判定
      const month = new Date().getMonth() + 1;
      let detectedSeason: Season;
      if (month >= 3 && month <= 5) detectedSeason = "春";
      else if (month >= 6 && month <= 8) detectedSeason = "夏";
      else if (month >= 9 && month <= 11) detectedSeason = "秋";
      else detectedSeason = "冬";

      setCurrentSeason(detectedSeason);
      setTemperature(seasonTemperatures[detectedSeason]);
    }
  }, []);

  // 条件が変更されたらlocalStorageに保存
  useEffect(() => {
    localStorage.setItem('tokyoWalk_season', currentSeason);
    localStorage.setItem('tokyoWalk_temperature', temperature.toString());
    localStorage.setItem('tokyoWalk_weather', weather);
    localStorage.setItem('tokyoWalk_duration', duration.toString());
  }, [currentSeason, temperature, weather, duration]);

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

  // お気に入りの追加・削除
  const toggleFavorite = (courseId: number) => {
    const newFavorites = favorites.includes(courseId)
      ? favorites.filter(id => id !== courseId)
      : [...favorites, courseId];

    setFavorites(newFavorites);
    localStorage.setItem('tokyoWalk_favorites', JSON.stringify(newFavorites));
  };

  // ランダム選択（アニメーション付き）
  const randomizeCourse = () => {
    const filtered = filterCourses();
    setFilteredCount(filtered.length);

    if (filtered.length === 0) {
      setSelectedCourse(null);
      return;
    }

    // アニメーション開始
    setIsGachaAnimating(true);
    setSelectedCourse(null);
    setActiveTab("overview");

    // 1.5秒後に結果を表示
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * filtered.length);
      const selected = filtered[randomIndex];
      setSelectedCourse(selected);
      setIsGachaAnimating(false);

      // 紙吹雪を表示
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3500);

      // 履歴に追加（最新10件まで保持）
      const newHistory = [selected, ...history.filter(c => c.id !== selected.id)].slice(0, 10);
      setHistory(newHistory);
      localStorage.setItem('tokyoWalk_history', JSON.stringify(newHistory));

      // 結果カードまでスクロール
      setTimeout(() => {
        document.getElementById('result-card')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }, 1500);
  };

  useEffect(() => {
    setFilteredCount(filterCourses().length);
  }, [currentSeason, weather, duration]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 py-12 px-4 relative overflow-hidden">
      {/* 背景装飾 - メッシュグラデーション風 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* グラデーションオーブ */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-500/30 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-indigo-500/20 rounded-full blur-3xl"></div>

        {/* 浮遊する装飾要素 */}
        <div className="absolute top-20 left-10 text-4xl opacity-20 animate-float" style={{animationDelay: '0s'}}>🗼</div>
        <div className="absolute top-40 right-20 text-3xl opacity-20 animate-float" style={{animationDelay: '1s'}}>🌸</div>
        <div className="absolute bottom-40 left-20 text-3xl opacity-20 animate-float" style={{animationDelay: '2s'}}>⛩️</div>
        <div className="absolute bottom-20 right-10 text-4xl opacity-20 animate-float" style={{animationDelay: '0.5s'}}>🏙️</div>
        <div className="absolute top-1/3 left-5 text-2xl opacity-15 animate-float" style={{animationDelay: '1.5s'}}>🚃</div>
        <div className="absolute top-1/4 right-10 text-2xl opacity-15 animate-float" style={{animationDelay: '2.5s'}}>🌳</div>

        {/* グリッドパターン */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-16 animate-fadeIn">
          {/* ロゴアイコン */}
          <div className="relative inline-block mb-6">
            <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-full blur-2xl opacity-40 animate-pulse-slow scale-110"></div>
            <div className="relative text-8xl md:text-9xl animate-float">
              🚶‍♂️
            </div>
          </div>

          {/* タイトル */}
          <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-purple-300 to-indigo-300 mb-2 tracking-tight">
            Tokyo Walk
          </h1>
          <h2 className="text-3xl md:text-4xl font-bold text-white/80 tracking-wide">
            Randomizer
          </h2>
        </header>

        {/* 条件設定カード */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-10 border border-white/30 animate-fadeIn hover:shadow-3xl transition-shadow duration-500" style={{animationDelay: '0.1s'}}>
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-4 mb-2">
              <h2 className="text-4xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">現在の状況</h2>
              <button
                onClick={resetConditions}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl font-medium text-sm transition-all duration-300 hover:scale-105 flex items-center gap-2 shadow-md"
              >
                <span>🔄</span>
                <span>リセット</span>
              </button>
            </div>
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
                    onClick={() => handleSeasonChange(season)}
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

          {/* 天気取得ボタン */}
          <div className="mb-8">
            <button
              onClick={fetchWeather}
              disabled={isLoadingWeather}
              className={`w-full py-4 px-6 rounded-2xl font-bold text-base transition-all duration-300 flex items-center justify-center gap-3 ${
                isLoadingWeather
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105"
              }`}
            >
              {isLoadingWeather ? (
                <>
                  <span className="animate-spin">🌀</span>
                  <span>取得中...</span>
                </>
              ) : (
                <>
                  <span className="text-xl">🌤️</span>
                  <span>東京の現在の天気を取得</span>
                </>
              )}
            </button>
            {weatherError && (
              <p className="mt-2 text-sm text-red-500 text-center">{weatherError}</p>
            )}
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
            disabled={filteredCount === 0 || isGachaAnimating}
            className={`relative w-full py-7 rounded-3xl font-extrabold text-2xl transition-all duration-300 transform overflow-hidden ${
              filteredCount === 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : isGachaAnimating
                ? "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl animate-shake"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95 hover:from-indigo-700 hover:via-purple-700 hover:to-pink-700"
            }`}
          >
            <span className={filteredCount === 0 ? "" : "relative z-10 flex items-center justify-center gap-3"}>
              {filteredCount === 0 ? (
                "❌ 条件に合うコースがありません"
              ) : isGachaAnimating ? (
                <>
                  <span className="text-4xl animate-spin-slow">🎰</span>
                  <span>ガチャ中...</span>
                </>
              ) : (
                <>
                  <span className="text-3xl">🎲</span>
                  <span>散歩コースをガチャる！</span>
                </>
              )}
            </span>
            {filteredCount > 0 && !isGachaAnimating && (
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
            )}
          </button>
        </div>

        {/* ガチャアニメーション */}
        {isGachaAnimating && (
          <div className="flex justify-center items-center py-20">
            <div className="text-center animate-bounce-custom">
              <div className="text-8xl mb-4 animate-spin-slow">🎰</div>
              <p className="text-2xl font-bold text-white drop-shadow-lg">コースを選定中...</p>
              <div className="flex justify-center gap-2 mt-4">
                <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0s' }}></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></span>
                <span className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              </div>
            </div>
          </div>
        )}

        {/* 紙吹雪 */}
        {showConfetti && (
          <>
            {[...Array(18)].map((_, i) => (
              <div key={i} className={`confetti confetti-${i + 1}`} style={{ borderRadius: i % 2 === 0 ? '50%' : '0' }}></div>
            ))}
          </>
        )}

        {/* 結果表示カード */}
        {selectedCourse && (
          <div id="result-card" className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl border-2 border-white/30 animate-scaleUp overflow-hidden relative animate-glow">
            {/* 背景装飾 */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-br from-indigo-300/40 to-purple-300/40 rounded-full blur-3xl animate-pulse-slow"></div>
            <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tr from-pink-300/40 to-yellow-300/40 rounded-full blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>

            {/* 大きな画像ヘッダー */}
            <div className="relative h-80 overflow-hidden">
              <CourseImage courseName={selectedCourse.name} areaName={selectedCourse.area} />
              {/* オーバーレイ情報 */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-4xl animate-float">✨</span>
                  <span className="text-white/80 text-lg font-medium">おすすめコース</span>
                </div>
                <h3 className="text-4xl md:text-5xl font-extrabold text-white mb-3 drop-shadow-2xl leading-tight">
                  {selectedCourse.name}
                </h3>
                <p className="text-white/90 text-xl font-bold flex items-center gap-2">
                  <span className="text-2xl">📍</span> {selectedCourse.area}
                </p>
              </div>
              {/* バッジ */}
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  📏 {formatDistance(selectedCourse.distance)}
                </span>
                <span className="bg-white/90 backdrop-blur-sm text-gray-800 text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  ⏱️ {selectedCourse.duration}分
                </span>
              </div>
            </div>

            <div className="relative z-10 p-8">
              {/* タグ */}
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="text-sm font-bold bg-gradient-to-r from-blue-500 via-cyan-500 to-teal-500 text-white px-4 py-2 rounded-full shadow-lg">
                  {selectedCourse.seasons.join(" ・ ")}
                </span>
                <span className="text-sm font-bold bg-gradient-to-r from-green-500 via-emerald-500 to-lime-500 text-white px-4 py-2 rounded-full shadow-lg">
                  {selectedCourse.weatherStyles.join(" ・ ")}
                </span>
              </div>

              {/* タブナビゲーション */}
              <div className="flex gap-2 mb-6 p-1 bg-gray-100 rounded-2xl">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "overview" ? "tab-active shadow-lg" : "tab-inactive"
                  }`}
                >
                  📋 概要
                </button>
                <button
                  onClick={() => setActiveTab("highlights")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "highlights" ? "tab-active shadow-lg" : "tab-inactive"
                  }`}
                >
                  ✨ 見どころ
                </button>
                <button
                  onClick={() => setActiveTab("access")}
                  className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all duration-300 ${
                    activeTab === "access" ? "tab-active shadow-lg" : "tab-inactive"
                  }`}
                >
                  🚇 アクセス
                </button>
              </div>

              {/* タブコンテンツ */}
              <div className="mb-8 animate-slideUp" key={activeTab}>
                {activeTab === "overview" && (
                  <div className="space-y-4">
                    <div className="p-6 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-2xl shadow-inner border border-white/50">
                      <p className="text-gray-800 leading-relaxed text-lg">
                        {selectedCourse.description}
                      </p>
                    </div>
                    {(selectedCourse.durationNote || selectedCourse.startPoint) && (
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
                        <p className="text-sm text-blue-800 flex items-start gap-2">
                          <span className="text-base">ℹ️</span>
                          <span>
                            {selectedCourse.durationNote || "所要時間は観光・休憩・写真撮影などを含む目安時間です。"}
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "highlights" && (
                  <div className="space-y-4">
                    {selectedCourse.highlights && selectedCourse.highlights.length > 0 ? (
                      <div className="p-6 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 rounded-2xl shadow-md border border-amber-200">
                        <ul className="space-y-3">
                          {selectedCourse.highlights.map((highlight, idx) => (
                            <li key={idx} className="text-gray-700 flex items-start gap-3 text-lg">
                              <span className="text-amber-500 text-xl">★</span>
                              <span>{highlight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500">
                        見どころ情報は準備中です
                      </div>
                    )}
                    {selectedCourse.recommendedTimes && selectedCourse.recommendedTimes.length > 0 && (
                      <div className="p-4 bg-sky-50 rounded-xl border border-sky-200">
                        <p className="text-sky-800 flex items-center gap-2">
                          <span className="text-lg">🕐</span>
                          <span className="font-bold">おすすめ時間帯:</span>
                          <span>{selectedCourse.recommendedTimes.join(" ・ ")}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "access" && (
                  <div className="space-y-4">
                    {selectedCourse.accessInfo ? (
                      <div className="p-6 bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl shadow-md border border-violet-200">
                        <p className="text-gray-700 text-lg leading-relaxed">{selectedCourse.accessInfo}</p>
                      </div>
                    ) : (
                      <div className="p-6 bg-gray-50 rounded-2xl text-center text-gray-500">
                        アクセス情報は準備中です
                      </div>
                    )}
                    {selectedCourse.difficulty && (
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                        <p className="text-emerald-800 flex items-center gap-2">
                          <span className="text-lg">💪</span>
                          <span className="font-bold">難易度:</span>
                          <span>{selectedCourse.difficulty}</span>
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* ボタンエリア */}
              <div className="space-y-4">
                {/* お気に入りボタン */}
                <button
                  onClick={() => toggleFavorite(selectedCourse.id)}
                  className={`w-full py-4 px-6 rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center gap-3 ${
                    favorites.includes(selectedCourse.id)
                      ? 'bg-gradient-to-r from-pink-500 via-red-500 to-rose-500 text-white'
                      : 'bg-white border-2 border-pink-500 text-pink-500 hover:bg-pink-50'
                  }`}
                >
                  <span className="text-2xl">{favorites.includes(selectedCourse.id) ? '❤️' : '🤍'}</span>
                  <span>{favorites.includes(selectedCourse.id) ? 'お気に入り登録済み' : 'お気に入りに追加'}</span>
                </button>

                {/* Google Mapと再抽選 */}
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
                    disabled={isGachaAnimating}
                    className="py-5 px-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-2xl font-bold text-lg hover:from-indigo-700 hover:to-purple-700 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50"
                  >
                    🔄 再抽選
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* お気に入り */}
        {favorites.length > 0 && (
          <div className="mt-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/30 animate-fadeIn">
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-pink-600 via-red-600 to-rose-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-3xl">❤️</span> お気に入り
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {courses.filter(course => favorites.includes(course.id)).map((course) => (
                <button
                  key={course.id}
                  onClick={() => setSelectedCourse(course)}
                  className="p-4 bg-gradient-to-br from-pink-50 to-rose-50 hover:from-pink-100 hover:to-rose-100 rounded-2xl border-2 border-pink-200/50 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left relative"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(course.id);
                    }}
                    className="absolute top-2 right-2 text-2xl hover:scale-125 transition-transform"
                  >
                    ❤️
                  </button>
                  <div className="flex items-start justify-between gap-2 pr-8">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{course.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">📍 {course.area}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-pink-600 text-white px-2 py-1 rounded-full">
                          {course.duration}分
                        </span>
                        <span className="text-xs bg-rose-600 text-white px-2 py-1 rounded-full">
                          {formatDistance(course.distance)}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ガチャ履歴 */}
        {history.length > 0 && (
          <div className="mt-10 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl p-8 border border-white/30 animate-fadeIn">
            <h3 className="text-2xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 flex items-center gap-2">
              <span className="text-3xl">📜</span> ガチャ履歴
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {history.map((course, index) => (
                <button
                  key={`${course.id}-${index}`}
                  onClick={() => setSelectedCourse(course)}
                  className="p-4 bg-gradient-to-br from-indigo-50 to-purple-50 hover:from-indigo-100 hover:to-purple-100 rounded-2xl border-2 border-indigo-200/50 transition-all duration-300 hover:scale-105 hover:shadow-lg text-left"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-800 mb-1 line-clamp-1">{course.name}</h4>
                      <p className="text-sm text-gray-600 mb-2">📍 {course.area}</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full">
                          {course.duration}分
                        </span>
                        <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full">
                          {formatDistance(course.distance)}
                        </span>
                      </div>
                    </div>
                    <span className="text-2xl">✨</span>
                  </div>
                </button>
              ))}
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
