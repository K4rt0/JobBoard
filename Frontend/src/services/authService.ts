import axios from 'axios'
import { handleApiError } from '@/utils/apiHandlerError'
import { UserRequestDTO } from '@/interfaces'
import axiosInstance from './axiosInstance'
import { useAuthStore } from '@/store/authStore'

const API_URL = `${process.env.REACT_APP_BASE_API_URL}/user`

// ✅ API đăng nhập
export const loginApi = async (email: string, password: string) => {
    try {
        const response = await axiosInstance.post(`${API_URL}/login`, {
            email,
            password,
        })
        console.log('data', email, password)

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
