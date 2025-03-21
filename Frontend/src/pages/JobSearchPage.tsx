import React, { useState, useEffect } from 'react'
import CustomPagination from '@/components/CustomPagination'
import { Job, JobFilters, PaginationInfo } from '@/interfaces'
import JobSearchBar from '@/components/JobSearchBar'
import JobFilterSidebar from '@/components/JobFilterSidebar'
import JobList from '@/components/JobList'
import { getJobsPagination } from '@/services/jobSearchService'

const JobSearchPage: React.FC = () => {
    // Initialize filters with all possible fields
    const [filters, setFilters] = useState<JobFilters>({
        search: '',
        location: '',
        job_type: [],
        experience: '',
        salary_min: '',
        salary_max: '',
        page: 1,
        limit: 8,
    })

    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })

    // Fetch jobs when filters change
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await getJobsPagination(
                    filters.page || 1,
                    filters.limit || 10,
                    filters,
                )
                setJobs(response.data.data)
                setPagination(response.data.pagination)
            } catch (err) {
                setError('Failed to fetch jobs. Please try again later.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchJobs()
    }, [filters])

    // Handle search bar updates
    const handleSearch = (searchQuery: {
        position: string
        location: string
    }) => {
        setFilters({
            ...filters,
            search: searchQuery.position,
            location: searchQuery.location,
            page: 1, // Reset to first page when searching
        })
    }

    // Handle filter sidebar updates
    const handleFilterChange = (newFilters: JobFilters) => {
        setFilters({
            ...filters,
            ...newFilters,
            page: 1, // Reset to first page when filters change
        })
    }

    // Handle page change
    const handlePageChange = (page: number) => {
        setFilters({
            ...filters,
            page,
        })
    }

    return (
        <section className="job-search py-5 bg-light pt-5">
            <div className="container pt-5">
                <JobSearchBar
                    searchQuery={{
                        position: filters.search || '',
                        location: filters.location || '',
                    }}
                    onSearch={handleSearch}
                />

                <div className="row">
                    <div className="col-lg-3 col-md-4 mb-4">
                        <JobFilterSidebar
                            filters={filters}
                            onChange={handleFilterChange}
                        />
                    </div>

                    <div className="col-lg-9 col-md-8 find-job">
                        <div className="card shadow-sm p-3 mb-4 border-0 rounded-3">
                            <p className="text-muted mb-0">
                                Showing {jobs.length} job
                                {jobs.length !== 1 ? 's' : ''} found
                                {isLoading && ' (Loading...)'}
                            </p>
                        </div>

                        {error && (
                            <div className="alert alert-danger" role="alert">
                                {error}
                            </div>
                        )}

                        <JobList jobs={jobs} isLoading={isLoading} />

                        <div className="d-flex justify-content-center align-items-center mt-4">
                            <CustomPagination
                                currentPage={filters.page || 1}
                                setCurrentPage={handlePageChange}
                                totalResults={pagination.total}
                                resultsPerPage={pagination.limit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default JobSearchPage
