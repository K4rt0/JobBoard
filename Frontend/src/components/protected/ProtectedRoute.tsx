import { useAuthStore } from '@/store/authStore'
import React, { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Utility function to check if a JWT token is expired
const isTokenExpired = (token: string): boolean => {
    try {
        const base64Url = token.split('.')[1]
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map(
                    (c) =>
                        '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2),
                )
                .join(''),
        )
        const decoded = JSON.parse(jsonPayload)
        return decoded.exp ? decoded.exp * 1000 < Date.now() : false
    } catch (e) {
        console.error('Error decoding token:', e)
        return true // Treat as expired if decoding fails
    }
}

const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const { user } = useAuthStore()

    useEffect(() => {
        const checkAuth = () => {
            // If user is null or there’s no access token, user is not authenticated
            if (!user || !user.access_token_admin) {
                setIsAuthenticated(false)
                return
            }

            // Check if the token is expired
            const isExpired = isTokenExpired(user.access_token_admin)
            if (isExpired) {
                localStorage.removeItem('auth-storage') // Remove expired token
                setIsAuthenticated(false)
            } else {
                setIsAuthenticated(true)
            }
        }

        checkAuth()
    }, [user])

    // Show loading state while checking authentication
    if (isAuthenticated === null) {
        return <div>Loading...</div>
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }

    // Render child routes if authenticated
    return <Outlet />
}

export default ProtectedRoute
