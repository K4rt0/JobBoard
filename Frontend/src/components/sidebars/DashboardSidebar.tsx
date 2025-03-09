import React from 'react'
import { useLocation } from 'react-router-dom'

type MenuItem = {
    label: string
    link: string
    icon: string
    notification?: number
}

type DashboardSidebarProps = {
    menuItems: MenuItem[]
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ menuItems }) => {
    const location = useLocation()
    console.log(location.pathname)

    return (
        <div className="dashbord-sidebar">
            <ul>
                <li className="heading">Manage Account</li>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <a
                            href={item.link}
                            className={
                                location.pathname === `/${item.link}`
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
                ))}
            </ul>
        </div>
    )
}

export default DashboardSidebar
