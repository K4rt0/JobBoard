import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { loginApi, loginGoogleApi, registerApi } from '@/services/authService'
import axios from 'axios'
import { TokenResponse } from '@react-oauth/google'
import { UserAuth } from '@/interfaces'
import { refresh_token } from '@/services/axiosInstance'

interface AuthState {
    user: UserAuth | null
    login: (username: string, password: string) => Promise<void>
    register: (
        full_name: string,
        email: string,
        password: string,
    ) => Promise<void>
    loginWithGoogle: (tokenResponse: TokenResponse) => Promise<void>
    refreshaccess_token: () => Promise<void>
    fetchUserProfile: () => Promise<void> // Thêm hàm lấy thông tin người dùng
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
             * Đăng nhập với username/password
             */
            login: async (email, password) => {
                try {
                    const response = await loginApi(email, password)
                    const userData: UserAuth = {
                        id: response.data.id,
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    }

                    set({ user: userData })
                    setAuthHeader(userData.access_token)

                    // Gọi hàm lấy thông tin chi tiết ngay sau khi đăng nhập
                    await get().fetchUserProfile()
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        throw error.response?.data?.message || 'Login failed'
                    }
                    throw new Error('An unexpected error occurred')
                }
            },

            /**
             * Đăng ký tài khoản mới
             */
            register: async (full_name, email, password) => {
                try {
                    const response = await registerApi({
                        full_name,
                        email,
                        password,
                    })
                    const userData: UserAuth = {
                        id: response.data.id,
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    }

                    set({ user: userData })
                    setAuthHeader(userData.access_token)

                    // Gọi hàm lấy thông tin chi tiết ngay sau khi đăng ký
                    await get().fetchUserProfile()
                } catch (error) {
                    if (axios.isAxiosError(error)) {
                        throw (
                            error.response?.data?.message ||
                            'Registration failed'
                        )
                    }
                    throw new Error('An unexpected error occurred')
                }
            },

            /**
             * Đăng nhập bằng Google OAuth
             */
            loginWithGoogle: async (tokenResponse: TokenResponse) => {
                try {
                    if (!tokenResponse.access_token) {
                        throw new Error(
                            'Google login failed. No access token received.',
                        )
                    }

                    const response = await loginGoogleApi(
                        tokenResponse.access_token,
                    )
                    const userData: UserAuth = {
                        id: response.data.id,
                        access_token: response.data.access_token,
                        refresh_token: response.data.refresh_token,
                    }

                    set({ user: userData })
                    setAuthHeader(userData.access_token)

                    // Gọi hàm lấy thông tin chi tiết ngay sau khi đăng nhập bằng Google
                    await get().fetchUserProfile()
                } catch (error) {
                    throw new Error('Google login failed. Try again!')
                }
            },

            /**
             * Refresh Access Token bằng Refresh Token
             */
            refreshaccess_token: async () => {
                try {
                    const user = get().user
                    if (!user || !user.refresh_token) {
                        throw new Error('No refresh token available')
                    }

                    await refresh_token()

                    // Có thể gọi lại fetchUserProfile nếu cần cập nhật thông tin
                    await get().fetchUserProfile()
                } catch (error) {
                    console.error('Refresh token failed:', error)
                    get().logout()
                }
            },

            /**
             * Lấy thông tin chi tiết người dùng từ ID
             */
            fetchUserProfile: async () => {
                try {
                    const user = get().user
                    if (!user || !user.access_token) {
                        throw new Error('User not authenticated')
                    }

                    // Gọi API lấy thông tin người dùng
                    const response = await axios.get(
                        `${process.env.REACT_APP_BASE_API_URL}/user/profile`, // Hoặc `/users/${user.id}`
                        {
                            headers: {
                                Authorization: `Bearer ${user.access_token}`,
                            },
                        },
                    )

                    const profileData = response.data

                    // Cập nhật user trong store với thông tin đầy đủ
                    set((state) => ({
                        user: state.user
                            ? {
                                  ...state.user,
                                  full_name: profileData.data.full_name,
                                  email: profileData.data.email,
                                  avatar: profileData.data.avatar,
                                  role: profileData.data.role,
                              }
                            : null,
                    }))
                } catch (error) {
                    console.error('Failed to fetch user profile:', error)
                    throw error // Có thể xử lý lỗi ở nơi gọi hàm nếu cần
                }
            },

            /**
             * Đăng xuất người dùng
             */
            logout: () => {
                set({ user: null })
                setAuthHeader(null)
            },
        }),
        {
            name: 'auth-storage',
            storage: createJSONStorage(() => localStorage),
        },
    ),
)
