// 1) token 을 local storage 에서 읽기
// 2) token 이 없으면 로그인 페이지로 리다이렉트
// 3) token 이 있으면 스토리 목록 API 호출 
// 4) 스토리 목록을 화면에 렌더링 

"use client";

import { useEffect, useState } from "react";
import { fetchStories, Story } from "@/lib/stories";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
    const router = useRouter();
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setError(null);

                // 1) token 을 local storage 에서 읽기
                const token = localStorage.getItem("token");
                // 2) token 이 없으면 로그인 페이지로 리다이렉트
                if (!token) {
                    setError("No token found. Please log in again.");
                    router.replace("/login");
                    return;
                }

                // 3) token 이 있으면 스토리 목록 API 호출
                const data = await fetchStories(token);

                // 4) state 에 스토리 목록 저장 -> 화면 렌더링
                setStories(data.stories);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to load stories.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, []);

    return (
      <main style={{ marginTop: 32 }}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            gap: 16,
          }}
        >
          <div>
            <h1 style={{ fontSize: 32, fontWeight: 900, margin: 0 }}>My Stories</h1>
            <p className="muted" style={{ marginTop: 8, marginBottom: 0 }}>
              Create, refine, and reuse STAR stories for behavioral interviews.
            </p>
          </div>

          <div style={{ display: "flex", gap: 10 }}>
            <button
              className="btn"
              onClick={() => {
                localStorage.removeItem("token");
                router.replace("/login");
              }}
            >
              Log out
            </button>

            <button
              className="btn btn-primary"
              onClick={() => router.push("/stories/new")}
            >
              + Add Story
            </button>
          </div>
        </header>

        {loading && <p className="muted" style={{ marginTop: 18 }}>Loading stories...</p>}

        {error && (
          <div className="card" style={{ marginTop: 18, borderColor: "rgba(220, 38, 38, 0.35)" }}>
            <p style={{ color: "crimson", margin: 0 }}>Error: {error}</p>
          </div>
        )}

        {!loading && !error && stories.length === 0 && (
          <div className="card" style={{ marginTop: 18 }}>
            <p style={{ margin: 0 }}>No stories yet.</p>
            <p className="muted" style={{ marginTop: 6, marginBottom: 0 }}>
              Click <strong>+ Add Story</strong> to create your first one.
            </p>
          </div>
        )}

        {!loading && !error && stories.length > 0 && (
          <ul
            style={{
              marginTop: 18,
              display: "grid",
              gap: 12,
              padding: 0,
              listStyle: "none",
            }}
          >
            {stories.map((s) => (
              <li key={s.id} className="card" style={{ display: "grid", gap: 10 }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                  <div style={{ minWidth: 0 }}>
                    <Link
                      href={`/stories/${s.id}`}
                      style={{ textDecoration: "none" }}
                    >
                      <span style={{ fontWeight: 800, fontSize: 18 }}>{s.title}</span>
                    </Link>
                    <div className="muted" style={{ fontSize: 13, marginTop: 6 }}>
                      {new Date(s.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <Link href={`/stories/${s.id}`} style={{ textDecoration: "none" }}>
                    <span className="btn">View</span>
                  </Link>
                </div>

                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {s.categories.map((c) => (
                    <span key={c} className="badge">
                      {c}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    );
}
