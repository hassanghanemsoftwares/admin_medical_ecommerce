/* eslint-disable @typescript-eslint/no-explicit-any */
import { GetProductResponse, GetProductsResponse } from "@/types/response.interfaces";
import API_ENDPOINTS, { } from "../api-endpoints";
import axiosInstance from "../axiosInstance";


export const getProducts = async (params: Record<string, any>): Promise<GetProductsResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.LIST, {
            params,
        });
        return response.data;
    } catch (error: any) {
        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch Products",
            products: [],
            pagination: { total: 0, per_page: 10, current_page: 1, last_page: 1 },
        };
    }
};


export const getProductById = async (id: number): Promise<GetProductResponse> => {
    try {
        const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.DETAILS(id));
        return response.data;
    } catch (error: any) {

        return {
            result: false,
            message: error?.response?.data?.message || "Failed to fetch Products",
        };
    }
};


export const createProduct = async (productData: FormData) => {
    try {
        const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.CREATE, productData, {

        });
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to create product" };
    }
};

export const updateProduct = async (productId: number, productData: FormData) => {

    try {
        productData.append('_method', 'PUT');
        const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.UPDATE(productId), productData, {

        });
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update product" };
    }
};


export const deleteProduct = async (productId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE(productId));
        return response.data;
    } catch (error) {
        return { result: false, message: error };
    }
};
export const updateProductImage = async (imageId: number, data: FormData) => {
    try {
    
        data.append('_method', 'PUT');

        const response = await axiosInstance.post(API_ENDPOINTS.PRODUCT_IMAGES.UPDATE(imageId), data);
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to update product image" };
    }
};

export const deleteProductImage = async (imageId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCT_IMAGES.DELETE(imageId));
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to delete product image" };
    }
};

export const deleteProductVariant  = async (variantId: number) => {
    try {
        const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCT_VARIANT.DELETE(variantId));
        return response.data;
    } catch (error) {
        return { result: false, message: "Failed to delete product variant" };
    }
};