import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import MainLayout from '@/layouts/MainLayout'
import HomePage from '@/pages/HomePage'
import JobDetailPage from '@/pages/JobDetailPage'
import AdminLayout from '@/layouts/AdminLayout'
import AdminDashboard from '@/pages/AdminDashboardPage'
import AddSkillPage from '@/components/admin-pages/AddSkillPage' // Sửa lại tên file
import AddJobPage from '@/components/admin-pages/AddJobPage' // Thêm import

const router = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
      },
      {
        path: '/job/:jobId',
        element: <JobDetailPage />,
      },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        path: 'dashboard',
        element: <AdminDashboard />,
      },
      {
        path: 'add-skill', // Route cho Add Skill
        element: <AddSkillPage />,
      },
      // Có thể thêm các route admin khác nếu cần
      {
        path: 'add-job',
        element: <AddJobPage />,
      },
      // {
      //     path: 'jobs',
      //     element: <AdminJobs />,
      // },
    ],
  },
])

const AppRoutes: React.FC = () => {
  return <RouterProvider router={router} />
}

export default AppRoutes
