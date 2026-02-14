import { NextResponse } from "next/server";

// OpenWeatherMapの天気コードを天候スタイルに変換
function convertWeatherCode(weatherId: number): "晴天" | "曇天" | "雨天" {
  // 200-599: 雨・雪・霧雨など
  if (weatherId >= 200 && weatherId < 600) {
    return "雨天";
  }
  // 600-699: 雪
  if (weatherId >= 600 && weatherId < 700) {
    return "雨天";
  }
  // 700-799: 霧・靄など
  if (weatherId >= 700 && weatherId < 800) {
    return "曇天";
  }
  // 800: 晴天
  if (weatherId === 800) {
    return "晴天";
  }
  // 801-804: 曇り
  if (weatherId >= 801 && weatherId <= 804) {
    return "曇天";
  }
  // デフォルト
  return "晴天";
}

export async function GET() {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  try {
    // 東京の天気を取得（東京駅の緯度経度）
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=35.6812&lon=139.7671&appid=${apiKey}&units=metric&lang=ja`,
      { next: { revalidate: 1800 } } // 30分キャッシュ
    );

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status}`);
    }

    const data = await response.json();

    // 天気情報を抽出
    const weatherId = data.weather[0].id;
    const weatherDescription = data.weather[0].description;
    const temperature = Math.round(data.main.temp);
    const weatherStyle = convertWeatherCode(weatherId);

    return NextResponse.json({
      temperature,
      weatherStyle,
      description: weatherDescription,
      icon: data.weather[0].icon,
    });
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { error: "天気情報の取得に失敗しました" },
      { status: 500 }
    );
  }
}
