import { useAuthStore } from '@/store/authStore'

export const useAuth = () => {
    const { user, loginAdmin, login, register, logout, loginWithGoogle } =
        useAuthStore()

    return { user, loginAdmin, login, register, logout, loginWithGoogle }
}
