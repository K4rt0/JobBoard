// components/sidebars/DashboardSidebar.tsx
import React from 'react'
import { useLocation } from 'react-router-dom'

type MenuItem = {
    label: string
    link: string
    icon: string
    notification?: number
}

type DashboardSidebarProps = {
    role: string | undefined // Cho phép null
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ role }) => {
    const location = useLocation()

    // Danh sách menu cố định cho Freelancer
    const freelancerMenuItems: MenuItem[] = [
        {
            label: 'My Profile',
            link: '/profile',
            icon: 'lni lni-clipboard',
        },
        {
            label: 'Bookmarked Jobs',
            link: '/profile/bookmarked',
            icon: 'lni lni-bookmark',
        },
        {
            label: 'Manage Applications',
            link: '/profile/manage-applications',
            icon: 'lni lni-envelope',
        },
        {
            label: 'Change Password',
            link: '/profile/change-password',
            icon: 'lni lni-lock',
        },
    ]

    // Danh sách menu cố định cho Employer
    const employerMenuItems: MenuItem[] = [
        {
            label: 'My Profile',
            link: '/profile',
            icon: 'lni lni-clipboard',
        },
        {
            label: 'Manage Jobs',
            link: '/profile/manage-jobs',
            icon: 'lni lni-briefcase',
        },
        {
            label: 'Manage Applications',
            link: '/manage/applications',
            icon: 'lni lni-envelope',
        },
        {
            label: 'Change Password',
            link: '/profile/change-password',
            icon: 'lni lni-lock',
        },
    ]

    // Xử lý trường hợp role là null
    const roleToLower = role?.toLocaleLowerCase()
    const menuItems =
        roleToLower === 'employer'
            ? employerMenuItems
            : roleToLower === 'freelancer'
              ? freelancerMenuItems
              : []

    return (
        <div className="dashbord-sidebar">
            <ul>
                <li className="heading">
                    {roleToLower === 'employer'
                        ? 'Employer Dashboard'
                        : roleToLower === 'freelancer'
                          ? 'Freelancer Dashboard'
                          : 'Dashboard'}
                </li>
                {menuItems.length > 0 ? (
                    menuItems.map((item, index) => (
                        <li key={index}>
                            <a
                                href={item.link}
                                className={
                                    location.pathname === item.link
                                        ? 'active'
                                        : ''
                                }
                            >
                                <i className={item.icon}></i> {item.label}
                                {item.notification && (
                                    <span className="notifi">
                                        {item.notification}
                                    </span>
                                )}
                            </a>
                        </li>
                    ))
                ) : (
                    <li className="text-muted text-center py-3">
                        Vui lòng đăng nhập để xem menu
                    </li>
                )}
            </ul>
        </div>
    )
}

export default DashboardSidebar
