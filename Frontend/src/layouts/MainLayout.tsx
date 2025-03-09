import { Outlet } from 'react-router-dom'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Header from '@/components/Header'

const MainLayout = () => {
  return (
    <div>
      <div id="loading-area"></div>
      <Header />
      <main className="pt-5">
        <Outlet /> {/* Đây là nơi render các trang con */}
      </main>
      <Footer />
      <a href="#" className="scroll-top btn-hover">
        <i className="lni lni-chevron-up"></i>
      </a>
    </div>
  )
}

export default MainLayout
