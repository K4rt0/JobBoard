import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { ToastContainer, toast } from 'react-toastify' // Import Toastify
import 'react-toastify/dist/ReactToastify.css' // Import CSS của Toastify

const API_BASE_URL = 'http://localhost:3000/api/v1'

interface Category {
    _id: string
    name: string
}

interface ModalOverlayProps {
    isOpen: boolean
}

interface ErrorResponse {
    statusCode: number
    message: string
    stack?: string
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

const CategoriesContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 30px;
`

const CategoryCard = styled.div`
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

const CategoryInfo = styled.div`
    display: flex;
    align-items: center;
    gap: 15px;
`

const CategoryIcon = styled.div`
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

const CategoryName = styled.h3`
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

const NoCategories = styled.div`
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

const ModalOverlay = styled.div<ModalOverlayProps>`
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

const Textarea = styled.textarea`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: #f9fafb;
    min-height: 150px;
    resize: vertical;

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

// New components for delete confirmation modal
const ConfirmationMessage = styled.p`
    font-size: 16px;
    color: #4b5563;
    margin-bottom: 25px;
    text-align: center;
    line-height: 1.5;
`

const HighlightedText = styled.span`
    font-weight: 600;
    color: #1f2937;
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

const WarningIcon = styled.div`
    width: 60px;
    height: 60px;
    background: #fee2e2;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #ef4444;
    font-size: 30px;
    margin: 0 auto 20px;
`

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

const DeleteIcon = () => (
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

const AlertIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="30"
        height="30"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
        />
    </svg>
)

const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [newCategories, setNewCategories] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    )

    const fetchCategories = async () => {
        try {
            const response = await axios.get<{ data: Category[] }>(
                `${API_BASE_URL}/category/get-all`,
            )
            setCategories(response.data.data || [])
        } catch (error) {
            console.error('Error fetching categories:', error)
            toast.error('Failed to fetch categories. Please try again.')
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    const getInitials = (name: string): string => {
        return name
            .split(' ')
            .map((word: string) => word[0])
            .join('')
            .toUpperCase()
    }

    const handleOpenModal = (category?: Category) => {
        if (category) {
            setNewCategories(category.name)
            setEditingId(category._id)
        } else {
            setNewCategories('')
            setEditingId(null)
        }
        setIsModalOpen(true)
    }

    const handleCloseModal = () => {
        setIsModalOpen(false)
        setTimeout(() => {
            setNewCategories('')
            setEditingId(null)
        }, 300)
    }

    const handleSaveCategory = async () => {
        const categoryNames = newCategories
            .split('\n')
            .map((name: string) => name.trim())
            .filter((name: string) => name !== '')

        if (categoryNames.length === 0) {
            toast.warn('Please enter at least one category name.')
            return
        }

        const token = localStorage.getItem('access-token')
        if (!token) {
            toast.error('Please log in to create a category.')
            return
        }

        console.log('Token:', token)
        console.log(
            'Data to send:',
            categoryNames.length === 1
                ? { name: categoryNames[0] }
                : categoryNames.map((name: string) => ({ name })),
        )

        try {
            if (editingId) {
                const response = await axios.patch(
                    `${API_BASE_URL}/category/update/${editingId}`,
                    { name: categoryNames[0] },
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                console.log('Update response:', response.data)
                setCategories(
                    categories.map((cat) =>
                        cat._id === editingId
                            ? { ...cat, name: categoryNames[0] }
                            : cat,
                    ),
                )
                toast.success('Category updated successfully!')
            } else {
                const response = await axios.post(
                    `${API_BASE_URL}/category/create`,
                    categoryNames.length === 1
                        ? { name: categoryNames[0] }
                        : categoryNames.map((name: string) => ({ name })),
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                console.log('Create response:', response.data)
                fetchCategories()
                toast.success('Category created successfully!')
            }
            handleCloseModal()
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>
            console.error(
                'Error saving category:',
                axiosError.response?.data || axiosError.message,
            )
            toast.error(
                `Failed to save category: ${axiosError.response?.data?.message || axiosError.message}`,
            )
        }
    }

    const handleConfirmDelete = (category: Category) => {
        setCategoryToDelete(category)
        setIsDeleteModalOpen(true)
    }

    const handleCloseDeleteModal = () => {
        setIsDeleteModalOpen(false)
        setTimeout(() => {
            setCategoryToDelete(null)
        }, 300)
    }

    const handleDeleteCategory = async () => {
        if (!categoryToDelete) return

        const token = localStorage.getItem('access-token')
        if (!token) {
            toast.error('Please log in to delete a category.')
            return
        }

        try {
            await axios.delete(
                `${API_BASE_URL}/category/delete/${categoryToDelete._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            setCategories(
                categories.filter(
                    (category) => category._id !== categoryToDelete._id,
                ),
            )
            toast.success('Category deleted successfully!')
            handleCloseDeleteModal()
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>
            console.error(
                'Error deleting category:',
                axiosError.response?.data || axiosError.message,
            )
            toast.error(
                `Failed to delete category: ${axiosError.response?.data?.message || axiosError.message}`,
            )
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSaveCategory()
        }
    }

    return (
        <PageContainer>
            <ToastContainer /> {/* Thêm ToastContainer để hiển thị thông báo */}
            <Header>
                <Title>Category Management</Title>
                <AddButton onClick={() => handleOpenModal()}>
                    <PlusIcon /> Add New Categories
                </AddButton>
            </Header>
            <CategoriesContainer>
                {categories.length > 0 ? (
                    categories.map((category) => (
                        <CategoryCard key={category._id}>
                            <CategoryInfo>
                                <CategoryIcon>
                                    {getInitials(category.name)}
                                </CategoryIcon>
                                <CategoryName>{category.name}</CategoryName>
                            </CategoryInfo>
                            <ActionButtons>
                                <IconButton
                                    onClick={() => handleOpenModal(category)}
                                >
                                    <EditIcon />
                                </IconButton>
                                <IconButton
                                    onClick={() =>
                                        handleConfirmDelete(category)
                                    }
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </ActionButtons>
                        </CategoryCard>
                    ))
                ) : (
                    <NoCategories>
                        <EmptyIllustration>
                            <EmptyIcon />
                        </EmptyIllustration>
                        <ModalTitle>No Categories Added Yet</ModalTitle>
                        <EmptyText>
                            Start adding your categories to organize your
                            content
                        </EmptyText>
                    </NoCategories>
                )}
            </CategoriesContainer>
            {/* Add/Edit Category Modal */}
            <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
                <Modal onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>
                            {editingId ? 'Edit Category' : 'Add New Categories'}
                        </ModalTitle>
                        <CloseButton onClick={handleCloseModal}>×</CloseButton>
                    </ModalHeader>

                    <InputGroup>
                        <InputLabel>
                            {editingId
                                ? 'Category Name'
                                : 'Category Names (one per line)'}
                        </InputLabel>
                        <Textarea
                            value={newCategories}
                            onChange={(e) => setNewCategories(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder={
                                editingId
                                    ? 'Enter category name'
                                    : 'Enter category names, one per line'
                            }
                            autoFocus
                        />
                    </InputGroup>

                    <ModalActions>
                        <CancelButton onClick={handleCloseModal}>
                            Cancel
                        </CancelButton>
                        <SaveButton onClick={handleSaveCategory}>
                            {editingId ? 'Update' : 'Save All'}
                        </SaveButton>
                    </ModalActions>
                </Modal>
            </ModalOverlay>
            {/* Delete Confirmation Modal */}
            <ModalOverlay
                isOpen={isDeleteModalOpen}
                onClick={handleCloseDeleteModal}
            >
                <Modal onClick={(e) => e.stopPropagation()}>
                    <ModalHeader>
                        <ModalTitle>Delete Category</ModalTitle>
                        <CloseButton onClick={handleCloseDeleteModal}>
                            ×
                        </CloseButton>
                    </ModalHeader>

                    <WarningIcon>
                        <AlertIcon />
                    </WarningIcon>

                    <ConfirmationMessage>
                        Are you sure you want to delete the category{' '}
                        <HighlightedText>
                            “{categoryToDelete?.name}”
                        </HighlightedText>
                        ?
                        <br />
                        This action cannot be undone.
                    </ConfirmationMessage>

                    <ModalActions>
                        <CancelButton onClick={handleCloseDeleteModal}>
                            Cancel
                        </CancelButton>
                        <DeleteButton onClick={handleDeleteCategory}>
                            Delete
                        </DeleteButton>
                    </ModalActions>
                </Modal>
            </ModalOverlay>
        </PageContainer>
    )
}

export default CategoryPage
