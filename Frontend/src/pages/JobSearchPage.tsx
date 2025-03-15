import SingleJobCard from '@/components/cards/SingleJobCard'
import CustomPagination from '@/components/CustomPagination'
import { Job } from '@/interfaces'
import React, { useState } from 'react'

const JobSearchPage: React.FC = () => {
    const [searchQuery, setSearchQuery] = useState({
        position: '',
        location: '',
    })

    const [filters, setFilters] = useState({
        jobType: [] as string[],
        experience: '',
        salaryRange: '',
        datePosted: '',
        remote: false,
        companySize: '',
    })

    const [currentPage, setCurrentPage] = useState<number>(1)
    const totalResults = 397
    const resultsPerPage = 10

    const [jobs] = useState<Job[]>([
        {
            id: 1,
            title: 'Senior React Developer',
            company: 'TechCorp',
            location: 'New York, NY',
            salary: '$100,000 - $120,000',
            type: 'Full Time',
            posted: '2 days ago',
        },
        {
            id: 2,
            title: 'UX/UI Designer',
            company: 'DesignHub',
            location: 'San Francisco, CA',
            salary: '$80,000 - $90,000',
            type: 'Remote',
            posted: '1 week ago',
        },
        {
            id: 3,
            title: 'Software Engineer',
            company: 'SoftPeak',
            location: 'Austin, TX',
            salary: '$90,000 - $110,000',
            type: 'Contract',
            posted: '3 days ago',
        },
    ])

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery({ ...searchQuery, [e.target.name]: e.target.value })
    }

    const handleFilterChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
    ) => {
        const { name, value, type } = e.target
        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked
            if (name === 'jobType') {
                setFilters((prev) => ({
                    ...prev,
                    jobType: checked
                        ? [...prev.jobType, value]
                        : prev.jobType.filter((item) => item !== value),
                }))
            } else if (name === 'remote') {
                setFilters((prev) => ({ ...prev, remote: checked }))
            }
        } else {
            setFilters({ ...filters, [name]: value })
        }
    }

    const filteredJobs = jobs.filter((job) => {
        const matchesPosition =
            !searchQuery.position ||
            job.title.toLowerCase().includes(searchQuery.position.toLowerCase())
        const matchesLocation =
            !searchQuery.location ||
            job.location
                .toLowerCase()
                .includes(searchQuery.location.toLowerCase())
        const matchesJobType =
            filters.jobType.length === 0 || filters.jobType.includes(job.type)
        const matchesExperience =
            !filters.experience ||
            job.title.toLowerCase().includes(filters.experience.toLowerCase())
        const matchesSalary =
            !filters.salaryRange || job.salary.includes(filters.salaryRange)
        const matchesDatePosted =
            !filters.datePosted || job.posted.includes(filters.datePosted)
        const matchesRemote = !filters.remote || job.type === 'Remote'

        return (
            matchesPosition &&
            matchesLocation &&
            matchesJobType &&
            matchesExperience &&
            matchesSalary &&
            matchesDatePosted &&
            matchesRemote
        )
    })

    return (
        <section className="job-search py-5 bg-light pt-5">
            <div className="container pt-5">
                {/* Custom Search Bar */}
                <div className="card mb-5 shadow-lg border-0 rounded-3 mt-3">
                    <div className="card-body p-4">
                        <div className="row g-3 align-items-center">
                            <div className="col-md-7">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-briefcase"></i>
                                    </span>
                                    <input
                                        type="text"
                                        name="position"
                                        value={searchQuery.position}
                                        onChange={handleSearchChange}
                                        className="form-control border-start-0"
                                        placeholder="Job Position (e.g., Software Engineer)"
                                    />
                                </div>
                            </div>
                            <div className="col-md-3">
                                <div className="input-group">
                                    <span className="input-group-text bg-white border-end-0">
                                        <i className="bi bi-geo-alt"></i>
                                    </span>
                                    <input
                                        type="text"
                                        name="location"
                                        value={searchQuery.location}
                                        onChange={handleSearchChange}
                                        className="form-control border-start-0"
                                        placeholder="Location (e.g., New York, NY)"
                                    />
                                </div>
                            </div>
                            <div className="col-md-2">
                                <button className="btn btn-primary w-100 rounded-pill">
                                    <i className="bi bi-search me-2"></i>
                                    Search
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="row">
                    {/* Custom Sidebar Filters */}
                    <div className="col-lg-3 col-md-4 mb-4">
                        <div className="card shadow-sm border-0 rounded-3">
                            <div className="card-header bg-primary text-white rounded-top-3">
                                <h5 className="mb-0 fw-bold">
                                    Refine Your Search
                                </h5>
                            </div>
                            <div className="card-body p-4">
                                <div className="mb-4">
                                    <h6 className="fw-semibold text-dark">
                                        Job Type
                                    </h6>
                                    {[
                                        'Full Time',
                                        'Part Time',
                                        'Contract',
                                        'Internship',
                                        'Remote',
                                    ].map((type) => (
                                        <div
                                            className="form-check mb-2"
                                            key={type}
                                        >
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={type}
                                                name="jobType"
                                                value={type}
                                                onChange={handleFilterChange}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={type}
                                            >
                                                {type}
                                            </label>
                                        </div>
                                    ))}
                                </div>
                                <div className="mb-4">
                                    <h6 className="fw-semibold text-dark">
                                        Experience Level
                                    </h6>
                                    <select
                                        name="experience"
                                        value={filters.experience}
                                        onChange={handleFilterChange}
                                        className="form-select rounded-pill"
                                    >
                                        <option value="">All Levels</option>
                                        <option value="Junior">Junior</option>
                                        <option value="Mid">Mid-Level</option>
                                        <option value="Senior">Senior</option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <h6 className="fw-semibold text-dark">
                                        Salary Range
                                    </h6>
                                    <select
                                        name="salaryRange"
                                        value={filters.salaryRange}
                                        onChange={handleFilterChange}
                                        className="form-select rounded-pill"
                                    >
                                        <option value="">Any Salary</option>
                                        <option value="$20,000 - $30,000">
                                            $20,000 - $30,000
                                        </option>
                                        <option value="$40,000 - $50,000">
                                            $40,000 - $50,000
                                        </option>
                                        <option value="$60,000 - $70,000">
                                            $60,000 - $70,000
                                        </option>
                                        <option value="$80,000 - $90,000">
                                            $80,000 - $90,000
                                        </option>
                                        <option value="$100,000+">
                                            $100,000+
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <h6 className="fw-semibold text-dark">
                                        Date Posted
                                    </h6>
                                    <select
                                        name="datePosted"
                                        value={filters.datePosted}
                                        onChange={handleFilterChange}
                                        className="form-select rounded-pill"
                                    >
                                        <option value="">Any Time</option>
                                        <option value="1 day">
                                            Past 24 Hours
                                        </option>
                                        <option value="3 days">
                                            Past 3 Days
                                        </option>
                                        <option value="1 week">
                                            Past Week
                                        </option>
                                        <option value="1 month">
                                            Past Month
                                        </option>
                                    </select>
                                </div>
                                <div className="mb-4">
                                    <h6 className="fw-semibold text-dark">
                                        Work Arrangement
                                    </h6>
                                    <div className="form-check">
                                        <input
                                            type="checkbox"
                                            className="form-check-input"
                                            id="remote"
                                            name="remote"
                                            checked={filters.remote}
                                            onChange={handleFilterChange}
                                        />
                                        <label
                                            className="form-check-label"
                                            htmlFor="remote"
                                        >
                                            Remote Only
                                        </label>
                                    </div>
                                </div>
                                <div className="mb-0">
                                    <h6 className="fw-semibold text-dark">
                                        Company Size
                                    </h6>
                                    <select
                                        name="companySize"
                                        value={filters.companySize}
                                        onChange={handleFilterChange}
                                        className="form-select rounded-pill"
                                    >
                                        <option value="">Any Size</option>
                                        <option value="1-10">
                                            1-10 Employees
                                        </option>
                                        <option value="11-50">
                                            11-50 Employees
                                        </option>
                                        <option value="51-200">
                                            51-200 Employees
                                        </option>
                                        <option value="201+">
                                            201+ Employees
                                        </option>
                                    </select>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Job Listings */}
                    <div className="col-lg-9 col-md-8 find-job">
                        <div className="card shadow-sm p-3 mb-4 border-0 rounded-3">
                            <p className="text-muted mb-0">
                                Showing {filteredJobs.length} job
                                {filteredJobs.length !== 1 ? 's' : ''} found
                            </p>
                        </div>
                        <div className="row">
                            <div className="single-head">
                                <div className="row">
                                    <div className="col-12 col-lg-12">
                                        {filteredJobs.length > 0 ? (
                                            filteredJobs.map((job) => (
                                                <SingleJobCard
                                                    key={job.id}
                                                    job={job}
                                                />
                                            ))
                                        ) : (
                                            <div className="card p-4 text-center">
                                                <p className="text-muted">
                                                    No jobs match your criteria.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-center mt-4">
                            <CustomPagination
                                currentPage={currentPage}
                                setCurrentPage={setCurrentPage}
                                totalResults={totalResults}
                                resultsPerPage={resultsPerPage}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JobSearchPage
