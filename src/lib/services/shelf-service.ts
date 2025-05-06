/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetShelvesResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getShelves = async (params: Record<string, any>): Promise<GetShelvesResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.SHELVES.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch shelves",
            shelves: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getShelfById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.SHELVES.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createShelf = async (shelfData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.SHELVES.CREATE, shelfData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create shelf" };
    }
};

export const updateShelf = async (shelfId: number, shelfData: FormData) => {
    try {
        shelfData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.SHELVES.UPDATE(shelfId), shelfData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update shelf" };
    }
};

export const deleteShelf = async (shelfId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.SHELVES.DELETE(shelfId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
