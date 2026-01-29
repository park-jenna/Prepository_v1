// 1) URL 파라미터에서 id 읽기
// 2) token 을 local storage 에서 읽기
// 3) fetchStoryById 함수 호출로 스토리 데이터 가져오기
// 4) 스토리 데이터를 화면에 렌더링

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchStoryById, Story } from "@/lib/stories";

export default function StoryDetailPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const storyId = params?.id;

    const [story, setStory] = useState<Story | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function load() {
            try {
                setError(null);

                // 2) token 을 local storage 에서 읽기
                const token = localStorage.getItem("token");
                if (!token) {
                    setError("No token found. Please log in again.");
                    router.push("/login");
                    return;
                }

                // id 확인
                if (!storyId) {
                    setError("No story ID provided.");
                    return;
                }

                // 3) fetchStoryById 함수 호출로 스토리 데이터 가져오기
                const data = await fetchStoryById(token, storyId);
                setStory(data.story);
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to load story.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        }
        
        load();
    }, [storyId]);

    // loading
    if (loading) {
        return (
            <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
                <p>Loading story...</p>
            </main>
        );
    }

    // error
    if (error) {
        return (
            <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
                <p style={{ color: "crimson" }}>Error: {error}</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{ marginTop: 16, padding: "8px 16px", borderRadius: 4 }}
                >
                    Back to Dashboard
                </button>
            </main>
        );
    }

    // story not found
    if (!story) {
        return (
            <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
                <p>Story not found.</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{ marginTop: 16, padding: "8px 16px", borderRadius: 4 }}
                >
                    Back to Dashboard
                </button>
            </main>
        );
    }

    // story display 
    return (
        <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
            <button 
                onClick={() => router.push("/dashboard")}
                style={{ marginBottom: 16, padding: "8px 16px", borderRadius: 10, border: "1px solid #ccc" }}
            >
                &larr; Back to Dashboard
            </button>

            <h1 style={{ fontSize: 28, fontWeight: "bold", marginBottom: 12 }}>{story.title}</h1>
            
            <div style={{ marginTop: 8, color: "#555" }}>
                <strong>Categories:</strong> {story.categories.join(', ')}<br />
            </div>

            <div style={{ marginTop: 8, color: "#777", fontSize: 14 }}>
                Created: {new Date(story.createdAt).toLocaleDateString()}
            </div>

            <section style={{ marginTop: 24, display: "grid", gap: 16 }}>
                <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontWeight: "700" }}>Situation</div>
                    <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{story.situation || "No situation provided."}</p>
                </div>

                <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontWeight: "700" }}>Action</div>
                    <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{story.action || "No action provided."}</p>
                </div>

                <div style={{ border: "1px solid #ddd", borderRadius: 8, padding: 16 }}>
                    <div style={{ fontWeight: "700" }}>Result</div>
                    <p style={{ marginTop: 8, whiteSpace: "pre-wrap" }}>{story.result || "No result provided."}</p>
                </div>
            </section>
        </main>
    );
} 
    