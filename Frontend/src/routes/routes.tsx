import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AddSkillPage from '@/pages/admin-pages/AddSkillPage'
import AddJobPage from '@/pages/admin-pages/AddJobPage'
import AdminLayout from '@/layouts/AdminLayout'
import UserManagement from '@/pages/admin-pages/ManagerUserPage'

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/job/:jobId" element={<JobDetailPage />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="add-skill" element={<AddSkillPage />} />
          <Route path="add-job" element={<AddJobPage />} />
          <Route path="manager-users" element={<UserManagement />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
