import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import axios from 'axios'
import { Skill } from '@/interfaces'

export const applyJob = async (jobId: string): Promise<any> => {
    try {
        const response = await axiosInstance.post(
            `${process.env.REACT_APP_BASE_API_URL}/project/apply/${jobId}`,
        )

        return response.data.data
    } catch (error) {
        handleApiError(error, 'Apply job failed')
    }
}
