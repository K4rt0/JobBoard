import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import { UserInfoData } from '@/interfaces'

/**
 * Lấy danh sách tất cả người dùng (Chỉ Admin)
 */
export const getAllUsers = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
}

export const getCurrentUser = async (): Promise<any> => {
    try {
        const response = await axiosInstance.get(
            `${process.env.REACT_APP_BASE_API_URL}/user/profile`,
        )

        return response.data.data
    } catch (error) {
        handleApiError(error, 'Get user information failed')
    }
}

export const updateUserProfile = async (
    userData: Partial<UserInfoData>,
): Promise<UserInfoData> => {
    try {
        const response = await axiosInstance.put(
            `${process.env.REACT_APP_BASE_API_URL}/user/me/edit`,
            userData,
        )

        return response.data.data // Assuming response.data.data contains the updated user info
    } catch (error) {
        handleApiError(error, 'Update user information failed')
        throw error // Re-throw the error so the calling component can handle it
    }
}
/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (userId: string): Promise<any> => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
}
