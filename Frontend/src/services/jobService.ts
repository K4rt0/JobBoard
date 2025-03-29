import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import axios from 'axios'
import {
    ApplyJob,
    ApplyJobsResponse,
    Job,
    JobsResponse,
    Pagination,
    PaginationInfo,
    Skill,
} from '@/interfaces'

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

export const fetchJobsByUser = async (): Promise<Job[]> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/user/get-all-project`,
        )

        const jobs: Job[] = response?.data?.data || []

        return jobs
    } catch (error) {
        handleApiError(error, 'Fetching jobs failed')
        return [] // Tránh undefined khi có lỗi
    }
}

interface FetchJobsParams {
    page?: number
    limit?: number
    sort?: string
    status?: string
    search?: string
}
export const fetchJobsByUserWithPagination = async ({
    page = 1,
    limit = 10,
    sort = 'all',
    status = 'all',
    search = '',
}: FetchJobsParams = {}): Promise<{
    jobs: ApplyJob[]
    pagination: Pagination
}> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/user/get-all-project-pagination`,
            {
                params: {
                    page,
                    limit,
                    sort,
                    status,
                    search,
                },
            },
        )
        const data: ApplyJobsResponse = response.data

        return {
            jobs: data.data, // Danh sách job
            pagination: data.pagination, // Thông tin phân trang
        }
    } catch (error) {
        handleApiError(error, 'Fetching jobs with pagination failed')
        throw error
    }
}
