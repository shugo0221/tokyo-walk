"use client";

import { useState, useEffect } from "react";
import { supabase, type Post } from "@/lib/supabase";

export default function PostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState("");
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // 投稿を取得
  const fetchPosts = async () => {
    setFetching(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("投稿の取得に失敗:", error);
    } else {
      setPosts(data || []);
    }
    setFetching(false);
  };

  // 投稿を作成
  const createPost = async () => {
    if (!newPost.trim()) return;

    setLoading(true);
    const { data, error } = await supabase
      .from("posts")
      .insert([{ content: newPost }])
      .select();

    if (error) {
      console.error("投稿の作成に失敗:", error);
      alert("投稿に失敗しました: " + error.message);
    } else {
      setNewPost("");
      fetchPosts();
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 py-12 px-4">
      {/* 背景装飾 */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        {/* ヘッダー */}
        <header className="text-center mb-12 animate-fadeIn">
          <div className="inline-block p-4 bg-white/20 backdrop-blur-md rounded-3xl mb-6 animate-float shadow-2xl">
            <span className="text-7xl">💬</span>
          </div>
          <h1 className="text-6xl md:text-7xl font-extrabold text-white mb-4 drop-shadow-2xl tracking-tight">
            投稿掲示板
          </h1>
          <p className="text-lg text-white/90 mt-4 max-w-2xl mx-auto leading-relaxed">
            Supabaseを使った投稿機能のデモ
          </p>
        </header>

        {/* 投稿フォーム */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 mb-10 border border-white/30 animate-fadeIn">
          <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6">
            新規投稿
          </h2>
          <textarea
            value={newPost}
            onChange={(e) => setNewPost(e.target.value)}
            placeholder="何か投稿してみましょう..."
            className="w-full p-4 border-2 border-gray-200 rounded-2xl focus:border-indigo-500 focus:outline-none transition-colors resize-none h-32 text-lg"
            disabled={loading}
          />
          <button
            onClick={createPost}
            disabled={loading || !newPost.trim()}
            className={`w-full mt-4 py-5 rounded-2xl font-bold text-xl transition-all transform ${
              loading || !newPost.trim()
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white shadow-2xl hover:shadow-pink-500/50 hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? "投稿中..." : "📝 投稿する"}
          </button>
        </div>

        {/* 投稿一覧 */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl p-10 border border-white/30 animate-fadeIn">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-extrabold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              投稿一覧
            </h2>
            <button
              onClick={fetchPosts}
              disabled={fetching}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-full font-bold hover:scale-105 transition-transform disabled:opacity-50"
            >
              {fetching ? "🔄" : "🔄 更新"}
            </button>
          </div>

          {fetching ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin text-6xl">⏳</div>
              <p className="mt-4 text-gray-600 font-medium">読み込み中...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-600 text-lg font-medium">
                まだ投稿がありません
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border border-gray-200 hover:shadow-lg transition-shadow"
                >
                  <p className="text-gray-800 text-lg leading-relaxed mb-3">
                    {post.content}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>🕐</span>
                    <span>
                      {new Date(post.created_at).toLocaleString("ja-JP", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
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
            className="inline-block px-8 py-4 bg-white/20 backdrop-blur-md text-white rounded-2xl font-bold hover:bg-white/30 transition-all hover:scale-105"
          >
            ← ホームに戻る
          </a>
        </div>
      </div>
    </div>
  );
}
