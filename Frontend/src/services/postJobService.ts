// postJobService.tsx
import axiosInstance from './axiosInstance'
import { AxiosError } from 'axios'

interface JobPayload {
    title: string
    salary: { min: number; max: number }
    location: string
    description: string
    expired_at: number
    category_id: string
    quantity: number
    skills: string[]
    experience: number
    gender: string
    requirements: string[]
    benefits: string[]
    contact: {
        full_name: string
        email: string
        phone_number: string
    }
    job_type: string[]
    status: string
}

export const postJob = async (payload: JobPayload): Promise<any> => {
    try {
        console.log('Posting job with payload:', payload)
        const response = await axiosInstance.post('/project/create', payload)
        console.log('Job posted successfully:', response.data)
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError
        console.error('Error posting job:', axiosError)
        if (axiosError.response) {
            console.log('Response data:', axiosError.response.data)
        }
        throw new Error(
            'Failed to post job. Please check your credentials or try again.',
        )
    }
}

export const updateJob = async (
    payload: JobPayload,
    jobId: string,
): Promise<any> => {
    try {
        console.log('Updating job with payload:', payload)
        const response = await axiosInstance.put(
            `/project/update/${jobId}`,
            payload,
        )
        console.log('Job updated successfully:', response.data)
        return response.data
    } catch (error) {
        const axiosError = error as AxiosError
        console.error('Error updating job:', axiosError)
        if (axiosError.response) {
            console.log('Response data:', axiosError.response.data)
        }
        throw new Error(
            'Failed to update job. Please check your input or try again.',
        )
    }
}
