import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import axios from 'axios'
import { Skill } from '@/interfaces'

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

export async function getSkillById(skillId: string): Promise<Skill> {
    try {
        const response = await axios.get<{ message: string; data: Skill }>(
            `${process.env.REACT_APP_BASE_API_URL}/skill/${skillId}`,
        )
        return response.data.data
    } catch (error) {
        console.error(`Error fetching skill with ID ${skillId}:`, error)
        throw error
    }
}
