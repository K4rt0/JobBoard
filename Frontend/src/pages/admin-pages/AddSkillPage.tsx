import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import styled from 'styled-components'
import axios, { AxiosError } from 'axios'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { debounce } from 'lodash'
import axiosInstance from '@/services/axiosInstance'

const API_BASE_URL = 'http://localhost:3000/api/v1'

interface Skill {
    _id: string
    name: string
    description?: string
    slug?: string
    created_at?: number
    updated_at?: number
    is_disabled: boolean
}

interface Pagination {
    total: number
    current_page: number
    total_pages: number
    limit: number
}

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
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    justify-content: space-between;
`

const FilterTag = styled.div`
    display: inline-flex;
    align-items: center;
    background: #eef2ff;
    color: #2042e3;
    font-size: 12px;
    font-weight: 500;
    padding: 4px 10px;
    border-radius: 6px;
    gap: 6px;
    margin-left: 5px;

    button {
        background: none;
        border: none;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        color: #2042e3;

        &:hover {
            color: #1a33b9;
        }
    }
`

const SkillsContainer = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 20px;
    margin-top: 20px;

    @media (max-width: 640px) {
        grid-template-columns: 1fr;
    }
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

const SaveButton = styled.button<{ disabled?: boolean }>`
    padding: 12px 24px;
    background: #2042e3;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(32, 66, 227, 0.15);
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};

    &:hover:not(:disabled) {
        background: #1a33b9;
        box-shadow: 0 6px 16px rgba(32, 66, 227, 0.25);
    }
`

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

const DeleteButton = styled.button<{ disabled?: boolean }>`
    padding: 12px 24px;
    background: #ef4444;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    cursor: ${(props) => (props.disabled ? 'not-allowed' : 'pointer')};
    font-weight: 600;
    transition: all 0.3s ease;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.15);
    opacity: ${(props) => (props.disabled ? 0.6 : 1)};

    &:hover:not(:disabled) {
        background: #dc2626;
        box-shadow: 0 6px 16px rgba(239, 68, 68, 0.25);
    }
`

const ToggleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;
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

    &:checked + span {
        background-color: #2042e3;
    }

    &:checked + span:before {
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

const ToggleLabel = styled.span`
    font-size: 14px;
    color: #4b5563;
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

const SkillsPage: React.FC = () => {
    const [skills, setSkills] = useState<Skill[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        current_page: 1,
        total_pages: 1,
        limit: 10,
    })
    const [newSkill, setNewSkill] = useState<string>('')
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
    const [editingId, setEditingId] = useState<string | null>(null)
    const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false)
    const [skillToDelete, setSkillToDelete] = useState<Skill | null>(null)
    const [isDisabled, setIsDisabled] = useState<boolean>(false)
    const [searchQuery, setSearchQuery] = useState<string>('')
    const [statusFilter, setStatusFilter] = useState<string | null>(null)
    const [sortType, setSortType] = useState<string>('all')
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [itemsPerPage, setItemsPerPage] = useState<number>(10)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isSaving, setIsSaving] = useState<boolean>(false)
    const [isDeleting, setIsDeleting] = useState<boolean>(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const fetchSkills = useCallback(
        async (page = 1, limit = 10, search = '', sort = 'all') => {
            try {
                setIsLoading(true)

                let url = `${API_BASE_URL}/skill/get-all-pagination?page=${page}&limit=${limit}`
                if (search.trim())
                    url += `&search=${encodeURIComponent(search.trim())}`
                if (sort !== 'all') url += `&sort=${sort}`

                const response = await axiosInstance.get<{
                    data: Skill[]
                    pagination: Pagination
                }>(url, {})
                setSkills(response.data.data || [])
                setPagination(
                    response.data.pagination || {
                        total: 0,
                        current_page: 1,
                        total_pages: 1,
                        limit,
                    },
                )
            } catch (error) {
                const axiosError = error as AxiosError
                if (axiosError.response?.status === 401) {
                    toast.error('Session expired. Redirecting to login...')
                    setTimeout(() => (window.location.href = '/login'), 1500)
                } else {
                    toast.error('Failed to fetch skills. Please try again.')
                }
                setSkills([])
                setPagination({
                    total: 0,
                    current_page: page,
                    total_pages: 1,
                    limit,
                })
            } finally {
                setIsLoading(false)
            }
        },
        [],
    )

    const fetchSkillsDebounced = useMemo(
        () =>
            debounce(
                (page, limit, search, sort) =>
                    fetchSkills(page, limit, search, sort),
                300,
            ),
        [fetchSkills],
    )

    useEffect(() => {
        fetchSkillsDebounced(currentPage, itemsPerPage, searchQuery, sortType)
        return () => fetchSkillsDebounced.cancel()
    }, [currentPage, itemsPerPage, searchQuery, sortType, fetchSkillsDebounced])

    const filteredSkills = useMemo(() => {
        return skills.filter((skill) => {
            const matchesStatus =
                statusFilter === null ||
                (statusFilter === 'enabled' && !skill.is_disabled) ||
                (statusFilter === 'disabled' && skill.is_disabled)
            return matchesStatus
        })
    }, [skills, statusFilter])

    const getInitials = useCallback((name: string) => {
        return name
            .split(' ')
            .map((word) => word[0])
            .join('')
            .toUpperCase()
    }, [])

    const handleOpenModal = useCallback((skill?: Skill) => {
        if (skill) {
            setNewSkill(skill.name)
            setEditingId(skill._id)
            setIsDisabled(skill.is_disabled)
        } else {
            setNewSkill('')
            setEditingId(null)
            setIsDisabled(false)
        }
        setIsModalOpen(true)
        setTimeout(() => inputRef.current?.focus(), 0)
    }, [])

    const handleCloseModal = useCallback(() => {
        setIsModalOpen(false)
        setTimeout(() => {
            setNewSkill('')
            setEditingId(null)
            setIsDisabled(false)
        }, 300)
    }, [])

    const handleSaveSkill = useCallback(async () => {
        if (newSkill.trim() === '') {
            toast.warn('Please enter a skill name.')
            return
        }
        if (newSkill.trim().length < 2) {
            toast.warn('Skill name must be at least 2 characters long.')
            return
        }
        if (newSkill.trim().length > 50) {
            toast.warn('Skill name must not exceed 50 characters.')
            return
        }

        setIsSaving(true)
        try {
            const skillData = { name: newSkill.trim(), is_disabled: isDisabled }
            if (editingId) {
                await axiosInstance.patch(
                    `${API_BASE_URL}/skill/update/${editingId}`,
                    skillData,
                )
                toast.success('Skill updated successfully!')
            } else {
                await axiosInstance.post(
                    `${API_BASE_URL}/skill/create`,
                    skillData,
                    {},
                )
                toast.success('Skill created successfully!')
            }
            fetchSkills(currentPage, itemsPerPage, searchQuery, sortType)
            handleCloseModal()
        } catch (error) {
            const axiosError = error as AxiosError
            toast.error(`Failed to save skill: ${axiosError.message}`)
        } finally {
            setIsSaving(false)
        }
    }, [
        newSkill,
        isDisabled,
        editingId,
        currentPage,
        itemsPerPage,
        searchQuery,
        sortType,
        handleCloseModal,
    ])

    const openDeleteModal = useCallback((skill: Skill) => {
        setSkillToDelete(skill)
        setDeleteModalOpen(true)
    }, [])

    const closeDeleteModal = useCallback(() => {
        setDeleteModalOpen(false)
        setTimeout(() => setSkillToDelete(null), 300)
    }, [])

    const confirmDelete = useCallback(async () => {
        if (!skillToDelete) return

        const token = localStorage.getItem('access-token')
        if (!token) {
            toast.error('Please log in to delete a skill.')
            window.location.href = '/login'
            return
        }

        setIsDeleting(true)
        try {
            await axiosInstance.delete(
                `${API_BASE_URL}/skill/delete/${skillToDelete._id}`,
            )
            toast.success('Skill deleted successfully!')
            const isLastItemOnPage =
                filteredSkills.length === 1 && currentPage > 1
            if (isLastItemOnPage) {
                setCurrentPage((prev) => prev - 1)
            } else {
                fetchSkills(currentPage, itemsPerPage, searchQuery, sortType)
            }
            closeDeleteModal()
        } catch (error) {
            const axiosError = error as AxiosError
            toast.error(`Failed to delete skill: ${axiosError.message}`)
        } finally {
            setIsDeleting(false)
        }
    }, [
        skillToDelete,
        currentPage,
        itemsPerPage,
        searchQuery,
        sortType,
        filteredSkills,
        closeDeleteModal,
    ])

    const handleKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                handleSaveSkill()
            }
        },
        [handleSaveSkill],
    )

    const handleSearchKeyPress = useCallback(
        (e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key === 'Enter') {
                setCurrentPage(1)
                fetchSkills(1, itemsPerPage, searchQuery, sortType)
            } else if (e.key === 'Escape') {
                setSearchQuery('')
                setCurrentPage(1)
                fetchSkills(1, itemsPerPage, '', sortType)
            }
        },
        [itemsPerPage, searchQuery, sortType],
    )

    const handleClearSearch = useCallback(() => {
        setSearchQuery('')
        setCurrentPage(1)
        fetchSkills(1, itemsPerPage, '', sortType)
    }, [itemsPerPage, sortType])

    const handleStatusFilter = useCallback((status: string | null) => {
        setStatusFilter(status)
        setCurrentPage(1)
    }, [])

    const handleClearFilter = useCallback(() => {
        setStatusFilter(null)
        setCurrentPage(1)
    }, [])

    const handleSortChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setSortType(e.target.value)
            setCurrentPage(1)
        },
        [],
    )

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page)
    }, [])

    const handleLimitChange = useCallback(
        (e: React.ChangeEvent<HTMLSelectElement>) => {
            setItemsPerPage(Number(e.target.value))
            setCurrentPage(1)
        },
        [],
    )

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
            <ToastContainer />
            <Header>
                <Title>Skill Management</Title>
                <AddButton onClick={() => handleOpenModal()}>
                    <PlusIcon /> Add New Skill
                </AddButton>
            </Header>

            <SearchFilterContainer>
                <SearchContainer>
                    <SearchIcon>
                        <SearchIconSvg />
                    </SearchIcon>
                    <SearchInput
                        type="text"
                        placeholder="Search skills..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        onKeyDown={handleSearchKeyPress}
                    />
                    {searchQuery && (
                        <ClearButton onClick={handleClearSearch}>
                            <CloseIconSvg />
                        </ClearButton>
                    )}
                </SearchContainer>
                <SortContainer>
                    <SortSelect value={sortType} onChange={handleSortChange}>
                        <option value="all">All Skills</option>
                        <option value="newest">Newest First</option>
                        <option value="oldest">Oldest First</option>
                    </SortSelect>
                    <SortIcon>
                        <SortIconSvg />
                    </SortIcon>
                </SortContainer>
            </SearchFilterContainer>

            <SearchStats>
                <div>
                    <span>
                        {filteredSkills.length} skill
                        {filteredSkills.length !== 1 ? 's' : ''} found
                    </span>
                    {!statusFilter && (
                        <>
                            <span> | </span>
                            <span
                                onClick={() => handleStatusFilter('enabled')}
                                style={{ cursor: 'pointer', color: '#2042e3' }}
                            >
                                Filter enabled
                            </span>
                            <span> | </span>
                            <span
                                onClick={() => handleStatusFilter('disabled')}
                                style={{ cursor: 'pointer', color: '#2042e3' }}
                            >
                                Filter disabled
                            </span>
                        </>
                    )}
                    {statusFilter && (
                        <FilterTag>
                            {statusFilter === 'enabled'
                                ? 'Enabled'
                                : 'Disabled'}
                            <button onClick={handleClearFilter}>
                                <CloseIconSvg />
                            </button>
                        </FilterTag>
                    )}
                </div>
                <LimitSelect value={itemsPerPage} onChange={handleLimitChange}>
                    <option value={10}>10 per page</option>
                    <option value={25}>25 per page</option>
                    <option value={50}>50 per page</option>
                    <option value={100}>100 per page</option>
                </LimitSelect>
            </SearchStats>

            {isLoading ? (
                <NoSkills>Loading skills...</NoSkills>
            ) : filteredSkills.length > 0 ? (
                <SkillsContainer>
                    {filteredSkills.map((skill) => (
                        <SkillCard key={skill._id}>
                            <SkillInfo>
                                <SkillIcon>{getInitials(skill.name)}</SkillIcon>
                                <div>
                                    <SkillName>{skill.name}</SkillName>
                                    <span
                                        style={{
                                            fontSize: '12px',
                                            color: skill.is_disabled
                                                ? '#ef4444'
                                                : '#22c55e',
                                        }}
                                    >
                                        {skill.is_disabled
                                            ? 'Disabled'
                                            : 'Enabled'}
                                    </span>
                                </div>
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
                    ))}
                </SkillsContainer>
            ) : (
                <NoSkills>
                    <EmptyIllustration>
                        <EmptyIcon />
                    </EmptyIllustration>
                    <ModalTitle>
                        {searchQuery || statusFilter
                            ? 'No matching skills found'
                            : 'No skills found'}
                    </ModalTitle>
                    <EmptyText>
                        {searchQuery || statusFilter
                            ? 'Try adjusting your search or filters'
                            : 'Start adding skills to build your list'}
                    </EmptyText>
                    <AddButton onClick={() => handleOpenModal()}>
                        <PlusIcon /> Add New Skill
                    </AddButton>
                </NoSkills>
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

            <ModalOverlay isOpen={isModalOpen}>
                <Modal>
                    <ModalHeader>
                        <ModalTitle>
                            {editingId ? 'Edit Skill' : 'Add New Skill'}
                        </ModalTitle>
                        <CloseButton onClick={handleCloseModal}>
                            <CloseIconSvg />
                        </CloseButton>
                    </ModalHeader>
                    <InputGroup>
                        <InputLabel>Skill Name</InputLabel>
                        <Input
                            ref={inputRef}
                            type="text"
                            placeholder="Enter skill name"
                            value={newSkill}
                            onChange={(e) => setNewSkill(e.target.value)}
                            onKeyDown={handleKeyPress}
                        />
                    </InputGroup>
                    <InputGroup>
                        <ToggleContainer>
                            <ToggleSwitch>
                                <ToggleInput
                                    type="checkbox"
                                    checked={isDisabled}
                                    onChange={() => setIsDisabled(!isDisabled)}
                                />
                                <ToggleSlider />
                            </ToggleSwitch>
                            <ToggleLabel>
                                {isDisabled ? 'Disabled' : 'Enabled'}
                            </ToggleLabel>
                        </ToggleContainer>
                    </InputGroup>
                    <ModalActions>
                        <CancelButton onClick={handleCloseModal}>
                            Cancel
                        </CancelButton>
                        <SaveButton
                            onClick={handleSaveSkill}
                            disabled={isSaving}
                        >
                            {isSaving
                                ? 'Saving...'
                                : editingId
                                  ? 'Update'
                                  : 'Save'}
                        </SaveButton>
                    </ModalActions>
                </Modal>
            </ModalOverlay>

            <ModalOverlay isOpen={deleteModalOpen}>
                <Modal>
                    <ModalHeader>
                        <ModalTitle>Delete Skill</ModalTitle>
                        <CloseButton onClick={closeDeleteModal}>
                            <CloseIconSvg />
                        </CloseButton>
                    </ModalHeader>
                    <DeleteModalContent>
                        <DeleteIcon>
                            <TrashIcon />
                        </DeleteIcon>
                        <DeleteMessage>
                            Are you sure you want to delete the skill{' '}
                            <strong>{skillToDelete?.name}</strong>? This action
                            cannot be undone.
                        </DeleteMessage>
                        <DeleteButtons>
                            <CancelButton onClick={closeDeleteModal}>
                                Cancel
                            </CancelButton>
                            <DeleteButton
                                onClick={confirmDelete}
                                disabled={isDeleting}
                            >
                                {isDeleting ? 'Deleting...' : 'Delete'}
                            </DeleteButton>
                        </DeleteButtons>
                    </DeleteModalContent>
                </Modal>
            </ModalOverlay>
        </PageContainer>
    )
}

export default SkillsPage
