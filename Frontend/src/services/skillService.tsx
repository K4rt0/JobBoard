import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import axios from 'axios'

export const getSkillsList = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/skill/get-all`,
        )

        return response.data.data
    } catch (error) {
        handleApiError(error, 'Get user information failed')
    }
}

export const getSkillById = async (skillId: string) => {
    const response = await axios.get(
        `${process.env.REACT_APP_BASE_API_URL}/skill/${skillId}`,
    )
    return response.data.data
}
