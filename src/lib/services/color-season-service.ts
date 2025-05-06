/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetColorSeasonsResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getColorSeasons = async (params: Record<string, any>): Promise<GetColorSeasonsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.COLOR_SEASONS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch color seasons",
            color_seasons: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getColorSeasonById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.COLOR_SEASONS.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createColorSeason = async (colorSeasonData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.COLOR_SEASONS.CREATE, colorSeasonData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create color season" };
    }
};

export const updateColorSeason = async (colorSeasonId: number, colorSeasonData: FormData) => {
    try {
        colorSeasonData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.COLOR_SEASONS.UPDATE(colorSeasonId), colorSeasonData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update color season" };
    }
};

export const deleteColorSeason = async (colorSeasonId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.COLOR_SEASONS.DELETE(colorSeasonId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
