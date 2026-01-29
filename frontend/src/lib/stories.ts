// frontend/src/lib/stories.ts
// 도메인/API layer (업무 로직)
// 어떤 API 를 호출할지 결정
// 스토리 관련 API 호출 함수들
import { apiGet, apiPost } from "./api"; 

// prisma 스키마 기반 스토리 타입
export type Story = {
    id: string;
    userId: string;
    title: string;
    categories: string[];
    situation: string;
    action: string;
    result: string;
    createdAt: string;
};

// 스토리 목록 응답 타입
export type StoriesResponse = {
    stories: Story[];
};

export async function fetchStories(token: string) {
    return apiGet<StoriesResponse>("/stories", token);
}

// 스토리 생성 입력 타입
export type CreateStoryInput = {
    title: string;
    categories: string[];
    situation?: string;
    action?: string;
    result?: string;
};

// 
export async function createStory(token: string, input: CreateStoryInput) {
    return apiPost<Story>("/stories", input, { token });
}