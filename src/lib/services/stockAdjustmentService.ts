import {
    GetStockAdjustmentsResponse
} from "@/types/response.interfaces";
import axiosInstance from "../axiosInstance";
import { StockAdjustment } from "@/types/api.interfaces";
import API_ENDPOINTS from "../api-endpoints";

export const getStockAdjustments = async (params: Record<string, any>): Promise<GetStockAdjustmentsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.STOCK_ADJUSTMENTS.LIST, { params });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch stock adjustments",
            adjustments: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getStockAdjustmentById = async (id: number): Promise<{
    result: boolean;
    message: string;
    adjustment?: StockAdjustment;
}> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.STOCK_ADJUSTMENTS.DETAILS(id));
        return response.data;
    } catch (error: any) {
        return { result: false, message: error?.response?.data?.message || "Failed to retrieve stock adjustment" };
    }
};

export const createStockManualAdjustment = async (data: Record<string, any>) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.STOCK_ADJUSTMENTS.CREATE_MANUAL, data);
        return response.data;
    } catch (error: any) {
        return { result: false, message: error?.response?.data?.message || "Failed to create manual stock adjustment" };
    }
};

export const deleteStockAdjustment = async (id: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.STOCK_ADJUSTMENTS.DELETE(id));
        return response.data;
    } catch (error: any) {
        return { result: false, message: error?.response?.data?.message || "Failed to delete stock adjustment" };
    }
};
