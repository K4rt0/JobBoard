import React, { useState } from 'react'
import styled from 'styled-components'

// Styled Components (CSS-in-JS để định dạng giao diện)
const PageContainer = styled.div`
    margin-left: 280px; // Để tránh bị che bởi sidebar
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

const RoleBadge = styled.span<{ role: 'freelancer' | 'employee' }>`
    display: inline-block;
    padding: 4px 10px;
    border-radius: 20px;
    font-size: 12px;
    font-weight: 500;
    background: ${({ role }) =>
        role === 'freelancer' ? '#eef2ff' : '#ecfdf5'};
    color: ${({ role }) => (role === 'freelancer' ? '#2042e3' : '#047857')};
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

// Icons (SVG để hiển thị icon cho các nút)
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

// Interface cho dữ liệu user
interface User {
    id: string
    name: string
    email: string
    role: 'freelancer' | 'employee'
}

// Main Component: Trang quản lý người dùng (UserManagement)
const UserManagement: React.FC = () => {
    // Fake dữ liệu user
    const [users, setUsers] = useState<User[]>([
        {
            id: '1',
            name: 'Nguyen Van A',
            email: 'a@gmail.com',
            role: 'freelancer',
        },
        { id: '2', name: 'Tran Van B', email: 'b@gmail.com', role: 'employee' },
        { id: '3', name: 'Le Thi C', email: 'c@gmail.com', role: 'freelancer' },
    ])

    // State để kiểm soát hiển thị modal
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

    // State để lưu dữ liệu user đang chỉnh sửa
    const [editingUser, setEditingUser] = useState<User | null>(null)

    // Hàm mở modal và thiết lập dữ liệu user cần sửa
    const handleOpenModal = (user: User) => {
        setEditingUser({ ...user })
        setIsModalOpen(true)
    }

    // Hàm đóng modal và reset dữ liệu
    const handleCloseModal = () => {
        setIsModalOpen(false)
        // Đợi 300ms để reset form (tránh người dùng nhìn thấy form reset ngay lập tức)
        setTimeout(() => {
            setEditingUser(null)
        }, 300)
    }

    // Hàm cập nhật giá trị khi chỉnh sửa
    const handleInputChange = (key: keyof User, value: string) => {
        if (editingUser) {
            setEditingUser({ ...editingUser, [key]: value })
        }
    }

    // Hàm lưu thay đổi
    const handleSaveUser = () => {
        if (!editingUser) return

        // Kiểm tra các trường bắt buộc không được để trống
        if (editingUser.name.trim() === '' || editingUser.email.trim() === '')
            return

        // Cập nhật user trong danh sách
        setUsers(
            users.map((user) =>
                user.id === editingUser.id ? editingUser : user,
            ),
        )

        // Hiển thị thông báo thành công (tạm thời dùng alert, có thể thay bằng toast)
        setTimeout(() => {
            alert('User information updated successfully!')
        }, 300)

        // Đóng modal sau khi lưu
        handleCloseModal()
    }

    return (
        <PageContainer>
            {/* Header: Tiêu đề */}
            <Header>
                <Title>User Management</Title>
            </Header>

            {/* Bảng danh sách người dùng */}
            <UsersContainer>
                <UserTable>
                    <TableHead>
                        <tr>
                            <TableHeader>Name</TableHeader>
                            <TableHeader>Email</TableHeader>
                            <TableHeader>Role</TableHeader>
                            <TableHeader>Actions</TableHeader>
                        </tr>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell>{user.name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <RoleBadge role={user.role}>
                                        {user.role === 'freelancer'
                                            ? 'Freelancer'
                                            : 'Employee'}
                                    </RoleBadge>
                                </TableCell>
                                <TableCell>
                                    <ActionButtons>
                                        <IconButton
                                            onClick={() =>
                                                handleOpenModal(user)
                                            }
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    </ActionButtons>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </UserTable>
            </UsersContainer>

            {/* Modal để chỉnh sửa thông tin người dùng */}
            <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
                <Modal onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>Edit User</ModalTitle>
                        <CloseButton onClick={handleCloseModal}>×</CloseButton>
                    </ModalHeader>

                    {/* Form nhập tên người dùng */}
                    <InputGroup>
                        <InputLabel>Name</InputLabel>
                        <Input
                            type="text"
                            value={editingUser?.name || ''}
                            onChange={(e) =>
                                handleInputChange('name', e.target.value)
                            }
                            placeholder="Enter user name"
                            autoFocus
                        />
                    </InputGroup>

                    {/* Form nhập email */}
                    <InputGroup>
                        <InputLabel>Email</InputLabel>
                        <Input
                            type="email"
                            value={editingUser?.email || ''}
                            onChange={(e) =>
                                handleInputChange('email', e.target.value)
                            }
                            placeholder="Enter user email"
                        />
                    </InputGroup>

                    {/* Form chọn role */}
                    <InputGroup>
                        <InputLabel>Role</InputLabel>
                        <Select
                            value={editingUser?.role || 'freelancer'}
                            onChange={(e) =>
                                handleInputChange(
                                    'role',
                                    e.target.value as 'freelancer' | 'employee',
                                )
                            }
                        >
                            <option value="freelancer">Freelancer</option>
                            <option value="employee">Employee</option>
                        </Select>
                    </InputGroup>

                    {/* Nút hành động trong modal */}
                    <ModalActions>
                        <CancelButton onClick={handleCloseModal}>
                            Cancel
                        </CancelButton>
                        <SaveButton onClick={handleSaveUser}>Update</SaveButton>
                    </ModalActions>
                </Modal>
            </ModalOverlay>
        </PageContainer>
    )
}

export default UserManagement
