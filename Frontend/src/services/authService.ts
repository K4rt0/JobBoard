import axios from 'axios'
import { handleApiError } from '@/utils/apiHandlerError'
import { UserRequestDTO } from '@/interfaces'
import axiosInstance from './axiosInstance'
import { useAuthStore } from '@/store/authStore'

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/users`

// ✅ API đăng nhập
export const loginApi = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/login`, {
            username,
            password,
        })
        return response.data
    } catch (error) {
        handleApiError(error, 'Login failed')
    }
}

// ✅ API đăng ký
export const registerApi = async (userData: UserRequestDTO) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/register`,
            userData,
        )
        return response.data
    } catch (error) {
        handleApiError(error, 'Registration failed')
    }
}

// ✅ API đăng nhập bằng Google
export const loginGoogleApi = async (access_token: string) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/google`,
            { access_token: access_token },
            {
                headers: { 'Content-Type': 'application/json' },
            },
        )
        return response.data
    } catch (error) {
        handleApiError(error, 'Google login failed')
    }
}

// ✅ API làm mới Access Token
export const refresh_token = async (): Promise<string | null> => {
    try {
        const refresh_token = useAuthStore.getState().user?.refresh_token
        if (!refresh_token) throw new Error('No refresh token available')
        const response = await axiosInstance.post(
            `${API_URL}/refresh-token`,
            {
                refresh_token,
            },
            {
                headers: {
                    'Content-Type': 'application/json',
                },
            },
        )
        console.log('response:', response)
        const newaccess_token = response.data.access_token

        // Cập nhật token mới vào Zustand
        useAuthStore.setState((state) => ({
            user: state.user
                ? { ...state.user, access_token: newaccess_token }
                : null,
        }))

        // Cập nhật header cho axiosInstance
        axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${newaccess_token}`

        return newaccess_token
    } catch (error) {
        console.error('Lỗi khi refresh token:', error)

        // Nếu refresh token thất bại, logout user
        useAuthStore.getState().logout()
        return null
    }
}
