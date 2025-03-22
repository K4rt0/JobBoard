import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
    loginAdminApi,
    loginApi,
    loginGoogleApi,
    registerApi,
} from '@/services/authService'
import axios from 'axios'
import { TokenResponse } from '@react-oauth/google'
import { UserAuth } from '@/interfaces'
import { refresh_token } from '@/services/axiosInstance'
import { getCurrentUser } from '@/services/userService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

interface AuthState {
    user: UserAuth | null
    login: (email: string, password: string) => Promise<boolean>
    loginAdmin: (username: string, password: string) => Promise<boolean>
    register: (
        full_name: string,
        email: string,
        password: string,
    ) => Promise<boolean>
    loginWithGoogle: (tokenResponse: TokenResponse) => Promise<boolean>
    refreshAccessToken: () => Promise<void>
    fetchUserProfile: () => Promise<void>
    logout: () => void
}

// Hàm set Authorization vào Axios
const setAuthHeader = (token: string | null) => {
    if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
        delete axios.defaults.headers.common['Authorization']
    }
}

// Store Zustand với persist và JSON storage
export const useAuthStore = create<AuthState>()(
    persist(
        (set, get) => ({
            user: null,

            /**
             * Đăng nhập với email/password
             */
            login: async (email, password) => {
                try {
                    const response = await loginApi(email, password)
                    const userData: UserAuth = {
                        id: response.data.id,
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                        role: response.data.role,
                    }

                    set({ user: userData })
                    setAuthHeader(userData.access_token)

                    await get().fetchUserProfile()
                    return true // Đăng nhập thành công
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error)

                        const errorMessage =
                            error.response?.data?.message ||
                            'Invalid email or password!'
                        toast.error(errorMessage)
                        return false
                    }
                    return false
                }
            },
            loginAdmin: async (username, password) => {
                try {
                    const response = await loginAdminApi(username, password)
                    const userData: UserAuth = {
                        id: response.data.id,
                        role: response.data.role,
                        access_token: response.data.access_token,
                        access_token_admin: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    }

                    set({ user: userData })
                    setAuthHeader(userData.access_token)

                    return true // Đăng nhập thành công
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        console.log(error)

                        const errorMessage =
                            error.response?.data?.message ||
                            'Invalid email or password!'
                        toast.error(errorMessage)
                        return false
                    }
                    return false
                }
            },
            /**
             * Đăng ký tài khoản mới
             */
            register: async (full_name, email, password) => {
                try {
                    await registerApi({ full_name, email, password })

                    const success = await get().login(email, password)
                    if (success) {
                        toast.success('Account created successfully!')
                        return true
                    }
                    return false
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        toast.error(
                            error.response?.data?.message ||
                                'Registration failed',
                        )
                    } else {
                        toast.error('An unexpected error occurred')
                    }
                    return false
                }
            },

            /**
             * Đăng nhập bằng Google OAuth
             */
            loginWithGoogle: async (tokenResponse: TokenResponse) => {
                try {
                    if (!tokenResponse.access_token) {
                        toast.error(
                            'Google login failed. No access token received.',
                        )
                        return false
                    }

                    const response = await loginGoogleApi(
                        tokenResponse.access_token,
                    )
                    const userData: UserAuth = {
                        id: response.data.id,
                        role: response.data.role,
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    }

                    set({ user: userData })
                    setAuthHeader(userData.access_token)

                    await get().fetchUserProfile()
                    toast.success('Google login successful!')

                    return true
                } catch (error) {
                    toast.error('Google login failed. Please try again.')
                    return false
                }
            },

            /**
             * Refresh Access Token bằng Refresh Token
             */
            refreshAccessToken: async () => {
                try {
                    const user = get().user
                    if (!user || !user.refresh_token) {
                        throw new Error('No refresh token available')
                    }

                    await refresh_token()
                    await get().fetchUserProfile()
                } catch (error) {
                    console.error('Refresh token failed:', error)
                    toast.error('Session expired. Please log in again.')
                    get().logout() // Tự động logout nếu refresh token thất bại
                }
            },

            /**
             * Lấy thông tin chi tiết người dùng
             */
            fetchUserProfile: async () => {
                try {
                    const user = get().user
                    if (!user || !user.access_token) {
                        throw new Error('User not authenticated')
                    }

                    const response = await getCurrentUser()
                    const profileData = response

                    set((state) => ({
                        user: state.user
                            ? {
                                  ...state.user,
                                  full_name: profileData.fullName,
                                  email: profileData.email,
                                  avatar: profileData.avatar ?? undefined,
                                  role: profileData.role,
                              }
                            : null,
                    }))
                } catch (error) {
                    console.error('Failed to fetch user profile:', error)
                    toast.error(
                        'Failed to fetch user profile. Please try again.',
                    )
                }
            },

            /**
             * Đăng xuất người dùng
             */
            logout: () => {
                set({ user: null })
                setAuthHeader(null)
                toast.success('Logged out successfully.')
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
