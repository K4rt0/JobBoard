import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios, { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

const API_BASE_URL = 'http://localhost:3000/api/v1'

// Interfaces
interface Skill {
    _id: string
    name: string
    description?: string
    slug?: string
    created_at?: number
    updated_at?: number
}

interface Category {
    _id: string
    name: string
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

const AddButton = styled.button`
    padding: 12px 24px;
    background: #2042e3;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-size: 15px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 8px;
    box-shadow: 0 4px 12px rgba(32, 66, 227, 0.15);
    transition: all 0.3s ease;

    &:hover {
        background: #1a33b9;
        box-shadow: 0 6px 16px rgba(32, 66, 227, 0.25);
    }

    svg {
        width: 18px;
        height: 18px;
    }
`

const SkillsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
`

const SkillCard = styled.div`
    background: #ffffff;
    padding: 20px;
    border-radius: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:hover {
        transform: translateY(-5px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
    }
`

const SkillInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`

const SkillIcon = styled.div`
    width: 46px;
    height: 46px;
    background: #eef2ff;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2042e3;
    font-size: 20px;
`

const SkillName = styled.h3`
    font-size: 16px;
    color: #1f2937;
    font-weight: 600;
    margin: 0;
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

const NoSkills = styled.div`
    text-align: center;
    padding: 60px 20px;
    background: #ffffff;
    border-radius: 14px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
    grid-column: 1 / -1;
`

const EmptyIllustration = styled.div`
    width: 150px;
    height: 150px;
    margin: 0 auto 20px;
    background-color: #eef2ff;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #2042e3;
    font-size: 60px;
`

const EmptyText = styled.p`
    font-size: 16px;
    color: #6b7280;
    margin-bottom: 25px;
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

    &:focus {
        outline: none;
        border-color: #2042e3;
        box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
        background: #ffffff;
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

// Delete confirmation modal styles
const DeleteModalContent = styled.div`
    text-align: center;
    padding: 20px 10px;
`

const DeleteIcon = styled.div`
    width: 70px;
    height: 70px;
    background: #fee2e2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    font-size: 30px;
    margin: 0 auto 20px;
`

const DeleteMessage = styled.p`
    font-size: 16px;
    color: #4b5563;
    margin-bottom: 25px;
    line-height: 1.5;
`

const DeleteButtons = styled.div`
    display: flex;
    justify-content: center;
    gap: 12px;
`

const DeleteButton = styled.button`
    padding: 12px 24px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);

    &:hover {
        background: #dc2626;
        box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25);
    }
`

// Icons
const PlusIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
        />
    </svg>
)

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

const DeleteIconSvg = () => (
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
)

const EmptyIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="70"
        height="70"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
        />
    </svg>
)

const TrashIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="40"
        height="40"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
    </svg>
)

// Main Component
const SkillsPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [newSkill, setNewSkill] = useState<string>('')
    const [selectedCategory, setSelectedCategory] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null)

    // Fetch skills from API
    const fetchSkills = async () => {
        try {
            const token = localStorage.getItem('access-token')
            if (!token) {
                toast.error('Please log in to fetch skills.')
                return
            }
            const response = await axios.get<{ data: Skill[] }>(
                `${API_BASE_URL}/skill/get-all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            setSkills(response.data.data || [])
        } catch (error) {
            const axiosError = error as AxiosError
            console.error('Error fetching skills:', axiosError.message)
            toast.error('Failed to fetch skills. Please try again.')
        }
    }

    // Fetch categories from API
    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('access-token')
            if (!token) {
                toast.error('Please log in to fetch categories.')
                return
            }
            const response = await axios.get<{ data: Category[] }>(
                `${API_BASE_URL}/category/get-all`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            setCategories(response.data.data || [])
        } catch (error) {
            const axiosError = error as AxiosError
            console.error('Error fetching categories:', axiosError.message)
            toast.error('Failed to fetch categories. Please try again.')
        }
    }

    useEffect(() => {
        fetchSkills()
        fetchCategories()
    }, [])

    const getInitials = (name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
    }

    const handleOpenModal = (skill?: Skill) => {
        if (skill) {
            setNewSkill(skill.name)
            setSelectedCategory('') // Không gửi category lên backend, chỉ dùng ở frontend
            setEditingId(skill._id)
        } else {
            setNewSkill('')
            setSelectedCategory('')
            setEditingId(null)
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setTimeout(() => {
            setNewSkill('')
            setSelectedCategory('')
            setEditingId(null)
        }, 300)
    }

    const handleSaveSkill = async () => {
        if (newSkill.trim() === '') {
            toast.warn('Please enter a skill name.')
            return
        }

        const token = localStorage.getItem('access-token')
        if (!token) {
            toast.error('Please log in to save a skill.')
            return
        }

        try {
            if (editingId) {
                const response = await axios.patch(
                    `${API_BASE_URL}/skill/update/${editingId}`,
                    { name: newSkill.trim() },
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                console.log('Update response:', response.data)
                setSkills(
                    skills.map((skill) =>
                        skill._id === editingId
                            ? { ...skill, name: newSkill.trim() }
                            : skill,
                    ),
                )
                toast.success('Skill updated successfully!')
            } else {
                const response = await axios.post(
                    `${API_BASE_URL}/skill/create`,
                    { name: newSkill.trim() },
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                console.log('Create response:', response.data)
                fetchSkills()
                toast.success('Skill created successfully!')
            }
            handleCloseModal()
        } catch (error) {
            const axiosError = error as AxiosError
            console.error('Error saving skill:', axiosError.message)
            toast.error(`Failed to save skill: ${axiosError.message}`)
        }
    }

    // Open delete confirmation modal
    const openDeleteModal = (skill: Skill) => {
        setSkillToDelete(skill)
        setDeleteModalOpen(true)
    }

    // Close delete confirmation modal
    const closeDeleteModal = () => {
        setDeleteModalOpen(false)
        setTimeout(() => {
            setSkillToDelete(null)
        }, 300)
    }

    // Confirm deletion
    const confirmDelete = async () => {
        if (!skillToDelete) return

        const token = localStorage.getItem('access-token')
        if (!token) {
            toast.error('Please log in to delete a skill.')
            return
        }

        try {
            await axios.delete(
                `${API_BASE_URL}/skill/delete/${skillToDelete._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            setSkills(skills.filter((skill) => skill._id !== skillToDelete._id))
            toast.success('Skill deleted successfully!')
            closeDeleteModal()
        } catch (error) {
            const axiosError = error as AxiosError
            console.error('Error deleting skill:', axiosError.message)
            toast.error(`Failed to delete skill: ${axiosError.message}`)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSaveSkill()
        }
    }

    return (
        <PageContainer>
            <ToastContainer />
            <Header>
                <Title>Skill Management</Title>
                <AddButton onClick={() => handleOpenModal()}>
                    <PlusIcon /> Add New Skill
                </AddButton>
            </Header>

            <SkillsContainer>
                {skills.length > 0 ? (
                    skills.map((skill) => (
                        <SkillCard key={skill._id}>
                            <SkillInfo>
                                <SkillIcon>{getInitials(skill.name)}</SkillIcon>
                                <SkillName>{skill.name}</SkillName>
                            </SkillInfo>
                            <ActionButtons>
                                <IconButton
                                    onClick={() => handleOpenModal(skill)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() => openDeleteModal(skill)}
                                >
                                    <DeleteIconSvg />
                                </IconButton>
                            </ActionButtons>
                        </SkillCard>
                    ))
                ) : (
                    <NoSkills>
                        <EmptyIllustration>
                            <EmptyIcon />
                        </EmptyIllustration>
                        <ModalTitle>No Skills Added Yet</ModalTitle>
                        <EmptyText>
                            Start adding your skills to build your professional
                            profile
                        </EmptyText>
                    </NoSkills>
                )}
            </SkillsContainer>

            {/* Edit/Add Skill Modal */}
            <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
                <Modal onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>
                            {editingId ? 'Edit Skill' : 'Add New Skill'}
                        </ModalTitle>
                        <CloseButton onClick={handleCloseModal}>×</CloseButton>
                    </ModalHeader>

                    <InputGroup>
                        <InputLabel>Skill Name</InputLabel>
                        <Input
                            type="text"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Enter skill name"
                            autoFocus
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputLabel>Category (Optional)</InputLabel>
                        <Select
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(e.target.value)
                            }
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </InputGroup>

                    <ModalActions>
                        <CancelButton onClick={handleCloseModal}>
                            Cancel
                        </CancelButton>
                        <SaveButton onClick={handleSaveSkill}>
                            {editingId ? 'Update' : 'Save'}
                        </SaveButton>
                    </ModalActions>
                </Modal>
            </ModalOverlay>

            {/* Delete Confirmation Modal */}
            <ModalOverlay isOpen={deleteModalOpen} onClick={closeDeleteModal}>
                <Modal onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>Delete Skill</ModalTitle>
                        <CloseButton onClick={closeDeleteModal}>×</CloseButton>
                    </ModalHeader>

                    <DeleteModalContent>
                        <DeleteIcon>
                            <TrashIcon />
                        </DeleteIcon>
                        <DeleteMessage>
                            Are you sure you want to delete the skill &quot;
                            {skillToDelete?.name}&quot;? <br />
                            This action cannot be undone.
                        </DeleteMessage>

                        <DeleteButtons>
                            <CancelButton onClick={closeDeleteModal}>
                                Cancel
                            </CancelButton>
                            <DeleteButton onClick={confirmDelete}>
                                Delete
                            </DeleteButton>
                        </DeleteButtons>
                    </DeleteModalContent>
                </Modal>
            </ModalOverlay>
        </PageContainer>
    )
}

export default SkillsPage
