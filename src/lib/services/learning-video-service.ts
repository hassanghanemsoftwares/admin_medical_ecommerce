/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetLearningVideosResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getLearningVideos = async (params: Record<string, any>): Promise<GetLearningVideosResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.LEARNING_VIDEOS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch learning videos",
            learningVideos: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getLearningVideoById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.LEARNING_VIDEOS.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createLearningVideo = async (learningVideoData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.LEARNING_VIDEOS.CREATE, learningVideoData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create learning video" };
    }
};

export const updateLearningVideo = async (learningVideoId: number, learningVideoData: FormData) => {
    try {
        learningVideoData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.LEARNING_VIDEOS.UPDATE(learningVideoId), learningVideoData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update learning video" };
    }
};

export const deleteLearningVideo = async (learningVideoId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.LEARNING_VIDEOS.DELETE(learningVideoId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
