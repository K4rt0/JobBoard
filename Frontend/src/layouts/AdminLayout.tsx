import React, { useState, useRef, useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import AdminSidebar from '../components/Sidebar'
import styled from 'styled-components'

// Styled Components
const Layout = styled.div`
    display: flex;
    min-height: 100vh;
`

const Sidebar = styled.div`
    /* Sidebar styles inherited from AdminSidebar */
`

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    background: #f9fafb;
`

const Header = styled.header`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 24px;
    background-color: #ffffff;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    height: 64px;
    z-index: 10;
`

const HeaderTitle = styled.div`
    font-size: 18px;
    font-weight: 600;
    color: #1a202c;
`

const UserMenuContainer = styled.div`
    position: relative;
`

const UserButton = styled.button`
    display: flex;
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 8px;
    transition: all 0.2s ease;

    &:hover {
        background-color: #f1f5f9;
    }
`

const UserAvatar = styled.div`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background-color: #4f6ef7;
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 10px;
`

const UserName = styled.div`
    font-size: 14px;
    font-weight: 500;
    margin-right: 8px;
    color: #4b5563;
`

const ArrowIcon = styled.div<{ $isOpen: boolean }>`
    transition: transform 0.2s ease;
    transform: ${(props) => (props.$isOpen ? 'rotate(180deg)' : 'rotate(0)')};
    color: #6b7280;
`

const DropdownMenu = styled.div<{ $isOpen: boolean }>`
    position: absolute;
    top: calc(100% + 8px);
    right: 0;
    background: white;
    border-radius: 8px;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    width: 150px; /* Giảm chiều rộng vì chỉ có 1 mục */
    overflow: hidden;
    opacity: ${(props) => (props.$isOpen ? '1' : '0')};
    visibility: ${(props) => (props.$isOpen ? 'visible' : 'hidden')};
    transform: ${(props) =>
        props.$isOpen ? 'translateY(0)' : 'translateY(-10px)'};
    transition: all 0.2s ease;
    z-index: 100;
`

const MenuItem = styled.button`
    display: flex;
    align-items: center;
    width: 100%;
    padding: 12px 16px;
    background: none;
    border: none;
    cursor: pointer;
    text-align: left;
    color: #ef4444; /* Màu đỏ cho logout */
    font-size: 14px;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #fef2f2;
    }
`

const MenuItemIcon = styled.span`
    margin-right: 12px;
    display: flex;
    align-items: center;
`

const MainContent = styled.main`
    padding: 24px;
    flex: 1;
    overflow-y: auto;
`

// SVG Icons
const ChevronDownIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
)

const LogoutIcon = () => (
    <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
)

const AdminLayout: React.FC = () => {
    const navigate = useNavigate()
    const [isMenuOpen, setIsMenuOpen] = useState(false)
    const menuRef = useRef<HTMLDivElement>(null)

    // Mock admin data - chỉ giữ thông tin cơ bản
    const adminUser = {
        name: 'Admin User',
        initials: 'AU', // First letters of first and last name
    }

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                menuRef.current &&
                !menuRef.current.contains(event.target as Node)
            ) {
                setIsMenuOpen(false)
            }
        }

        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleLogout = () => {
        localStorage.removeItem('access-token')
        navigate('/admin/login')
        setIsMenuOpen(false) // Đóng menu sau khi logout
    }

    return (
        <Layout>
            <Sidebar>
                <AdminSidebar isAdmin={true} />
            </Sidebar>
            <Content>
                <Header>
                    <HeaderTitle>Admin Dashboard</HeaderTitle>
                    <UserMenuContainer ref={menuRef}>
                        <UserButton onClick={() => setIsMenuOpen(!isMenuOpen)}>
                            <UserAvatar>{adminUser.initials}</UserAvatar>
                            <UserName>{adminUser.name}</UserName>
                            <ArrowIcon $isOpen={isMenuOpen}>
                                <ChevronDownIcon />
                            </ArrowIcon>
                        </UserButton>

                        <DropdownMenu $isOpen={isMenuOpen}>
                            <MenuItem onClick={handleLogout}>
                                <MenuItemIcon>
                                    <LogoutIcon />
                                </MenuItemIcon>
                                Logout
                            </MenuItem>
                        </DropdownMenu>
                    </UserMenuContainer>
                </Header>

                <MainContent>
                    <Outlet />
                </MainContent>
            </Content>
        </Layout>
    )
}

export default AdminLayout
