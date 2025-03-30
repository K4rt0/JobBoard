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
        handleApiError(error, 'Get skills list failed')
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

export const fetchSkills = async (
    page: number,
    limit: number,
    sort: string,
    search: string,
) => {
    try {
        let url = `${process.env.REACT_APP_BASE_API_URL}/skill/get-all-pagination?page=${page}&limit=${limit}`
        if (sort !== 'all') url += `&sort=${sort}`
        if (search.trim()) url += `&search=${encodeURIComponent(search.trim())}`
        const response = await axiosInstance.get(url)
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message)
    }
}

export const createSkill = async (data: {
    name: string
    is_disabled: boolean
}) => {
    try {
        const response = await axiosInstance.post(
            `${process.env.REACT_APP_BASE_API_URL}/skill/create`,
            data,
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message)
    }
}

export const updateSkill = async (
    id: string,
    data: { name: string; is_disabled: boolean },
) => {
    try {
        const response = await axiosInstance.patch(
            `${process.env.REACT_APP_BASE_API_URL}/skill/update/${id}`,
            data,
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message)
    }
}

export const deleteSkill = async (id: string) => {
    try {
        const response = await axiosInstance.delete(
            `${process.env.REACT_APP_BASE_API_URL}/skill/delete/${id}`,
        )
        return response.data
    } catch (error: any) {
        throw new Error(error.response?.data?.message || error.message)
    }
}
