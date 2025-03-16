import { useAuthStore } from '@/store/authStore'
import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios'

// 🟢 Interface mở rộng AxiosRequestConfig để thêm `_retry`
interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
    _retry?: boolean
}

// 🟢 Tạo một Axios instance chuyên dùng để refresh token (Không có interceptor)
const refreshAxiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    withCredentials: true,
    timeout: 10000, // 10 giây timeout
})

// 🟢 Main axios instance (Dùng cho mọi request)
const axiosInstance = axios.create({
    baseURL: process.env.REACT_APP_BASE_API_URL,
    withCredentials: true,
    timeout: 10000,
})

// 🟢 Hàm refresh token
export const refresh_token = async (): Promise<string | null> => {
    try {
        const refresh_token: string | null =
            useAuthStore.getState().user?.refresh_token ?? null
        if (!refresh_token) throw new Error('No refresh token available')

        // 🟢 Gửi request refresh token (dùng refreshAxiosInstance để tránh vòng lặp)
        const response = await refreshAxiosInstance.post(
            `/user/refresh-token`,
            { refresh_token },
            { headers: { 'Content-Type': 'application/json' } },
        )

        console.log('Token refresh response:', response)
        const newaccess_token: string | null =
            response?.data?.access_token ?? null
        if (!newaccess_token)
            throw new Error('Invalid response from refresh token')

        // 🟢 Cập nhật token mới vào Zustand
        useAuthStore.setState((state) => ({
            user: state.user
                ? { ...state.user, access_token: newaccess_token }
                : null,
        }))

        // 🟢 Cập nhật token mới vào axiosInstance
        axiosInstance.defaults.headers.common['Authorization'] =
            `Bearer ${newaccess_token}`

        return newaccess_token
    } catch (error) {
        console.error('Lỗi khi refresh token:', error)
        useAuthStore.getState().logout() // Logout nếu refresh token thất bại
        return null
    }
}

// 🟢 Request Interceptor: Tự động gắn access_token vào request
axiosInstance.interceptors.request.use(
    (config) => {
        const access_token: string | null =
            useAuthStore.getState().user?.access_token ?? null
        if (access_token) {
            config.headers.Authorization = `Bearer ${access_token}`
        }
        return config
    },
    (error) => Promise.reject(error),
)

// 🟢 Response Interceptor: Xử lý lỗi 401 và tự động refresh token
axiosInstance.interceptors.response.use(
    (response) => response,
    async (error: unknown) => {
        if (!(error instanceof AxiosError) || !error.config) {
            return Promise.reject(error)
        }

        const originalRequest = error.config as CustomAxiosRequestConfig

        // Nếu lỗi 401 và chưa thử refresh token, thử refresh token
        if (
            error.response?.status === 401 &&
            !originalRequest._retry &&
            !originalRequest.url?.includes('/auth/refresh-token') // Không refresh lại khi đang làm mới token
        ) {
            originalRequest._retry = true
            try {
                const newaccess_token = await refresh_token()
                if (newaccess_token) {
                    originalRequest.headers['Authorization'] =
                        `Bearer ${newaccess_token}`
                    return axiosInstance(originalRequest)
                } else {
                    return Promise.reject(error)
                }
            } catch (refreshError) {
                console.error('Lỗi khi refresh token:', refreshError)
                useAuthStore.getState().logout()
                return Promise.reject(refreshError)
            }
        }

        return Promise.reject(error)
    },
)

// 🟢 Kiểm tra token có hết hạn không
export const isTokenExpired = (token: string | null): boolean => {
    if (!token) return true

    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(
                    (c) =>
                        `%${('00' + c.charCodeAt(0).toString(16)).slice(-2)}`,
                )
                .join(''),
        )

        const { exp } = JSON.parse(jsonPayload)
        const currentTime = Math.floor(Date.now() / 1000)
        return !exp || currentTime > exp - 60 // Expired nếu còn <60s
    } catch (e) {
        console.error('Lỗi khi kiểm tra token:', e)
        return true
    }
}

// 🟢 Tự động refresh token nếu gần hết hạn
export const proactiveTokenRefresh = async (): Promise<string | null> => {
    const access_token: string | null =
        useAuthStore.getState().user?.access_token ?? null

    if (access_token && isTokenExpired(access_token)) {
        console.log('Token sắp hết hạn, đang làm mới...')
        return await refresh_token()
    }

    return access_token
}

export default axiosInstance
