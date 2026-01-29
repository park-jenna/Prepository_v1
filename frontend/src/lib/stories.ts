import { apiGet } from "./api"; 

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

export type StoriesResponse = {
    stories: Story[];
};

export async function fetchStories(token: string) {
    return apiGet<StoriesResponse>("/stories", token);
}