// 1) token 을 local storage 에서 읽기
// 2) token 이 없으면 로그인 페이지로 리다이렉트
// 3) token 이 있으면 스토리 목록 API 호출 
// 4) 스토리 목록을 화면에 렌더링 

"use client";

import { useEffect, useState } from "react";
import { fetchStories, Story } from "@/lib/stories";
import Link from "next/link";

export default function DashboardPage() {
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
                    window.location.href = "/login";
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
        <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Dashboard</h1>

            {loading && <p>Loading stories...</p>}

            {error && <p style={{ color: "crimson" }}>Error: {error}</p>}

            {!loading && !error && stories.length === 0 && (
                <p>No stories yet. Go create one!</p>
            )}

            {!loading && !error && stories.length > 0 && (
                <ul style={{ marginTop: 16, display: "grid", gap: 12, padding: 0, listStyle: "none" }}>
                    {stories.map((s) => (
                        <li key={s.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
                            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>
                                <Link href={`/stories/${s.id}`} style={{ textDecoration: "none", color: "#333" }}>
                                    {s.title}
                                </Link>
                            </div>

                            <div style={{ fontSize: 14, color: "#555" }}>
                                {s.categories.join(', ')}
                            </div>

                            <div style={{ fontSize: 12, marginTop: 12, color: "#888" }}>
                                {new Date(s.createdAt).toLocaleDateString()}
                            </div>
                        </li>   
                    ))}
                </ul>
            )}
        </main>
    );
}
