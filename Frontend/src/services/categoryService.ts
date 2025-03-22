import { Category } from '@/interfaces'
import axios from 'axios'

const API_URL = process.env.REACT_APP_BASE_API_URL

export const categoryService = {
    async getCategories(): Promise<Category[]> {
        try {
            const response = await axios.get(`${API_URL}/category/get-all`)
            return response.data.data
        } catch (error) {
            console.error('Error fetching categories:', error)
            throw error
        }
    },
}

export default categoryService
