import React, { useState, useEffect } from 'react'
import LoginModal from './modals/LoginModal'
import SignupModal from './modals/SignUpModal'
import { useAuth } from '@/hooks/useAuth'

const Header = () => {
    const { user, logout } = useAuth()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
        }
    }, [user])

    // Hàm xử lý đăng nhập thành công
    const handleLoginSuccess = () => {
        setIsLoggedIn(true)
    }
    const handleRegisterSuccess = () => {
        setIsLoggedIn(true)
    }

    return (
        <>
            <header className="header" style={{ zIndex: '1000' }}>
                <div className="navbar-area">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <nav className="navbar navbar-expand-lg">
                                    <a className="navbar-brand logo" href="/">
                                        <img
                                            className="logo1"
                                            src="/assets/images/logo/logo.svg"
                                            alt="Logo"
                                        />
                                    </a>
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#navbarSupportedContent"
                                    >
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                    </button>
                                    <div
                                        className="collapse navbar-collapse sub-menu-bar"
                                        id="navbarSupportedContent"
                                    >
                                        <ul
                                            id="nav"
                                            className="navbar-nav ml-auto"
                                        >
                                            <li className="nav-item">
                                                <a href="/" className="active">
                                                    Home
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a>Hire Freelancers</a>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <a href="/freelancer-marketplace">
                                                            Find Freelancers
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/post-job">
                                                            Post a Job
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="nav-item">
                                                <a>Find Jobs</a>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <a href="/jobs">
                                                            Find Jobs
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>

                                    {/* Hiển thị user nếu đã đăng nhập */}
                                    <div className="button">
                                        {isLoggedIn ? (
                                            <div className="user-info">
                                                <span>
                                                    Welcome, {user?.id}!
                                                </span>
                                                <button
                                                    className="btn btn-danger ml-3"
                                                    onClick={() => {
                                                        logout()
                                                        setIsLoggedIn(false)
                                                    }}
                                                >
                                                    Logout
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <a
                                                    href="javascript:"
                                                    data-toggle="modal"
                                                    data-target="#login"
                                                    className="login"
                                                >
                                                    <i className="lni lni-lock-alt"></i>{' '}
                                                    Login
                                                </a>
                                                <a
                                                    href="javascript:"
                                                    data-toggle="modal"
                                                    data-target="#signup"
                                                    className="btn"
                                                >
                                                    Sign Up
                                                </a>
                                            </>
                                        )}
                                    </div>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </header>
            <LoginModal onLoginSuccess={handleLoginSuccess} />
            <SignupModal onSignupSuccess={handleRegisterSuccess} />
        </>
    )
}

export default Header
