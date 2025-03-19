import React, { useState, useEffect, useMemo } from 'react'
import styled from 'styled-components'
import axios, { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { debounce } from 'lodash'

const API_BASE_URL = 'http://localhost:3000/api/v1'

interface Category {
    _id: string
    name: string
    description?: string
    slug?: string
}

interface Pagination {
    total: number
    current_page: number
    total_pages: number
    limit: number
}

interface PaginatedResponse {
    data: Category[]
    pagination: Pagination
}

interface ModalOverlayProps {
    isOpen: boolean
}

interface ErrorResponse {
    statusCode: number
    message: string
    stack?: string
}

// Styled Components (giữ nguyên như cũ)
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
    flex-wrap: wrap;
    gap: 15px;

    @media (max-width: 768px) {
        flex-direction: column;
        align-items: flex-start;
    }
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

    @media (max-width: 768px) {
        width: 100%;
        justify-content: center;
    }
`

const SearchFilterContainer = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 15px;
    margin-bottom: 20px;
    width: 100%;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`

const SearchContainer = styled.div`
    flex: 1;
    position: relative;
`

const SearchInput = styled.input`
    width: 100%;
    padding: 14px 16px 14px 45px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:focus {
        outline: none;
        border-color: #2042e3;
        box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
    }

    @media (max-width: 768px) {
        padding: 12px 12px 12px 40px;
    }
`

const SearchIcon = styled.div`
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;

    @media (max-width: 768px) {
        left: 12px;
    }
`

const ClearButton = styled.button`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    color: #6b7280;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.2s ease;

    &:hover {
        background: #f3f4f6;
        color: #1f2937;
    }

    @media (max-width: 768px) {
        right: 12px;
    }
`

const SortContainer = styled.div`
    width: 200px;
    position: relative;

    @media (max-width: 768px) {
        width: 100%;
    }
`

const SortSelect = styled.select`
    width: 100%;
    padding: 14px 16px;
    border: 1px solid #e5e7eb;
    border-radius: 10px;
    font-size: 15px;
    transition: all 0.3s ease;
    background: #ffffff;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    appearance: none;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #2042e3;
        box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
    }
`

const SortIcon = styled.div`
    position: absolute;
    right: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #6b7280;
    pointer-events: none;
`

const SearchStats = styled.div`
    font-size: 14px;
    color: #6b7280;
    margin-bottom: 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
`

const LimitSelect = styled.select`
    padding: 8px 12px;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
    font-size: 14px;
    color: #4b5563;
    background: #ffffff;
    cursor: pointer;

    &:focus {
        outline: none;
        border-color: #2042e3;
    }
`

const CategoriesContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;
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

const PaginationContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 30px;
    gap: 5px;
    flex-wrap: wrap;
`

const PageButton = styled.button<{ isActive?: boolean }>`
    padding: 8px 14px;
    border: ${(props) =>
        props.isActive ? '1px solid #2042e3' : '1px solid #e5e7eb'};
    background: ${(props) => (props.isActive ? '#eef2ff' : '#ffffff')};
    border-radius: 8px;
    cursor: pointer;
    font-size: 14px;
    color: ${(props) => (props.isActive ? '#2042e3' : '#4b5563')};
    font-weight: ${(props) => (props.isActive ? '600' : '500')};
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;

    &:hover {
        background: ${(props) => (props.isActive ? '#eef2ff' : '#f3f4f6')};
        border-color: ${(props) => (props.isActive ? '#2042e3' : '#d1d5db')};
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        background: #f3f4f6;
        border-color: #e5e7eb;
    }
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

// Icons (giữ nguyên như cũ)
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
            d="M19 7l-.867 12.142A2 2 0 0116.138 21Hobservers7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
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

const SearchIconSvg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="20"
        height="20"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
    </svg>
)

const SortIconSvg = () => (
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
            d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12"
        />
    </svg>
)

const CloseIconSvg = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="16"
        height="16"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M6 18L18 6M6 6l12 12"
        />
    </svg>
)

const ChevronLeftIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="16"
        height="16"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 19l-7-7 7-7"
        />
    </svg>
)

const ChevronRightIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        width="16"
        height="16"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5l7 7-7 7"
        />
    </svg>
)

// Main Component
const CategoryPage: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        current_page: 1,
        total_pages: 1,
        limit: 10,
    })
    const [newCategories, setNewCategories] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false)
    const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
        null,
    )
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [sortType, setSortType] = useState<string>('all')
    const [itemsPerPage, setItemsPerPage] = useState<number>(10)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const fetchCategories = async (
        page = 1,
        limit = 10,
        sort = 'all',
        search = '',
    ) => {
        try {
            setIsLoading(true)
            const token = localStorage.getItem('access-token')
            if (!token) {
                toast.error(
                    'Authentication token not found. Please log in again.',
                )
                setTimeout(() => (window.location.href = '/login'), 2000)
                return
            }

            let url = `${API_BASE_URL}/category/get-all-pagination?page=${page}&limit=${limit}`
            if (sort !== 'all') url += `&sort=${sort}`
            if (search.trim())
                url += `&search=${encodeURIComponent(search.trim())}`

            const response = await axios.get(url, {
                headers: { Authorization: `Bearer ${token}` },
                timeout: 10000,
            })

            if (response.data && response.data.data) {
                setCategories(response.data.data)
                setPagination(
                    response.data.pagination || {
                        total: 0,
                        current_page: 1,
                        total_pages: 1,
                        limit,
                    },
                )
            } else {
                toast.error('Invalid data format received from server')
            }
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>
            if (axiosError.response?.status === 401) {
                toast.error('Session expired. Please log in again.')
                setTimeout(() => (window.location.href = '/login'), 2000)
                return
            }
            toast.error(
                `Failed to fetch categories: ${axiosError.response?.data?.message || axiosError.message}`,
            )
            setCategories([])
            setPagination({
                total: 0,
                current_page: page,
                total_pages: 1,
                limit,
            })
        } finally {
            setIsLoading(false)
        }
    }

    // Debounce tìm kiếm real-time
    const debouncedFetchCategories = useMemo(
        () =>
            debounce(
                (page: number, limit: number, sort: string, query: string) =>
                    fetchCategories(page, limit, sort, query),
                500,
            ),
        [],
    )

    useEffect(() => {
        debouncedFetchCategories(
            currentPage,
            itemsPerPage,
            sortType,
            searchQuery,
        )
        return () => debouncedFetchCategories.cancel()
    }, [currentPage, itemsPerPage, sortType, searchQuery])

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
        if (categoryNames.some((name) => name.length < 2 || name.length > 50)) {
            toast.warn('Category name must be between 2 and 50 characters.')
            return
        }

        const token = localStorage.getItem('access-token')
        if (!token) {
            toast.error('Please log in to create a category.')
            setTimeout(() => (window.location.href = '/login'), 2000)
            return
        }

        try {
            if (editingId) {
                await axios.patch(
                    `${API_BASE_URL}/category/update/${editingId}`,
                    { name: categoryNames[0] },
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                toast.success('Category updated successfully!')
            } else {
                await axios.post(
                    `${API_BASE_URL}/category/create`,
                    categoryNames.length === 1
                        ? { name: categoryNames[0] }
                        : categoryNames.map((name: string) => ({ name })),
                    { headers: { Authorization: `Bearer ${token}` } },
                )
                toast.success('Category created successfully!')
            }
            fetchCategories(currentPage, itemsPerPage, sortType, searchQuery)
            handleCloseModal()
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>
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
            setTimeout(() => (window.location.href = '/login'), 2000)
            return
        }

        try {
            await axios.delete(
                `${API_BASE_URL}/category/delete/${categoryToDelete._id}`,
                {
                    headers: { Authorization: `Bearer ${token}` },
                },
            )
            toast.success('Category deleted successfully!')
            handleCloseDeleteModal()

            const isLastItemOnPage =
                categories.length === 1 && pagination.current_page > 1
            if (isLastItemOnPage) {
                setCurrentPage((prev) => prev - 1)
            } else {
                fetchCategories(
                    currentPage,
                    itemsPerPage,
                    sortType,
                    searchQuery,
                )
            }
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>
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

    const handleClearSearch = () => {
        setSearchQuery('')
        setCurrentPage(1)
        fetchCategories(1, itemsPerPage, sortType, '')
    }

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortType(e.target.value)
        setCurrentPage(1)
    }

    const handleLimitChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setItemsPerPage(Number(e.target.value))
        setCurrentPage(1)
    }

    const paginationNumbers = useMemo(() => {
        const numbers = []
        const maxPages = 5
        const halfMaxPages = Math.floor(maxPages / 2)

        let startPage = Math.max(1, pagination.current_page - halfMaxPages)
        const endPage = Math.min(
            pagination.total_pages,
            startPage + maxPages - 1,
        )

        if (endPage - startPage + 1 < maxPages) {
            startPage = Math.max(1, endPage - maxPages + 1)
        }

        for (let i = startPage; i <= endPage; i++) {
            numbers.push(i)
        }

        return numbers
    }, [pagination.current_page, pagination.total_pages])

    return (
        <PageContainer>
            <ToastContainer position="top-right" autoClose={3000} />
            <Header>
                <Title>Categories</Title>
                <AddButton onClick={() => handleOpenModal()}>
                    <PlusIcon />
                    Add Category
                </AddButton>
            </Header>

            <SearchFilterContainer>
                <SearchContainer>
                    <SearchIcon>
                        <SearchIconSvg />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Search categories..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                        <ClearButton onClick={handleClearSearch}>
                            <CloseIconSvg />
                        </ClearButton>
                    )}
                </SearchContainer>
                <SortContainer>
                    <SortSelect value={sortType} onChange={handleSortChange}>
                        <option value="all">All Categories</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </SortSelect>
                    <SortIcon>
                        <SortIconSvg />
                    </SortIcon>
                </SortContainer>
            </SearchFilterContainer>

            <SearchStats>
                <span>
                    {pagination.total} categories found
                    {searchQuery && ` for "${searchQuery}"`}
                </span>
                <LimitSelect value={itemsPerPage} onChange={handleLimitChange}>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                </LimitSelect>
            </SearchStats>

            {isLoading ? (
                <NoCategories>Loading categories...</NoCategories>
            ) : categories.length > 0 ? (
                <CategoriesContainer>
                    {categories.map((category) => (
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
                    ))}
                </CategoriesContainer>
            ) : (
                <NoCategories>
                    <EmptyIllustration>
                        <EmptyIcon />
                    </EmptyIllustration>
                    <EmptyText>
                        {searchQuery
                            ? `No categories found matching "${searchQuery}"`
                            : "No categories found. Let's create one!"}
                    </EmptyText>
                    <AddButton onClick={() => handleOpenModal()}>
                        <PlusIcon />
                        Add Category
                    </AddButton>
                </NoCategories>
            )}

            {pagination.total_pages > 1 && (
                <PaginationContainer>
                    <PageButton
                        onClick={() => handlePageChange(1)}
                        disabled={currentPage === 1}
                    >
                        First
                    </PageButton>
                    <PageButton
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                    >
                        <ChevronLeftIcon />
                    </PageButton>
                    {paginationNumbers.map((page) => (
                        <PageButton
                            key={page}
                            isActive={page === currentPage}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </PageButton>
                    ))}
                    <PageButton
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === pagination.total_pages}
                    >
                        <ChevronRightIcon />
                    </PageButton>
                    <PageButton
                        onClick={() => handlePageChange(pagination.total_pages)}
                        disabled={currentPage === pagination.total_pages}
                    >
                        Last
                    </PageButton>
                </PaginationContainer>
            )}

            {/* Add/Edit Category Modal */}
            <ModalOverlay isOpen={isModalOpen}>
                <Modal>
                    <ModalHeader>
                        <ModalTitle>
                            {editingId ? 'Edit Category' : 'Add New Category'}
                        </ModalTitle>
                        <CloseButton onClick={handleCloseModal}>
                            <CloseIconSvg />
                        </CloseButton>
                    </ModalHeader>
                    <InputGroup>
                        <InputLabel>
                            {editingId
                                ? 'Category Name'
                                : 'Category Name(s) - One per line'}
                        </InputLabel>
                        <Textarea
                            value={newCategories}
                            onChange={(e) => setNewCategories(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder={
                                editingId
                                    ? 'Enter category name'
                                    : 'Enter category names (one per line)'
                            }
                            rows={editingId ? 1 : 5}
                        />
                    </InputGroup>
                    <ModalActions>
                        <CancelButton onClick={handleCloseModal}>
                            Cancel
                        </CancelButton>
                        <SaveButton onClick={handleSaveCategory}>
                            {editingId ? 'Update' : 'Save'}
                        </SaveButton>
                    </ModalActions>
                </Modal>
            </ModalOverlay>

            {/* Delete Confirmation Modal */}
            <ModalOverlay isOpen={isDeleteModalOpen}>
                <Modal>
                    <WarningIcon>
                        <AlertIcon />
                    </WarningIcon>
                    <ConfirmationMessage>
                        Are you sure you want to delete the category{' '}
                        <HighlightedText>
                            {categoryToDelete?.name}
                        </HighlightedText>
                        ? This action cannot be undone.
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
