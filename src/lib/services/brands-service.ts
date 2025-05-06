/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetBrandsResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getBrands = async (params: Record<string, any>): Promise<GetBrandsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.BRANDS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch brands",
            brands: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getBrandById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.BRANDS.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createBrand = async (brandData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.BRANDS.CREATE, brandData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create brand" };
    }
};

export const updateBrand = async (brandId: number, brandData: FormData) => {
    try {
        brandData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.BRANDS.UPDATE(brandId), brandData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update brand" };
    }
};

export const deleteBrand = async (brandId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.BRANDS.DELETE(brandId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
