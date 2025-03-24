// src/services/categoryService.ts
import { Category } from '@/interfaces'
import { handleApiError } from '@/utils/apiHandlerError'
import axios, { AxiosError } from 'axios'
import axiosInstance from './axiosInstance'

const API_BASE_URL = 'http://localhost:3000/api/v1'

interface ErrorResponse {
    statusCode: number
    message: string
    stack?: string
}

export const fetchCategories = async (
    page: number,
    limit: number,
    sort: string,
    search: string,
) => {
    try {
        let url = `${API_BASE_URL}/category/get-all-pagination?page=${page}&limit=${limit}`
        if (sort !== 'all') url += `&sort=${sort}`
        if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`

        const response = await axiosInstance.get(url, { timeout: 10000 })
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}
export const getAllCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get(
            `${API_BASE_URL}/category/get-all`,
        )
        return response.data.data
    } catch (error) {
        handleApiError(error, 'Failed to fetch categories')
        throw error
    }
}

export const createCategory = async (data: any) => {
    try {
        const response = await axiosInstance.post(
            `${API_BASE_URL}/category/create`,
            data,
        )
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}

export const updateCategory = async (id: string, data: any) => {
    try {
        const response = await axiosInstance.patch(
            `${API_BASE_URL}/category/update/${id}`,
            data,
        )
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}

export const deleteCategory = async (id: string) => {
    try {
        const response = await axiosInstance.delete(
            `${API_BASE_URL}/category/delete/${id}`,
        )
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}
