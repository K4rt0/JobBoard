import React, { useState, useEffect } from 'react'
import { Navigate, Outlet } from 'react-router-dom'

// Khai báo kiểu dữ liệu cho isAuthenticated
const ProtectedRoute = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
    const token = localStorage.getItem('access-token')

    useEffect(() => {
        const checkAuth = () => {
            if (!token) {
                setIsAuthenticated(false) // Đặt false nếu không có token
                return
            }
            // Giả định giải mã token để kiểm tra thời hạn (nếu có exp)
            try {
                const base64Url = token.split('.')[1]
                const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
                const jsonPayload = decodeURIComponent(
                    atob(base64)
                        .split('')
                        .map(
                            (c) =>
                                '%' +
                                ('00' + c.charCodeAt(0).toString(16)).slice(-2),
                        )
                        .join(''),
                )
                const decoded = JSON.parse(jsonPayload)
                const isExpired = decoded.exp
                    ? decoded.exp * 1000 < Date.now()
                    : false
                if (isExpired) {
                    localStorage.removeItem('access-token') // Xóa token hết hạn
                    setIsAuthenticated(false) // Đặt false nếu token hết hạn
                } else {
                    setIsAuthenticated(true) // Đặt true nếu token hợp lệ
                }
            } catch (e) {
                setIsAuthenticated(false) // Đặt false nếu lỗi giải mã
            }
        }
        checkAuth()
    }, [token])

    if (isAuthenticated === null) return <div>Loading...</div> // Tránh flicker
    if (!isAuthenticated) {
        return <Navigate to="/admin/login" replace />
    }
    return <Outlet />
}

export default ProtectedRoute
