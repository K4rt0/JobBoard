import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios, { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axiosInstance from '@/services/axiosInstance'

const API_BASE_URL = 'http://localhost:3000/api/v1'

// Interfaces
interface User {
    _id: string
    full_name: string
    email: string
    role: 'Freelancer' | 'Employer'
    status: 'Active' | 'Deleted' | 'Blocked'
}

// Styled Components
const PageContainer = styled.div`
    margin-left: 280px;
    padding: 30px;
    min-height: 100vh;
    background: #f8fafc;
    background-image: linear-gradient(to bottom right, #f8fafc, #eef2ff);
    font-family: 'Inter', sans-serif;

    @media (max-width: 768px) {
        margin-left: 0;
        padding: 20px;
    }
`

const Header = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
`

const Title = styled.h1`
    font-size: 28px;
    color: #1f2937;
    font-weight: 700;
    position: relative;

    &:after {
        content: '';
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 60px;
        height: 3px;
        background: #2042e3;
        border-radius: 3px;
    }
`

const UsersContainer = styled.div`
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    overflow: hidden;
`

const UserTable = styled.table`
    width: 100%;
    border-collapse: collapse;
`

const TableHead = styled.thead`
    background: #f9fafb;
    border-bottom: 1px solid #e5e7eb;
`

const TableHeader = styled.th`
    padding: 16px 20px;
    text-align: left;
    font-size: 14px;
    font-weight: 600;
    color: #4b5563;
`

const TableBody = styled.tbody``

const TableRow = styled.tr`
    border-bottom: 1px solid #e5e7eb;
    transition: all 0.3s ease;

    &:hover {
        background: #f5f7ff;
    }

    &:last-child {
        border-bottom: none;
    }
`

const TableCell = styled.td`
    padding: 16px 20px;
    font-size: 14px;
    color: #1f2937;
`

const ActionButtons = styled.div`
    display: flex;
    gap: 10px;
    align-items: center;
`

const IconButton = styled.button`
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;

    &:hover {
        color: #2042e3;
        background: #f5f7ff;
    }
`

const RoleBadge = styled.span<{ role: 'Freelancer' | 'Employer' }>`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: ${({ role }) =>
        role === 'Freelancer' ? '#eef2ff' : '#ecfdf5'};
    color: ${({ role }) => (role === 'Freelancer' ? '#2042e3' : '#047857')};
`

const StatusBadge = styled.span<{ status: 'Active' | 'Deleted' | 'Blocked' }>`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: ${({ status }) =>
        status === 'Active'
            ? '#ecfdf5'
            : status === 'Deleted'
              ? '#fee2e2'
              : '#fef3c7'};
    color: ${({ status }) =>
        status === 'Active'
            ? '#047857'
            : status === 'Deleted'
              ? '#ef4444'
              : '#d97706'};
`

const ToggleSwitch = styled.label`
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
`

const ToggleInput = styled.input`
    opacity: 0;
    width: 0;
    height: 0;

    &:checked + .slider {
        background-color: #2042e3;
    }

    &:checked + .slider:before {
        transform: translateX(26px);
    }
`

const ToggleSlider = styled.span`
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.3s;
    border-radius: 24px;

    &:before {
        position: absolute;
        content: '';
        height: 18px;
        width: 18px;
        left: 3px;
        bottom: 3px;
        background-color: white;
        transition: 0.3s;
        border-radius: 50%;
    }
`

const ModalOverlay = styled.div<{ isOpen: boolean }>`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(3px);
    z-index: 1000;
    display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
    align-items: center;
    justify-content: center;
`

const Modal = styled.div`
    background: #ffffff;
    padding: 30px;
    border-radius: 16px;
    width: 450px;
    max-width: 90%;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    z-index: 1001;
`

const ModalHeader = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 25px;
`

const ModalTitle = styled.h2`
    font-size: 20px;
    color: #1f2937;
    font-weight: 600;
    margin: 0;
`

const CloseButton = styled.button`
    background: none;
    border: none;
    font-size: 22px;
    color: #6b7280;
    cursor: pointer;
    transition: color 0.3s ease;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #1a33b9;
        background: #f5f7ff;
    }
`

const InputGroup = styled.div`
    margin-bottom: 25px;
`

const InputLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #4b5563;
`

const Input = styled.input`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: #f9fafb;

    &:focus {
        outline: none;
        border-color: #2042e3;
        box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
        background: #ffffff;
    }
`

const Select = styled.select`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: #f9fafb;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%236B7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 16px center;

    &:focus {
        outline: none;
        border-color: #2042e3;
        box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
        background-color: #ffffff;
    }
`

const ModalActions = styled.div`
    display: flex;
    justify-content: flex-end;
    gap: 12px;
`

const CancelButton = styled.button`
    padding: 12px 20px;
    background: #f3f4f6;
    color: #4b5563;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;

    &:hover {
        background: #e5e7eb;
    }
`

const SaveButton = styled.button`
    padding: 12px 24px;
    background: #2042e3;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(32, 66, 227, 0.15);

    &:hover {
        background: #1a33b9;
        box-shadow: 0 6px 16px rgba(32, 66, 227, 0.25);
    }
`

const EditIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="18"
        height="18"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
        />
    </svg>
)

// Main Component: Trang quản lý người dùng (UserManagement)
const UserManagement: React.FC = () => {
    const [users, setUsers] = useState<User[]>([])
    const [retryCount, setRetryCount] = useState(0)
    const maxRetries = 3

    const fetchUsers = async () => {
        try {
            const response = await axiosInstance.get<{ data: User[] }>(
                `${API_BASE_URL}/user/get-all`,
            )
            setUsers(response.data.data || [])
            setRetryCount(0) // Reset retry count on success
        } catch (error) {
            const axiosError = error as AxiosError
            if (axiosError.response?.status === 401) {
                toast.error('Session expired. Please log in again.')
                window.location.href = '/login'
            } else if (retryCount < maxRetries) {
                setTimeout(() => {
                    setRetryCount(retryCount + 1)
                    fetchUsers()
                }, 1000 * retryCount)
                toast.error(
                    `Failed to fetch users. Retrying (${retryCount + 1}/${maxRetries})...`,
                )
            } else {
                console.error('Error fetching users:', axiosError.message)
                toast.error(
                    'Failed to fetch users. Please try again or check your connection.',
                )
            }
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])

    const handleToggleStatus = async (user: User) => {
        const newStatus = user.status === 'Active' ? 'Blocked' : 'Active'

        try {
            const userData = { status: newStatus }
            await axiosInstance.patch(
                `${API_BASE_URL}/user/${user._id}/status`,
                userData,
            )
            setUsers(
                users.map((u) =>
                    u._id === user._id ? { ...u, status: newStatus } : u,
                ),
            )
            toast.success(
                `User ${newStatus === 'Active' ? 'enabled' : 'disabled'} successfully!`,
            )
        } catch (error) {
            const axiosError = error as AxiosError
            console.error('Error toggling user status:', axiosError.message)
            toast.error(
                `Failed to update user status: ${axiosError.message}. Please try again.`,
            )
        }
    }

    return (
        <PageContainer>
            <ToastContainer />
            <Header>
                <Title>User Management</Title>
            </Header>
            <UsersContainer>
                <UserTable>
                    <TableHead>
                        <tr>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Email</TableHeader>
                            <TableHeader>Role</TableHeader>
                            <TableHeader>Status</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {users.length > 0 ? (
                            users.map((user) => (
                                <TableRow key={user._id}>
                                    <TableCell>{user.full_name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>
                                        <RoleBadge role={user.role}>
                                            {user.role}
                                        </RoleBadge>
                                    </TableCell>
                                    <TableCell>
                                        <StatusBadge status={user.status}>
                                            {user.status}
                                        </StatusBadge>
                                    </TableCell>
                                    <TableCell>
                                        <ActionButtons>
                                            <ToggleSwitch>
                                                <ToggleInput
                                                    type="checkbox"
                                                    checked={
                                                        user.status === 'Active'
                                                    }
                                                    onChange={() =>
                                                        handleToggleStatus(user)
                                                    }
                                                />
                                                <ToggleSlider className="slider" />
                                            </ToggleSwitch>
                                        </ActionButtons>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <tr>
                                <TableCell
                                    colSpan={5}
                                    style={{
                                        textAlign: 'center',
                                        padding: '20px',
                                    }}
                                >
                                    No users found. Please try again or check
                                    your connection.
                                </TableCell>
                            </tr>
                        )}
                    </TableBody>
                </UserTable>
            </UsersContainer>
        </PageContainer>
    )
}

export default UserManagement
