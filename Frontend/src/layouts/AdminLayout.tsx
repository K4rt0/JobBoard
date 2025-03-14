// src/admin/layouts/AdminLayout.tsx
import React from 'react'
import { Outlet } from 'react-router-dom'
import AdminSidebar from '../components/Sidebar' // Giả định AdminSidebar là Sidebar

const AdminLayout: React.FC = () => {
    return (
        <div
            className="admin-layout"
            style={{ display: 'flex', minHeight: '100vh' }}
        >
            <AdminSidebar isAdmin={true} /> {/* Truyền isAdmin={true} */}
            <div
                className="admin-content"
                style={{ flex: 1, padding: '20px', background: '#fff' }}
            >
                <Outlet /> {/* Nơi render các trang admin */}
            </div>
        </div>
    )
}

export default AdminLayout
