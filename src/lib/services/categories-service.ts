/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetCategoriesResponse } from "@/types/response.interfaces";
import API_ENDPOINTS, { } from "../api-endpoints";
import axiosInstance from "../axiosInstance";


export const getCategories = async (params: Record<string, any>): Promise<GetCategoriesResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch categories",
            categories: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};


export const getCategoryById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};


export const createCategory = async (categoryData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.CREATE, categoryData, {

        });
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create category" };
    }
};

export const updateCategory = async (categoryId: number, categoryData: FormData) => {

    try {
        categoryData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.CATEGORIES.UPDATE(categoryId), categoryData, {

        });
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update category" };
    }
};


export const deleteCategory = async (categoryId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.CATEGORIES.DELETE(categoryId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
