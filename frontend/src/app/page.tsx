"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    setHasToken(!!localStorage.getItem("token"));
  }, []);

  return (
    <main style={{ maxWidth: 720, margin: "60px auto", padding: 16 }}>
      <h1 style={{ fontSize: 32, fontWeight: 900 }}>Prepository</h1>
      <p style={{ marginTop: 10, color: "#555" }}>
        Store and refine behavioral interview stories using the STAR framework.
      </p>

      <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
        {hasToken ? (
          <>
            <button
              onClick={() => router.push("/dashboard")}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", fontWeight: 700 }}
            >
              Continue to Dashboard
            </button>
            <button
              onClick={() => {
                localStorage.removeItem("token");
                setHasToken(false);
              }}
              style={{ padding: 10, borderRadius: 10, border: "1px solid #111", fontWeight: 700 }}
            >
              Log out
            </button>
          </>
        ) : (
          <button
            onClick={() => router.push("/login")}
            style={{ padding: 10, borderRadius: 10, border: "1px solid #111", background: "#111", color: "#fff", fontWeight: 700 }}
          >
            Go to Login
          </button>
        )}
      </div>
    </main>
  );
}