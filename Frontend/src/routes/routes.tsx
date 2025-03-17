import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import AdminLayout from '@/layouts/AdminLayout'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import ErrorPage from '@/pages/ErrorPage'
import ProfilePage from '@/pages/ProfilePage'
import ChangePasswordPage from '@/pages/ChangePasswordPage'
import ManageApplicationPage from '@/pages/ManageApplicationPage'
import FreelancerMarketplacePage from '@/pages/FreelancerMarketplacePage'
import LoginPage from '@/pages/admin-pages/LoginPage'

// Admin Pages
import DashboardPage from '@/pages/admin-pages/DashboardPage'
import AddJobPage from '@/pages/admin-pages/AddJobPage'
import AddSkillPage from '@/pages/admin-pages/AddSkillPage'
import UserManagement from '@/pages/admin-pages/ManagerUserPage'
import PostJobPage from '@/pages/PostJobPage'
import JobSearchPage from '@/pages/JobSearchPage'
import CategoryPage from '@/pages/admin-pages/CategoryPage' // Thêm CategoryPage
import ProtectedRoute from '@/components/protected/ProtectedRoute' // Import ProtectedRoute

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Auth routes - without layout */}
                <Route path="/login" element={<LoginPage />} />
                <Route path="/admin/login" element={<LoginPage />} />
                {/* User routes with MainLayout */}
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/job/:jobId" element={<JobDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route path="/post-job" element={<PostJobPage />} />
                    <Route path="/jobs" element={<JobSearchPage />} />
                    <Route
                        path="/freelancer-marketplace"
                        element={<FreelancerMarketplacePage />}
                    />
                    <Route
                        path="/change-password"
                        element={<ChangePasswordPage />}
                    />
                    <Route
                        path="/manage-applications"
                        element={<ManageApplicationPage />}
                    />
                </Route>
                {/* Admin routes with AdminLayout and ProtectedRoute */}
                <Route element={<AdminLayout />}>
                    <Route element={<ProtectedRoute />}>
                        <Route
                            path="/admin/dashboard"
                            element={<DashboardPage />}
                        />
                        <Route path="/admin/job" element={<AddJobPage />} />
                        <Route path="/admin/skill" element={<AddSkillPage />} />
                        <Route
                            path="/admin/manager-users"
                            element={<UserManagement />}
                        />
                        <Route
                            path="/admin/category"
                            element={<CategoryPage />}
                        />{' '}
                        {/* Thêm route cho CategoryPage */}
                    </Route>
                </Route>
                <Route path="*" element={<ErrorPage />} />{' '}
                {/* Route cho tất cả các path không khớp */}
            </Routes>
        </Router>
    )
}

export default AppRoutes
