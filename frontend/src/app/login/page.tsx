"use client";

import { useState } from "react";
import { login } from "@/lib/auth";

export default function LoginPage() {
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    // Form 제출 핸들러
    async function handleSubmit (e: React.FormEvent) {
        // 브라우저의 기본동작(새로고침) 방지
        e.preventDefault();

        // you handle the login logic here
        setError(null);
        setSuccessMsg(null);
        setLoading(true);

        try {
            // 로그인 API 호출
            // 성공하면 {user, token} 형태의 응답을 받음
            const data = await login(email, password);
            setSuccessMsg(`Logged in as ${data.user.email}`);
            console.log("Login successful:", data);
        } catch (err) {
            const msg = err instanceof Error ? err.message : "Login failed";
            setError(msg);
        } finally {
            setLoading(false);
        }
    }



  return (
    <main style={{ maxWidth: 420, margin: "40px auto", padding: 16 }}>
      <h1 style={{ fontSize: 24, fontWeight: 700 }}>Login</h1>

      <form
        onSubmit={handleSubmit}
        style={{ display: "grid", gap: 16, marginTop: 24 }}
      >
        <label style={{ display: "grid", gap: 6 }}>
          <span>Email</span>
          <input
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        <label style={{ display: "grid", gap: 6 }}>
          <span>Password</span>
          <input
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ padding: 10, border: "1px solid #ccc", borderRadius: 8 }}
          />
        </label>

        {error && <p style={{ color: "crimson", margin: 0 }}>{error}</p>}
        {successMsg && <p style={{ color: "green", margin: 0 }}>{successMsg}</p>}

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
          }}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </main>
  );
}