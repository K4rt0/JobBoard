import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const MainLayout = () => {
    return (
        <div>
            <Navbar />
            <main>
                <Outlet /> {/* Đây là nơi render các trang con */}
            </main>
            <Footer />
        </div>
    )
}

export default MainLayout
