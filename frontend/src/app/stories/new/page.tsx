// frontend/src/app/stories/new/page.tsx
// 1) 사용자가 입력할 폼 UI
// 2) 입력값을 React state 로 관리
// 3) 제출 시 API 호출 (스토리 생성) 
//      - createStory(token, input) 호출로 서버에 새 스토리 생성 요청
// 4) 생성 완료 후 대시보드로 리다이렉트, 실패시 에러 표시

"use client";

import React, { use, useState } from 'react';
import { useRouter } from 'next/navigation';        
import { createStory } from '@/lib/stories';

export default function NewStoryPage() {
    const router = useRouter();

    // 폼 입력값을 위한 state
    const [title, setTitle] = useState("");
    const [categoriesText, setCategoriesText] = useState("");
    const [situation, setSituation] = useState("");
    const [action, setAction] = useState("");
    const [result, setResult] = useState("");

    // 로딩/에러 상태 관리
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        setError(null);
        setLoading(true);

        try {
            // 1) token 을 local storage 에서 읽기
            const token = localStorage.getItem("token");
            if (!token) {
                throw new Error("No token found. Please log in again.");
            }

            // 2) 최소 겅증: title, categories 입력값 확인
            const cleanTitle = title.trim();
            if (!cleanTitle) {
                throw new Error("Title is required.");
            }

            // 3) categories 를 쉼표로 분리하여 배열로 변환
            const categories = categoriesText
                .split(",")
                .map((cat) => cat.trim())
                .filter(Boolean); // 빈 문자열 제거

            if (categories.length === 0) {
                throw new Error("At least one category is required.");
            }

            // 4) API 호출을 위한 입력 객체 생성
            const input = {
                title: cleanTitle,
                categories,
                situation: situation.trim(),
                action: action.trim(),
                result: result.trim(),
            };

            // 5) createStory 함수 호출로 새 스토리 생성 요청
            await createStory(token, input);

            // 6) 생성 성공 시 대시보드로 리다이렉트
            router.push("/dashboard");
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Failed to create story.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }

        return (
        <main style={{ maxWidth: 600, margin: "40px auto", padding: 16 }}>
            <h1 style={{ fontSize: 24, fontWeight: "bold", marginBottom: 24 }}>New Story</h1>
            <p style={{ color: "#666", marginBottom: 24 }}>
                Create a new behavioral interview story. Use commas to add multiple categories.
            </p>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
                {/* Title */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Title *</span>
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="E.g., Leading a team project"
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
                        placeholder="E.g., Leadership, Conflict"
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
                    />
                </label>

                {/* Situation */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Situation</span>
                    <textarea
                        value={situation}
                        onChange={(e) => setSituation(e.target.value)}
                        placeholder="What was the context?"
                        rows={3}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8, minHeight: 80 }}
                    />
                </label>

                {/* Action */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Action</span>
                    <textarea
                        value={action}
                        onChange={(e) => setAction(e.target.value)}
                        placeholder="What did you do?"
                        rows={3}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8, minHeight: 80 }}
                    />
                </label>

                {/* Result */}
                <label style={{ display: "grid", gap: 6 }}>
                    <span style={{ fontWeight: "600" }}>Result</span>
                    <textarea
                        value={result}
                        onChange={(e) => setResult(e.target.value)}
                        placeholder="What was the outcome?"
                        rows={3}
                        style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8, minHeight: 80 }}
                    />
                </label>

                {/* Error Message */}
                {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: 12,
                        borderRadius: 8,
                        border: "1px solid #111",
                        background: loading ? "#eee" : "#111",
                        color: loading ? "#111" : "#fff",
                        cursor: loading ? "not-allowed" : "pointer",
                        fontWeight: "700",
                    }}
                >
                    {loading ? "Saving..." : "Create Story"}
                </button>
            </form>
        </main>
    );
}   