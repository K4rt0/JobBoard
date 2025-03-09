import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import ErrorPage from '@/pages/ErrorPage'
import ProfilePage from '@/pages/ProfilePage'
import ChangePasswordPage from '@/pages/ChangePasswordPage'
import ManageApplicationPage from '@/pages/ManageApplicationPage'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/job/:jobId" element={<JobDetailPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                    <Route
                        path="/change-password"
                        element={<ChangePasswordPage />}
                    />
                    <Route
                        path="/manage-applications"
                        element={<ManageApplicationPage />}
                    />
                </Route>
                <Route path="*" element={<ErrorPage />} />
            </Routes>
        </Router>
    )
}

export default AppRoutes
