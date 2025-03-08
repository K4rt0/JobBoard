import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'

const AppRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route element={<MainLayout />}>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/job/:jobId" element={<JobDetailPage />} />
                </Route>
            </Routes>
        </Router>
    )
}

export default AppRoutes
