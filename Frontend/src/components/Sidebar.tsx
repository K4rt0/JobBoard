import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styled from 'styled-components'

// Styled Components với cải tiến
const SidebarContainer = styled.div<{ collapsed: boolean; show: boolean }>`
  width: ${({ collapsed }) => (collapsed ? '70px' : '280px')};
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  background: linear-gradient(180deg, #f8fafc 0%, #e9ecef 100%);
  color: #1f2937;
  transition: all 0.3s ease-in-out;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.05);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  font-family: 'Inter', sans-serif;
  overflow-x: hidden;

  @media (max-width: 768px) {
    width: 280px;
    transform: translateX(${({ show }) => (show ? '0' : '-100%')});
    transition:
      transform 0.3s ease-in-out,
      width 0s;
  }
`

// Cải tiến UserProfile để cân bằng không gian khi thu gọn
const UserProfile = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ collapsed }) => (collapsed ? '15px 8px' : '15px')};
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  justify-content: ${({ collapsed }) =>
    collapsed ? 'space-between' : 'space-between'};
  transition: padding 0.3s ease;
`

// Cải tiến để đảm bảo avatar và thông tin hiển thị đẹp hơn
const UserImgContainer = styled.div<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  width: ${({ collapsed }) => (collapsed ? 'auto' : 'auto')};
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
`

const UserImg = styled.div`
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 50%;
  overflow: hidden;
  background: #2042e3;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-size: 16px;
  transition: transform 0.2s ease;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);

  &:hover {
    transform: scale(1.05);
  }

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`

const UserInfo = styled.div`
  margin-left: 12px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 160px;

  h6 {
    margin: 0;
    font-size: 15px;
    font-weight: 600;
    color: #1f2937;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  p {
    margin: 0;
    font-size: 12px;
    color: #6b7280;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`

// Nút chuyển đổi được cải tiến để không bị che khuất
const ToggleButton = styled.button<{ collapsed: boolean }>`
  background: none;
  border: none;
  color: #2042e3;
  font-size: 18px;
  cursor: pointer;
  transition:
    transform 0.2s ease,
    color 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 4px;
  margin-left: ${({ collapsed }) => (collapsed ? '0' : '5px')};

  &:hover {
    color: #1a33b9;
    transform: scale(1.1);
    background-color: rgba(32, 66, 227, 0.05);
  }

  &:focus {
    outline: none;
  }
`

const MenuCategory = styled.h6<{ collapsed: boolean }>`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: #2042e3;
  padding: ${({ collapsed }) => (collapsed ? '15px 0 5px' : '15px 20px 5px')};
  margin: 0;
  font-weight: 600;
  text-align: ${({ collapsed }) => (collapsed ? 'center' : 'left')};
  white-space: nowrap;
  overflow: hidden;
  opacity: ${({ collapsed }) => (collapsed ? '0' : '1')};
  height: ${({ collapsed }) => (collapsed ? '5px' : 'auto')};
  transition:
    opacity 0.2s ease,
    height 0.2s ease,
    padding 0.2s ease;
`

const SidebarMenu = styled.div`
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
  padding: 10px 0;
  scrollbar-width: thin;
  scrollbar-color: #2042e3 transparent;

  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: transparent;
  }

  &::-webkit-scrollbar-thumb {
    background: #2042e3;
    border-radius: 10px;
  }
`

const NavList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0 0 15px 0;
`

const NavItem = styled.li<{ collapsed: boolean }>`
  margin: ${({ collapsed }) => (collapsed ? '10px 5px' : '5px 10px')};
  position: relative;
  transition: margin 0.3s ease;
`

const NavLinkStyled = styled(Link)<{ active: boolean; collapsed: boolean }>`
  display: flex;
  align-items: center;
  padding: ${({ collapsed }) => (collapsed ? '10px 0' : '10px 15px')};
  border-radius: 6px;
  text-decoration: none;
  color: #1f2937;
  transition: all 0.2s ease;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  position: relative;

  &:hover {
    background: rgba(32, 66, 227, 0.1);
    color: #2042e3;
  }

  ${({ active }) =>
    active &&
    `
    background: #2042e3;
    color: #ffffff;
    font-weight: 500;
  `}

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    width: 4px;
    height: 100%;
    background: #2042e3;
    opacity: ${({ active }) => (active ? '1' : '0')};
    transition: opacity 0.2s ease;
    border-top-right-radius: 3px;
    border-bottom-right-radius: 3px;
  }

  &:hover::before {
    opacity: ${({ active }) => (active ? '1' : '0.5')};
  }
`

const NavIcon = styled.i<{ collapsed: boolean }>`
  font-size: 18px;
  min-width: 25px;
  margin-right: ${({ collapsed }) => (collapsed ? '0' : '12px')};
  transition: color 0.2s ease;
  text-align: center;

  ${NavLinkStyled}:hover & {
    color: #2042e3;
  }

  ${NavLinkStyled}[active="true"] & {
    color: #ffffff;
  }
`

const NavLabel = styled.span`
  font-size: 14px;
  font-weight: 400;
  white-space: nowrap;
  transition: opacity 0.2s ease;
`

const NavBadge = styled.span<{ danger?: boolean }>`
  margin-left: auto;
  padding: 2px 8px;
  border-radius: 12px;
  background: ${({ danger }) => (danger ? '#e74c3c' : '#2042e3')};
  color: #ffffff;
  font-size: 10px;
  font-weight: 500;
  transition: all 0.2s ease;
`

const Tooltip = styled.span<{ show: boolean }>`
  visibility: ${({ show }) => (show ? 'visible' : 'hidden')};
  background: #081828;
  color: #ffffff;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 4px;
  position: absolute;
  left: 70px;
  top: 50%;
  transform: translateY(-50%);
  white-space: nowrap;
  z-index: 100;
  opacity: ${({ show }) => (show ? '1' : '0')};
  transition:
    opacity 0.2s ease,
    visibility 0.2s ease;
  pointer-events: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);

  &::after {
    content: '';
    position: absolute;
    top: 50%;
    right: 100%;
    margin-top: -5px;
    border-width: 5px;
    border-style: solid;
    border-color: transparent #081828 transparent transparent;
  }
`

const SidebarFooter = styled.div<{ collapsed: boolean }>`
  padding: ${({ collapsed }) => (collapsed ? '15px 5px' : '15px')};
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  transition: padding 0.3s ease;
`

const LogoutButton = styled(Link)<{ collapsed: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ collapsed }) => (collapsed ? 'center' : 'flex-start')};
  background: #2042e3;
  color: #ffffff;
  padding: ${({ collapsed }) => (collapsed ? '10px' : '10px 15px')};
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s ease;
  position: relative;

  &:hover {
    background: #1a33b9;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(32, 66, 227, 0.2);
  }

  i {
    font-size: 18px;
    margin-right: ${({ collapsed }) => (collapsed ? '0' : '10px')};
  }

  span {
    white-space: nowrap;
    transition: opacity 0.2s ease;
  }
`

const MobileToggleButton = styled.button`
  display: none;
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 1100;
  background: #2042e3;
  color: #ffffff;
  border: none;
  border-radius: 6px;
  padding: 8px 12px;
  cursor: pointer;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;

  &:hover {
    background: #1a33b9;
    transform: scale(1.05);
  }

  &:focus {
    outline: none;
  }

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }
`

const SidebarOverlay = styled.div<{ show: boolean }>`
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
  transition: opacity 0.3s ease;
  opacity: ${({ show }) => (show ? '1' : '0')};

  @media (max-width: 768px) {
    display: ${({ show }) => (show ? 'block' : 'none')};
  }
`

// Interface definitions
interface SidebarItem {
  to: string
  icon: string
  label: string
  badge?: string | number
  danger?: boolean
}

interface SidebarProps {
  isAdmin?: boolean
}

// Main Component
const Sidebar: React.FC<SidebarProps> = ({ isAdmin = true }) => {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)
  const [showMobile, setShowMobile] = useState(false)
  const [hoveredItem, setHoveredItem] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if screen is mobile size
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
      if (window.innerWidth <= 768) {
        setCollapsed(false)
      }
    }

    // Initial check
    checkMobile()

    // Add listener
    window.addEventListener('resize', checkMobile)

    // Clean up
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const toggleSidebar = () => setCollapsed(!collapsed)
  const toggleMobile = () => setShowMobile(!showMobile)

  // Close mobile sidebar when clicking a link on mobile
  const handleNavClick = () => {
    if (isMobile && showMobile) {
      setShowMobile(false)
    }
  }

  const menuItems: SidebarItem[] = isAdmin
    ? [
        {
          to: '/admin/dashboard',
          icon: 'lni lni-dashboard',
          label: 'Dashboard',
        },
        {
          to: '/admin/add-skill',
          icon: 'lni lni-plus',
          label: 'Add Skill',
        },
        {
          to: '/admin/add-job',
          icon: 'lni lni-plus',
          label: 'Add Job',
        },
        {
          to: '/admin/manager-users',
          icon: 'lni lni-users',
          label: 'User Management',
        },

        { to: '/admin/settings', icon: 'lni lni-cog', label: 'Settings' },
      ]
    : [
        { to: '/', icon: 'lni lni-home', label: 'Home' },
        {
          to: '/jobs',
          icon: 'lni lni-briefcase',
          label: 'Find Jobs',
          badge: 24,
        },
        { to: '/companies', icon: 'lni lni-apartment', label: 'Companies' },
        { to: '/profile', icon: 'lni lni-user', label: 'Profile' },
        { to: '/saved-jobs', icon: 'lni lni-heart', label: 'Saved Jobs' },
        { to: '/contact', icon: 'lni lni-envelope', label: 'Contact Us' },
      ]

  const featuresItems: SidebarItem[] = [
    { to: '/resume-builder', icon: 'lni lni-files', label: 'Resume Builder' },
    {
      to: '/job-alerts',
      icon: 'lni lni-alarm',
      label: 'Job Alerts',
      badge: 'New',
      danger: true,
    },
  ]

  return (
    <>
      <MobileToggleButton onClick={toggleMobile}>
        <i className={`lni ${showMobile ? 'lni-close' : 'lni-menu'}`} />
      </MobileToggleButton>

      <SidebarOverlay show={showMobile} onClick={toggleMobile} />

      <SidebarContainer collapsed={collapsed} show={showMobile}>
        <UserProfile collapsed={collapsed}>
          <UserImgContainer collapsed={collapsed}>
            <UserImg>
              <img src="/assets/images/admin-avatar.png" alt="User" />
            </UserImg>
            {!collapsed && (
              <UserInfo>
                <h6>{isAdmin ? 'Admin User' : 'John Doe'}</h6>
                <p>{isAdmin ? 'Administrator' : 'Job Seeker'}</p>
              </UserInfo>
            )}
          </UserImgContainer>
          {!isMobile && (
            <ToggleButton
              collapsed={collapsed}
              onClick={toggleSidebar}
              aria-label="Toggle sidebar"
            >
              <i
                className={`lni ${collapsed ? 'lni-menu' : 'lni-chevron-left'}`}
              />
            </ToggleButton>
          )}
        </UserProfile>

        <SidebarMenu>
          <MenuCategory collapsed={collapsed}>
            {isAdmin ? 'Admin Menu' : 'Main Menu'}
          </MenuCategory>
          <NavList>
            {menuItems.map((item) => (
              <NavItem
                key={item.to}
                collapsed={collapsed}
                onMouseEnter={() => setHoveredItem(item.to)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <NavLinkStyled
                  to={item.to}
                  active={location.pathname === item.to}
                  collapsed={collapsed}
                  onClick={handleNavClick}
                >
                  <NavIcon className={item.icon} collapsed={collapsed} />
                  {!collapsed && (
                    <>
                      <NavLabel>{item.label}</NavLabel>
                      {item.badge && (
                        <NavBadge danger={item.danger}>{item.badge}</NavBadge>
                      )}
                    </>
                  )}
                </NavLinkStyled>
                {collapsed && (
                  <Tooltip show={hoveredItem === item.to}>
                    {item.label}
                    {item.badge && ` (${item.badge})`}
                  </Tooltip>
                )}
              </NavItem>
            ))}
          </NavList>

          {!isAdmin && (
            <>
              <MenuCategory collapsed={collapsed}>Quick Features</MenuCategory>
              <NavList>
                {featuresItems.map((item) => (
                  <NavItem
                    key={item.to}
                    collapsed={collapsed}
                    onMouseEnter={() => setHoveredItem(item.to)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <NavLinkStyled
                      to={item.to}
                      active={location.pathname === item.to}
                      collapsed={collapsed}
                      onClick={handleNavClick}
                    >
                      <NavIcon className={item.icon} collapsed={collapsed} />
                      {!collapsed && (
                        <>
                          <NavLabel>{item.label}</NavLabel>
                          {item.badge && (
                            <NavBadge danger={item.danger}>
                              {item.badge}
                            </NavBadge>
                          )}
                        </>
                      )}
                    </NavLinkStyled>
                    {collapsed && (
                      <Tooltip show={hoveredItem === item.to}>
                        {item.label}
                        {item.badge && ` (${item.badge})`}
                      </Tooltip>
                    )}
                  </NavItem>
                ))}
              </NavList>
            </>
          )}
        </SidebarMenu>

        <SidebarFooter collapsed={collapsed}>
          <LogoutButton
            to={isAdmin ? '/admin/logout' : '/logout'}
            collapsed={collapsed}
            onMouseEnter={() => setHoveredItem('logout')}
            onMouseLeave={() => setHoveredItem(null)}
            onClick={handleNavClick}
          >
            <i className="lni lni-power-switch" />
            {!collapsed && <span>Logout</span>}
            {collapsed && (
              <Tooltip show={hoveredItem === 'logout'}>Logout</Tooltip>
            )}
          </LogoutButton>
        </SidebarFooter>
      </SidebarContainer>
    </>
  )
}

export default Sidebar
