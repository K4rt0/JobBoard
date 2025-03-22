import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'

export const getApplicantByProjectId = async (
    projectId: string,
): Promise<any> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/project/get-all-applicants/${projectId}`,
        )
        console.log(response.data.data)

        return response.data.data
    } catch (error) {
        handleApiError(error, 'Apply job failed')
    }
}
