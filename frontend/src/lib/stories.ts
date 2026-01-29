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

////////////////////////////////////////////
// GET /stories 
// 스토리 목록 응답 타입
export type StoriesResponse = {
    stories: Story[];
};

// 스토리 목록 가져오기
export async function fetchStories(token: string) {
    return apiGet<StoriesResponse>("/stories", token);
}

////////////////////////////////////////////
// POST /stories
// 스토리 생성 입력 타입
export type CreateStoryInput = {
    title: string;
    categories: string[];
    situation?: string;
    action?: string;
    result?: string;
};
// 스토리 생성 함수
export async function createStory(token: string, input: CreateStoryInput) {
    return apiPost<Story>("/stories", input, { token });
}

/////////////////////////////////////////////
// GET /stories/:id
export type StoryResponse = {
    story: Story;
};
// ID 로 스토리 가져오기
export async function fetchStoryById(token: string, storyId: string) {
    return apiGet<StoryResponse>(`/stories/${storyId}`, token);
}