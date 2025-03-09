import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import AdminDashboardPage from '@/pages/AdminDashboardPage'
import AddSkillPage from '@/components/admin-pages/AddSkillPage'
import AddJobPage from '@/components/admin-pages/AddJobPage'
import AdminLayout from '@/layouts/AdminLayout'

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
        </Route>
      </Routes>
    </Router>
  )
}

export default AppRoutes
