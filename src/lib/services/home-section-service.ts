/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetHomeSectionsResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getHomeSections = async (params: Record<string, any>): Promise<GetHomeSectionsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.HOME_SECTIONS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch home sections",
            homeSections: [],
            // pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getHomeSectionById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.HOME_SECTIONS.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createHomeSection = async (homeSectionData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.HOME_SECTIONS.CREATE, homeSectionData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create home section" };
    }
};

export const updateHomeSection = async (homeSectionId: number, homeSectionData: FormData) => {
    try {
        homeSectionData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.HOME_SECTIONS.UPDATE(homeSectionId), homeSectionData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update home section" };
    }
};

export const deleteHomeSection = async (homeSectionId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.HOME_SECTIONS.DELETE(homeSectionId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
