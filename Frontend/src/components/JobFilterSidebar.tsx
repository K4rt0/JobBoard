import React from 'react'
import { JobFilters } from '@/interfaces'

interface JobFilterSidebarProps {
    filters: JobFilters
    onChange: (filters: JobFilters) => void
}

const JOB_TYPES = [
    { label: 'Full Time', value: 'full-time' },
    { label: 'Part Time', value: 'part-time' },
    { label: 'Internship', value: 'internship' },
    { label: 'Remote', value: 'remote' },
]

const JobFilterSidebar: React.FC<JobFilterSidebarProps> = ({
    filters,
    onChange,
}) => {
    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target
        let updatedFilters = { ...filters }

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            updatedFilters = {
                ...updatedFilters,
                [name]: checked ? value : '',
            }
        } else {
            updatedFilters = { ...updatedFilters, [name]: value }
        }

        onChange(updatedFilters)
    }

    const handleSalaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        const updatedFilters = {
            ...filters,
            [name]: value ? parseInt(value) : '',
        }
        onChange(updatedFilters)
    }

    return (
        <div className="card shadow-sm border-0 rounded-3">
            <div className="card-header bg-primary text-white rounded-top-3">
                <h5 className="mb-0 fw-bold">Refine Your Search</h5>
            </div>
            <div className="card-body p-4">
                <div className="mb-4">
                    <h6 className="fw-semibold text-dark">Job Type</h6>
                    {JOB_TYPES.map((type) => (
                        <div className="form-check mb-2" key={type.value}>
                            <input
                                type="radio"
                                className="form-check-input"
                                id={type.value}
                                name="job_type"
                                value={type.value}
                                checked={filters.job_type === type.value} // Updated to job_type
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
                    <div className="row">
                        <div className="col-6">
                            <input
                                type="number"
                                name="salary_min"
                                value={filters.salary_min || ''} // Updated to salary_min
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
                                value={filters.salary_max || ''} // Updated to salary_max
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
