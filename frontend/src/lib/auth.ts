import { apiPost } from './api';

export type AuthResponse = {
    user: { id: string; email: string };
    token: string;
};

export async function login(email: string, password: string) {
    return apiPost<AuthResponse>('/auth/login', { email, password });
}