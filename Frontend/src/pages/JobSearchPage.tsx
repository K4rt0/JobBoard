import React, { useState, useEffect } from 'react'
import CustomPagination from '@/components/CustomPagination'
import { Job, JobFilters, PaginationInfo } from '@/interfaces'
import JobSearchBar from '@/components/JobSearchBar'
import JobFilterSidebar from '@/components/sidebars/JobFilterSidebar'
import JobList from '@/components/JobList'
import { getJobsPagination } from '@/services/jobSearchService'
import { useLocation } from 'react-router-dom'

const JobSearchPage: React.FC = () => {
    const location = useLocation()

    // Khởi tạo filters, kiểm tra nếu có state từ Home thì sử dụng
    const initialFilters: JobFilters = location.state?.filters || {
        search: '',
        location: '',
        job_type: ['full-time', 'part-time', 'remote', 'internship'], // Bao gồm tất cả job_type có thể
        category_id: '',
        experience: '',
        salary_min: '',
        salary_max: '',
        page: 1,
        limit: 8,
    }

    const [filters, setFilters] = useState<JobFilters>(initialFilters)
    const [jobs, setJobs] = useState<Job[]>([]) // Khởi tạo mặc định là mảng rỗng
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [pagination, setPagination] = useState<PaginationInfo>({
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
    })

    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            setError(null)
            try {
                console.log('Received filters:', filters)
                const response = await getJobsPagination(
                    filters.page || 1,
                    filters.limit || 10,
                    filters,
                )
                const jobsData = Array.isArray(response.data)
                    ? response.data
                    : []
                setJobs(jobsData)
                console.log('Jobs sau khi cập nhật:', jobsData)
                setPagination(
                    response.pagination || {
                        page: 1,
                        limit: 10,
                        total: 0,
                        totalPages: 0,
                    },
                )
            } catch (err) {
                setError('Failed to fetch jobs. Please try again later.')
                console.error(err)
                setJobs([])
            } finally {
                setIsLoading(false)
            }
        }

        fetchJobs()
    }, [filters])

    const handleSearch = (searchQuery: {
        position: string
        location: string
    }) => {
        setFilters({
            ...filters,
            search: searchQuery.position,
            location: searchQuery.location,
            page: 1,
        })
    }

    const handleFilterChange = (newFilters: JobFilters) => {
        setFilters({
            ...filters,
            ...newFilters,
            page: 1,
        })
    }

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
                                Showing {jobs ? jobs.length : 0} job
                                {jobs && jobs.length !== 1 ? 's' : ''} found
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
