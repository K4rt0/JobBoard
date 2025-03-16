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

// Admin Pages
import DashboardPage from '@/pages/admin-pages/DashboardPage'
import AddJobPage from '@/pages/admin-pages/AddJobPage'
import AddSkillPage from '@/pages/admin-pages/AddSkillPage'
import UserManagement from '@/pages/admin-pages/ManagerUserPage'
import PostJobPage from '@/pages/PostJobPage'
import JobSearchPage from '@/pages/JobSearchPage'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
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

                {/* Admin routes with AdminLayout */}
                <Route element={<AdminLayout />}>
                    <Route
                        path="/admin/dashboard"
                        element={<DashboardPage />}
                    />
                    <Route path="/admin/add-job" element={<AddJobPage />} />
                    <Route path="/admin/add-skill" element={<AddSkillPage />} />
                    <Route
                        path="/admin/manager-users"
                        element={<UserManagement />}
                    />
                </Route>

                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
