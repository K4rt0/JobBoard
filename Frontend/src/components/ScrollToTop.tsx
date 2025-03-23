import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const ScrollToTop = () => {
    const { pathname } = useLocation()

    useEffect(() => {
        // Mỗi khi route đổi → scroll lên top
        window.scrollTo(0, 0)
    }, [pathname])

    return null
}

export default ScrollToTop
