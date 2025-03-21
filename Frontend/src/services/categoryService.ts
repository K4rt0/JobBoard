// src/services/categoryService.ts
import axios, { AxiosError } from 'axios'

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
    token: string,
) => {
    try {
        let url = `${API_BASE_URL}/category/get-all-pagination?page=${page}&limit=${limit}`
        if (sort !== 'all') url += `&sort=${sort}`
        if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`

        const response = await axios.get(url, {
            headers: { Authorization: `Bearer ${token}` },
            timeout: 10000,
        })
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}

export const createCategory = async (data: any, token: string) => {
    try {
        const response = await axios.post(
            `${API_BASE_URL}/category/create`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        )
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}

export const updateCategory = async (id: string, data: any, token: string) => {
    try {
        const response = await axios.patch(
            `${API_BASE_URL}/category/update/${id}`,
            data,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        )
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}

export const deleteCategory = async (id: string, token: string) => {
    try {
        const response = await axios.delete(
            `${API_BASE_URL}/category/delete/${id}`,
            {
                headers: { Authorization: `Bearer ${token}` },
            },
        )
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError<ErrorResponse>
        throw new Error(
            axiosError.response?.data?.message || axiosError.message,
        )
    }
}
