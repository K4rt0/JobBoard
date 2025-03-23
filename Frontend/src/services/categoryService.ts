// src/services/categoryService.ts
import { Category } from '@/interfaces'
import { handleApiError } from '@/utils/apiHandlerError'
import axios from 'axios'
import axiosInstance from './axiosInstance'

const API_URL = process.env.REACT_APP_BASE_API_URL

export const getCategories = async (): Promise<Category[]> => {
    try {
        const response = await axiosInstance.get(`${API_URL}/category/get-all`)
        return response.data.data
    } catch (error) {
        handleApiError(error, 'Failed to fetch categories')
        throw error
    }
}
