import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import LoginModal from './modals/LoginModal'
import SignupModal from './modals/SignUpModal'
import { useAuthStore } from '@/store/authStore'

// Styled-components
const UserMenu = styled.div`
    position: relative;
    display: inline-block;
`

const UserInfoWrapper = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
`

const Avatar = styled.img`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    margin-right: 8px;
`

const AvatarFallback = styled.span`
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: #6c757d;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 8px;
`

const UserDetails = styled.div`
    display: flex;
    flex-direction: column;
`

const FullName = styled.span`
    font-size: 14px;
    color: #333;
    font-weight: 500;
    max-width: 150px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const Role = styled.span`
    font-size: 12px;
    color: #dc3545;
    line-height: 1.2;
`

const UserDropdown = styled.div`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background-color: #ffffff;
    border-radius: 8px;
    border: none;
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
    max-width: 180px;
    padding: 12px 0;
    display: none;
    z-index: 1000;
    opacity: 0;
    transform: translateY(-10px);
    transition:
        opacity 0.2s ease-in-out,
        transform 0.2s ease-in-out;

    ${UserMenu}:hover & {
        display: block;
        opacity: 1;
        transform: translateY(0);
    }

    &::before {
        content: '';
        position: absolute;
        top: -6px;
        right: 12px;
        width: 12px;
        height: 12px;
        background-color: #ffffff;
        box-shadow: -2px -2px 4px rgba(0, 0, 0, 0.1);
        transform: rotate(45deg);
        z-index: -1;
    }
`

const Email = styled.p`
    font-size: 14px;
    color: #555;
    margin: 0 16px 8px 16px;
    padding-bottom: 8px;
    border-bottom: 1px solid #eee;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;

    i {
        margin-right: 8px;
        font-size: 16px;
        color: #666;
    }
`

const DropdownItem = styled.a`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    font-size: 14px;
    color: #333;
    text-decoration: none;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f5f7fa;
        color: #007bff;
    }

    i {
        margin-right: 8px;
        font-size: 16px;
        color: #666;
    }
`

const LogoutButton = styled.button`
    display: flex;
    align-items: center;
    padding: 10px 16px;
    font-size: 14px;
    color: #dc3545;
    background: none;
    border: none;
    width: 100%;
    text-align: left;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #f8ebeb;
        color: #dc3545;
    }

    i {
        margin-right: 8px;
        font-size: 16px;
        color: #dc3545;
    }
`

const Header = () => {
    const { user, logout } = useAuthStore()
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false)
    const [currentPath, setCurrentPath] = useState<string>('')

    useEffect(() => {
        // Lấy đường dẫn hiện tại khi component mount
        setCurrentPath(window.location.pathname)

        // Cập nhật currentPath khi người dùng chuyển trang (dùng event popstate)
        const handlePathChange = () => {
            setCurrentPath(window.location.pathname)
        }
        window.addEventListener('popstate', handlePathChange)

        // Cleanup listener
        return () => window.removeEventListener('popstate', handlePathChange)
    }, [])

    useEffect(() => {
        if (user) {
            setIsLoggedIn(true)
        } else {
            setIsLoggedIn(false)
        }
    }, [user])

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
                                            <li
                                                className={`nav-item ${currentPath === '/' ? 'active' : ''}`}
                                            >
                                                <a
                                                    href="/"
                                                    className={
                                                        currentPath === '/'
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    Home
                                                </a>
                                            </li>
                                            <li
                                                className={`nav-item ${
                                                    currentPath ===
                                                        '/freelancer-marketplace' ||
                                                    currentPath === '/post-job'
                                                        ? 'active'
                                                        : ''
                                                }`}
                                            >
                                                <a
                                                    className={
                                                        currentPath ===
                                                            '/freelancer-marketplace' ||
                                                        currentPath ===
                                                            '/post-job'
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    Hire Freelancers
                                                </a>
                                                <ul className="sub-menu">
                                                    <li
                                                        className={
                                                            currentPath ===
                                                            '/freelancer-marketplace'
                                                                ? 'active'
                                                                : ''
                                                        }
                                                    >
                                                        <a
                                                            href="/freelancer-marketplace"
                                                            className={
                                                                currentPath ===
                                                                '/freelancer-marketplace'
                                                                    ? 'active'
                                                                    : ''
                                                            }
                                                        >
                                                            Find Freelancers
                                                        </a>
                                                    </li>
                                                    <li
                                                        className={
                                                            currentPath ===
                                                            '/post-job'
                                                                ? 'active'
                                                                : ''
                                                        }
                                                    >
                                                        <a
                                                            href="/post-job"
                                                            className={
                                                                currentPath ===
                                                                '/post-job'
                                                                    ? 'active'
                                                                    : ''
                                                            }
                                                        >
                                                            Post a Job
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={`nav-item ${currentPath === '/jobs' ? 'active' : ''}`}
                                            >
                                                <a
                                                    className={
                                                        currentPath === '/jobs'
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    Find Jobs
                                                </a>
                                                <ul className="sub-menu">
                                                    <li
                                                        className={
                                                            currentPath ===
                                                            '/jobs'
                                                                ? 'active'
                                                                : ''
                                                        }
                                                    >
                                                        <a
                                                            href="/jobs"
                                                            className={
                                                                currentPath ===
                                                                '/jobs'
                                                                    ? 'active'
                                                                    : ''
                                                            }
                                                        >
                                                            Find Jobs
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={`nav-item ${currentPath === '/faq' ? 'active' : ''}`}
                                            >
                                                <a
                                                    href="/faq"
                                                    className={
                                                        currentPath === '/faq'
                                                            ? 'active'
                                                            : ''
                                                    }
                                                >
                                                    FAQ
                                                </a>
                                            </li>
                                        </ul>
                                    </div>

                                    <div className="button">
                                        {isLoggedIn && user ? (
                                            <UserMenu>
                                                <UserInfoWrapper>
                                                    {user.avatar_url ? (
                                                        <Avatar
                                                            src={
                                                                user.avatar_url
                                                            }
                                                            alt="Avatar"
                                                        />
                                                    ) : (
                                                        <AvatarFallback>
                                                            {user.full_name?.charAt(
                                                                0,
                                                            ) || 'U'}
                                                        </AvatarFallback>
                                                    )}
                                                    <UserDetails>
                                                        <FullName>
                                                            {user.full_name ||
                                                                'User'}
                                                        </FullName>
                                                        <Role>
                                                            {user.role ||
                                                                'Member'}
                                                        </Role>
                                                    </UserDetails>
                                                </UserInfoWrapper>
                                                <UserDropdown>
                                                    <Email>
                                                        <i className="lni lni-envelope"></i>
                                                        {user.email ||
                                                            'No email'}
                                                    </Email>
                                                    <DropdownItem href="/profile">
                                                        <i className="lni lni-user"></i>{' '}
                                                        Profile
                                                    </DropdownItem>
                                                    <DropdownItem href="/settings">
                                                        <i className="lni lni-cog"></i>{' '}
                                                        Settings
                                                    </DropdownItem>
                                                    <LogoutButton
                                                        onClick={() => {
                                                            logout()
                                                            setIsLoggedIn(false)
                                                        }}
                                                    >
                                                        <i className="lni lni-exit"></i>{' '}
                                                        Logout
                                                    </LogoutButton>
                                                </UserDropdown>
                                            </UserMenu>
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
