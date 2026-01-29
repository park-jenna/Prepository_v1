// frontend/src/app/stories/[id]/edit/page.tsx
// 1) URL 파라미터에서 id 읽기
// 2) token 을 local storage 에서 읽기
// 3) fetchStoryById(token, id) 함수 호출로 기존 스토리 데이터 가져오기
// 4) 폼 UI 에 기존 스토리 데이터 채워서 표시(prefill)
// 5) 사용자가 수정 후 제출 시 API 호출 (updateStoryById(token, id, input))
// 6) 수정 완료 후 스토리 상세 페이지로(/stories/:id) 리다이렉트, 실패시 에러 표시

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchStoryById, Story, updateStoryById } from "@/lib/stories";

export default function EditStoryPage() {
    const router = useRouter();
    const params = useParams<{ id: string }>();
    const storyId = params?.id;

    // original story data
    const [story, setStory] = useState<Story | null>(null);

    // form state 
    const [title, setTitle] = useState("");
    const [categoriesText, setCategoriesText] = useState("");
    const [situation, setSituation] = useState("");
    const [action, setAction] = useState("");
    const [result, setResult] = useState("");

    // UX state
    const [loading, setLoading] = useState(true); // for initial data load
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 1) page load 시 기존 스토리 데이터 가져와서 form prefill
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

                // 3) fetchStoryById 함수 호출로 기존 스토리 데이터 가져오기
                const data = await fetchStoryById(token, storyId);
                setStory(data.story); // 원본 저장

                // 4) 폼 UI 에 기존 스토리 데이터 채워서 표시(prefill)
                setTitle(data.story.title ?? "");
                setCategoriesText((data.story.categories ?? []).join(", "));
                setSituation(data.story.situation ?? "");
                setAction(data.story.action ?? "");
                setResult(data.story.result ?? "");
            } catch (err) {
                const msg = err instanceof Error ? err.message : "Failed to load story.";
                setError(msg);
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [storyId]);

    async function handleSave(e: React.FormEvent) {
        e.preventDefault();
        
        setError(null);
        setSaving(true);

        try {
            // 1) token 을 local storage 에서 읽기
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in again.");
            }
            if (!storyId) {
                throw new Error("No story ID provided.");
            }

            const cleanTitle = title.trim();
            if (!cleanTitle) {
                throw new Error("Title is required.");
            }

            const categories = categoriesText
                .split(",")
                .map((cat) => cat.trim())
                .filter(Boolean);

            if (categories.length === 0) {
                throw new Error("At least one category is required.");
            }

            // 2) updateStoryById 함수 호출로 스토리 수정 요청 
            await updateStoryById(token, storyId, {
                title: cleanTitle,
                categories,
                situation: situation.trim(),
                action: action.trim(),
                result: result.trim(),
            });

            // 3) 수정 완료 후 스토리 상세 페이지로 리다이렉트
            router.push(`/stories/${storyId}`);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to update story.";
            setError(msg);
        } finally {
            setSaving(false);
        }
    }

    // loading
    if (loading) {
        return (
            <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
                <p>Loading story...</p>
            </main>
        );
    }

    // error
    if (error && !story) {
        return (
            <main style={{ maxWidth: 800, margin: "40px auto", padding: 16 }}>
                <p style={{ color: "crimson" }}>Error: {error}</p>
                <button
                    onClick={() => router.push("/dashboard")}
                    style={{ marginTop: 16, padding: "8px 16px", borderRadius: 4, border: "1px solid #111" }}
                >
                    Back to Dashboard
                </button>
            </main>
        );
    }
    // form
    return (
        <main style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>Edit Story</h1>
            {story && (
                <p style={{ color: "#666", marginBottom: 24 }}
                    >Editing: <strong>{story.title}</strong>
                </p>
            )}

            <form
                onSubmit={handleSave}
                style={{ display: "grid", gap: 16 }}
            >
                {/* Title */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Title *</span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                        required
                    />
                </label>

                {/* Categories */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Categories * (comma-separated)</span>
                    <input
                        value={categoriesText}
                        onChange={(e) => setCategoriesText(e.target.value)}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                    />
                </label>

                {/* Situation */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Situation</span>
                    <textarea
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        rows={4}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                    />
                </label>

                {/* Action */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Action</span>
                    <textarea
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        rows={4}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                    />
                </label>

                {/* Result */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Result</span>
                    <textarea
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        rows={4}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                    />
                </label>

                {error && <p style={{ color: "crimson", margin: 0 }}>Error: {error}</p>}

                <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                    <button
                        type="submit"
                        disabled={saving}
                        style={{
                            padding: "12px 24px",
                            borderRadius: 8,
                            border: "1px solid #111",
                            background: saving ? "#eee" : "#111",
                            color: saving ? "#111" : "#fff",
                            cursor: saving ? "not-allowed" : "pointer",
                        }}
                    >
                        {saving ? "Saving..." : "Save Changes"}
                    </button>

                    <button
                        type="button"
                        onClick={() => router.push(`/stories/${storyId}`)}
                        style={{
                            padding: "12px 24px",
                            borderRadius: 8,
                            border: "1px solid #ccc"
                        }}
                    >
                        Cancel
                    </button>
                </div>
            </form>
        </main>
    );
}