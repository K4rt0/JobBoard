import './locales/i18n' // Initialize i18n (assuming this sets up i18next)
import AppRoutes from './routes/routes'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css' // Import toast styles
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next' // If you want to use i18n hooks

const App = () => {
    const { i18n } = useTranslation() // Optional: For dynamic language handling

    // Optional: Load default language or handle language changes
    useEffect(() => {
        // Example: Set default language if not already set
        if (!i18n.language) {
            i18n.changeLanguage('en') // Default to English, adjust as needed
        }
    }, [i18n])

    return (
        <>
            <AppRoutes />
            <ToastContainer
                position="top-right"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
        </>
    )
}

export default App
