import React from 'react'

type MenuItem = {
    label: string
    link: string
    icon: string
    active?: boolean
    notification?: number
}

type DashboardSidebarProps = {
    menuItems: MenuItem[]
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ menuItems }) => {
    return (
        <div className="dashbord-sidebar">
            <ul>
                <li className="heading">Manage Account</li>
                {menuItems.map((item, index) => (
                    <li key={index}>
                        <a
                            href={item.link}
                            className={item.active ? 'active' : ''}
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
