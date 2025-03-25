import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import { Job } from '@/interfaces'

export const getApplicantByProjectId = async (
    projectId: string,
): Promise<any> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/project/get-all-applicants/${projectId}`,
        )

        return response.data.data
    } catch (error) {
        handleApiError(error, 'Apply job failed')
    }
}

export const fetchJobsByEmployer = async (userId: string): Promise<Job[]> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/project/get-all-my-project`,
        )

        const jobs: Job[] = response?.data?.data || []

        return jobs
    } catch (error) {
        handleApiError(error, 'Fetching jobs failed')
        return [] // Tránh undefined khi có lỗi
    }
}

export const updateApplicantStatus = async (
    projectId: string,
    applicantId: string,
    status: 'accepted' | 'rejected' | 'pending' | 'finished',
): Promise<boolean> => {
    try {
        const response = await axiosInstance.patch(
            `project/update-applicant-status/${projectId}/${applicantId}`,
            { status },
        )
        return response?.status === 200
    } catch (error) {
        handleApiError(error, `Cập nhật trạng thái "${status}" thất bại`)
        return false
    }
}
