const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL!;

export async function apiPost<T>(endpoint: string, body: unknown): Promise<T> {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(body),
    });

    // 서버가 JSON 응답을 반환하지 않는 경우를 대비하여 안전장치
    const data = await res.json().catch(() => null);

    if (!res.ok) {
        const msg = data?.error ?? `Error ${res.status}`;
        throw new Error(msg);
    }

    return data as T;
}