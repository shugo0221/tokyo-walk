import { NextRequest, NextResponse } from "next/server";

// 画像キャッシュ（24時間）
const imageCache = new Map<string, { url: string; photographer: string; photographerUrl: string; timestamp: number }>();
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24時間

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query");

  if (!query) {
    return NextResponse.json(
      { error: "検索クエリが必要です" },
      { status: 400 }
    );
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;

  if (!accessKey) {
    return NextResponse.json(
      { error: "APIキーが設定されていません" },
      { status: 500 }
    );
  }

  // キャッシュをチェック
  const cached = imageCache.get(query);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return NextResponse.json({
      url: cached.url,
      photographer: cached.photographer,
      photographerUrl: cached.photographerUrl,
      cached: true,
    });
  }

  try {
    // Unsplash APIで画像を検索
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=1&orientation=landscape`,
      {
        headers: {
          Authorization: `Client-ID ${accessKey}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    if (data.results.length === 0) {
      return NextResponse.json(
        { error: "画像が見つかりませんでした" },
        { status: 404 }
      );
    }

    const photo = data.results[0];
    const result = {
      url: photo.urls.regular,
      photographer: photo.user.name,
      photographerUrl: photo.user.links.html,
    };

    // キャッシュに保存
    imageCache.set(query, {
      ...result,
      timestamp: Date.now(),
    });

    return NextResponse.json({
      ...result,
      cached: false,
    });
  } catch (error) {
    console.error("Unsplash API error:", error);
    return NextResponse.json(
      { error: "画像の取得に失敗しました" },
      { status: 500 }
    );
  }
}
