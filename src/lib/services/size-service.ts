/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetSizesResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getSizes = async (params: Record<string, any>): Promise<GetSizesResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.SIZES.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch sizes",
            sizes: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getSizeById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.SIZES.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createSize = async (sizeData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SIZES.CREATE, sizeData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create size" };
    }
};

export const updateSize = async (sizeId: number, sizeData: FormData) => {
    try {
        sizeData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.SIZES.UPDATE(sizeId), sizeData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update size" };
    }
};

export const deleteSize = async (sizeId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.SIZES.DELETE(sizeId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
