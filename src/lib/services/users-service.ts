/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetUsersResponse } from "@/types/apiTypes";
import API_ENDPOINTS, { } from "../api-endpoints";
import axiosInstance from "../axiosInstance";



export const getUsers = async (params: Record<string, any>): Promise<GetUsersResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.USERS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch users",
            users: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};

// Get user details
export const getUserById = async (id: number) => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.USERS.DETAILS(id));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

// Create a new user
export const createUser = async (userData: any) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.USERS.CREATE, userData);
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

// Update a user
export const updateUser = async (userId: number, userData: any) => {
    try {
        const response = await axiosInstance.put(API_ENDPOINTS.USERS.UPDATE(userId), userData);
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};

// Delete a user
export const deleteUser = async (userId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.USERS.DELETE(userId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
