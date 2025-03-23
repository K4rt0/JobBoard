import React, { useState, useEffect } from 'react'
import { Category, JobFilters, JobType } from '@/interfaces'
import { Card } from 'react-bootstrap'
import { getCategories } from '@/services/categoryService'

interface JobFilterSidebarProps {
    filters: JobFilters
    onChange: (filters: JobFilters) => void
}

const JOB_TYPES: JobType[] = [
    { label: 'Full Time', value: 'full-time' },
    { label: 'Part Time', value: 'part-time' },
    { label: 'Internship', value: 'internship' },
    { label: 'Remote', value: 'remote' },
]

const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({
    filters,
    onChange,
}) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const fetchCategories = async (): Promise<void> => {
            try {
                setLoading(true)
                setError(null)
                const data = await getCategories()
                setCategories(data)
            } catch (error) {
                const errorMessage =
                    error instanceof Error
                        ? error.message
                        : 'Unknown error occurred'
                console.error('Error fetching categories:', errorMessage)
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }
        fetchCategories()
    }, [])

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ): void => {
        const { name, value, type } = e.target

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            if (name === 'job_type') {
                const currentJobTypes = filters.job_type || []
                let updatedJobTypes: string[]
                if (checked) {
                    updatedJobTypes = [...currentJobTypes, value]
                } else {
                    updatedJobTypes = currentJobTypes.filter(
                        (type) => type !== value,
                    )
                }
                const updatedFilters: JobFilters = {
                    ...filters,
                    job_type: updatedJobTypes,
                }
                onChange(updatedFilters)
            }
        } else {
            const updatedFilters: JobFilters = {
                ...filters,
                [name]: value === '' ? undefined : value,
            }
            onChange(updatedFilters)
        }
    }

    const handleCategoryChange = (
        e: React.ChangeEvent<HTMLSelectElement>,
    ): void => {
        const { value } = e.target
        const updatedFilters: JobFilters = {
            ...filters,
            category_id: value === '' ? undefined : value,
            page: 1,
        }
        onChange(updatedFilters)
    }

    const handleSalaryChange = (
        e: React.ChangeEvent<HTMLInputElement>,
    ): void => {
        const { name, value } = e.target
        const updatedFilters: JobFilters = {
            ...filters,
            [name]: value ? parseInt(value, 10) : undefined,
        }
        onChange(updatedFilters)
    }

    const clearAllFilters = (): void => {
        onChange({
            search: filters.search,
            location: filters.location,
            page: filters.page,
            limit: filters.limit,
            job_type: [],
            category_id: undefined,
            experience: undefined,
            salary_min: undefined,
            salary_max: undefined,
        })
    }

    return (
        <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-primary text-white rounded-top-3 d-flex justify-content-between align-items-center">
                <h5 className="mb-0 fw-bold">Filter Search</h5>
                <button
                    type="button"
                    className="btn btn-sm btn-outline-light"
                    onClick={clearAllFilters}
                >
                    Clear All
                </button>
            </div>
            <div className="card-body p-4">
                <div className="mb-4">
                    <h6 className="fw-semibold text-dark">Category</h6>
                    {loading ? (
                        <div className="text-center py-2">
                            <div
                                className="spinner-border spinner-border-sm text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                        </div>
                    ) : error ? (
                        <div className="alert alert-warning py-2 small">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}. Using fallback data.
                        </div>
                    ) : (
                        <select
                            className="form-select rounded-pill"
                            name="category_id"
                            value={filters.category_id || ''}
                            onChange={handleCategoryChange}
                        >
                            <option value="">All Categories</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    )}
                </div>

                <div className="mb-4">
                    <h6 className="fw-semibold text-dark">Job Type</h6>
                    {JOB_TYPES.map((type) => (
                        <div className="form-check mb-2" key={type.value}>
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id={type.value}
                                name="job_type"
                                value={type.value}
                                checked={(filters.job_type || []).includes(
                                    type.value,
                                )}
                                onChange={handleFilterChange}
                            />
                            <label
                                className="form-check-label"
                                htmlFor={type.value}
                            >
                                {type.label}
                            </label>
                        </div>
                    ))}
                </div>

                <div className="mb-4">
                    <h6 className="fw-semibold text-dark">
                        Experience (Years)
                    </h6>
                    <input
                        type="number"
                        name="experience"
                        value={filters.experience || ''}
                        onChange={handleFilterChange}
                        className="form-control rounded-pill"
                        placeholder="Enter years of experience"
                        min="0"
                    />
                </div>

                <div className="mb-4">
                    <h6 className="fw-semibold text-dark">Salary Range</h6>
                    <div className="row g-2">
                        <div className="col-6">
                            <input
                                type="number"
                                name="salary_min"
                                value={filters.salary_min || ''}
                                onChange={handleSalaryChange}
                                className="form-control rounded-pill"
                                placeholder="Min Salary"
                                min="0"
                            />
                        </div>
                        <div className="col-6">
                            <input
                                type="number"
                                name="salary_max"
                                value={filters.salary_max || ''}
                                onChange={handleSalaryChange}
                                className="form-control rounded-pill"
                                placeholder="Max Salary"
                                min="0"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobFilterSidebar
