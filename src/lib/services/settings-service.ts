/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetAllSettingsResponse, GetProductVariantsResponse } from "@/types/response.interfaces";
import API_ENDPOINTS, { } from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getAllSettings = async (): Promise<GetAllSettingsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.SETTINGS.LIST, {

        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch data",
            roles: [],
            permissions: [],
            teams: [],
            categories: [],
            brands: [],
            color_seasons: [],
            colors: [],
            configurations: [],
            occupations: [],
            shelves: [],
            sizes: [],
            tags: [],
            warehouses: [],
        };
    }
};

export const getAllProductsVariants = async (): Promise<GetProductVariantsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCT_VARIANT.LIST, {
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch data",
            productVariants: []
        };
    }
};


