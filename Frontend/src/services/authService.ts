import axios from 'axios'
import { handleApiError } from '@/utils/apiHandlerError'
import { UserRequestDTO } from '@/interfaces'
import axiosInstance from './axiosInstance'
import { useAuthStore } from '@/store/authStore'

const API_URL = `${process.env.REACT_APP_BASE_API_URL}`

// ✅ API đăng nhập
export const loginApi = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/auth/login`, {
            email,
            password,
        })

        return response.data
    } catch (error) {
        handleApiError(error, 'Login failed')
    }
}

export const loginAdminApi = async (username: string, password: string) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/admin/login`, {
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
            `${API_URL}/user/register`,
            userData,
        )
        return response.data
    } catch (error) {
        handleApiError(error, 'Registration failed')
    }
}

// ✅ API đăng nhập bằng Google
export const loginGoogleApi = async (id_token: string) => {
    try {
        const response = await axiosInstance.post(
            `${API_URL}/auth/google-login`,
            { id_token: id_token },
            {
                headers: { 'Content-Type': 'application/json' },
            },
        )
        return response.data
    } catch (error) {
        handleApiError(error, 'Google login failed')
    }
}
