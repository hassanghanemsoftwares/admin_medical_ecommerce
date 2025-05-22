/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetOccupationsResponse } from "@/types/response.interfaces";
import API_ENDPOINTS from "../api-endpoints";
import axiosInstance from "../axiosInstance";

export const getOccupations = async (params: Record<string, any>): Promise<GetOccupationsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.OCCUPATIONS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch Occupations",
            occupations: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

export const getOccupationById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.OCCUPATIONS.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

export const createOccupation = async (OccupationData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.OCCUPATIONS.CREATE, OccupationData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create Occupation" };
    }
};

export const updateOccupation = async (OccupationId: number, OccupationData: FormData) => {
    try {
        OccupationData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.OCCUPATIONS.UPDATE(OccupationId), OccupationData);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update Occupation" };
    }
};

export const deleteOccupation = async (OccupationId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.OCCUPATIONS.DELETE(OccupationId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
