import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import { useAuth } from '@/hooks/useAuth'
import React, { useState, useEffect } from 'react'
import { fetchJobsByUserWithPagination } from '@/services/jobService'
import { ApplyJob, Pagination } from '@/interfaces'
import CustomPagination from '@/components/CustomPagination'
import { Link } from 'react-router-dom' // Import Link từ react-router-dom

// Thêm CSS inline hoặc trong file CSS riêng
const styles = `
    .manage-applications .job-items .row {
        align-items: center;
        margin-bottom: 1rem;
    }
    .manage-applications .job-items .col-lg-5,
    .manage-applications .job-items .col-lg-2,
    .manage-applications .job-items .col-lg-3 {
        display: flex;
        align-items: center;
        justify-content: flex-start; /* Căn trái cho đồng bộ */
    }
    .manage-applications .job-items .title-img {
        display: flex;
        align-items: center;
        gap: 1rem; /* Khoảng cách giữa logo và thông tin */
    }
    .manage-applications .job-items .title-img .can-img img {
        width: 50px; /* Kích thước logo đồng đều */
        height: 50px;
        object-fit: contain;
    }
    .manage-applications .job-items .title-img h3 {
        margin: 0;
        font-size: 1.1rem; /* Kích thước chữ tiêu đề */
    }
    .manage-applications .job-items .title-img h3 span,
    .manage-applications .job-items .title-img p {
        font-size: 0.9rem; /* Kích thước chữ phụ */
        margin: 0;
    }
    .manage-applications .job-items .time,
    .manage-applications .job-items .badge {
        font-size: 0.9rem; /* Kích thước chữ đồng đều */
    }
    .manage-applications .job-items .col-lg-2,
    .manage-applications .job-items .col-lg-3 {
        justify-content: center; /* Căn giữa nội dung trong các cột nhỏ */
    }
    .manage-applications .job-items .title-img h3 a {
        color: #007bff; /* Màu liên kết */
        text-decoration: none; /* Bỏ gạch chân mặc định */
    }
    .manage-applications .job-items .title-img h3 a:hover {
        text-decoration: underline; /* Gạch chân khi hover */
    }
`

const ManageApplicationPage = () => {
    const { user } = useAuth()
    const [jobs, setJobs] = useState<ApplyJob[]>([])
    const [pagination, setPagination] = useState<Pagination>({
        total: 0,
        current_page: 1,
        total_page: 1,
        limit: 10,
    })
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    const fetchJobs = async (page = 1) => {
        try {
            setLoading(true)
            setError(null)
            const {
                jobs: jobData,
                pagination: paginationData,
            } = // Đã sửa từ "jobs" thành "data" ở lần trước
                await fetchJobsByUserWithPagination({
                    page,
                    limit: 10,
                    sort: 'all',
                    status: 'all',
                    search: '',
                })
            setJobs(jobData)
            setPagination(paginationData)
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to load applications'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchJobs(1)
    }, [])

    const handlePageChange = (page: number) => {
        if (page >= 1 && page <= pagination.total_page) {
            fetchJobs(page)
        }
    }

    // Hàm để lấy class cho tag status
    const getStatusTagClass = (status: string) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return 'badge bg-warning text-dark'
            case 'accepted':
                return 'badge bg-success text-white'
            case 'rejected':
                return 'badge bg-danger text-white'
            case 'finished':
                return 'badge bg-secondary text-white'
            default:
                return 'badge bg-info text-white'
        }
    }

    if (loading) {
        return (
            <div className="manage-applications section">
                <div className="container text-center">
                    <div className="spinner-border text-primary" role="status">
                        <span className="visually-hidden">Loading...</span>
                    </div>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="manage-applications section">
                <div className="container text-center">
                    <p className="text-danger">{error}</p>
                </div>
            </div>
        )
    }

    return (
        <div className="manage-applications section">
            <style>{styles}</style> {/* Thêm CSS inline */}
            <div className="container">
                <div className="alerts-inner">
                    <div className="row">
                        <div className="col-lg-4 col-12">
                            <DashboardSidebar role={user?.role} />
                        </div>
                        <div className="col-lg-8 col-12">
                            <div className="job-items">
                                <h4 className="mb-4 fw-bold border-0">
                                    Application list
                                </h4>
                                {jobs.length === 0 ? (
                                    <div className="text-center py-4">
                                        <p>No application.</p>
                                    </div>
                                ) : (
                                    <>
                                        {/* Tiêu đề cột */}
                                        <div className="row align-items-center justify-content-center text-muted small fw-semibold mb-2">
                                            <div
                                                className="col-lg-5 col-md-5"
                                                style={{ textAlign: 'center' }}
                                            >
                                                Job
                                            </div>
                                            <div className="col-lg-2 col-md-2">
                                                Job type
                                            </div>
                                            <div className="col-lg-2 col-md-2">
                                                Apply date
                                            </div>
                                            <div className="col-lg-3 col-md-3">
                                                Status
                                            </div>
                                        </div>
                                        <hr />
                                        {/* Danh sách đơn */}
                                        {jobs.map((job, index) => (
                                            <div
                                                className="manage-content"
                                                key={job._id || index}
                                            >
                                                <div className="row align-items-center justify-content-center">
                                                    <div className="col-lg-5 col-md-5">
                                                        <div className="title-img">
                                                            <div className="can-img">
                                                                <img
                                                                    src={`/assets/images/jobs/manage-job${
                                                                        (index %
                                                                            6) +
                                                                        1
                                                                    }.png`}
                                                                    alt="#"
                                                                />
                                                            </div>
                                                            <h3>
                                                                {/* Thêm Link để chuyển hướng đến trang chi tiết */}
                                                                <Link
                                                                    to={`/jobs/${job._id}`}
                                                                >
                                                                    {job.title}
                                                                </Link>{' '}
                                                                <span className="my-1">
                                                                    {
                                                                        job
                                                                            .contact
                                                                            .email
                                                                    }
                                                                </span>
                                                                <p className="text-muted small">
                                                                    <i className="lni lni-map-marker"></i>{' '}
                                                                    {
                                                                        job.location
                                                                    }
                                                                </p>
                                                            </h3>
                                                        </div>
                                                    </div>
                                                    <div className="col-lg-2 col-md-2">
                                                        <p>
                                                            <span className="time">
                                                                {
                                                                    job
                                                                        .job_type[0]
                                                                }
                                                            </span>
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-2 col-md-2">
                                                        <p>
                                                            {new Date(
                                                                job.applied_at,
                                                            ).toLocaleDateString(
                                                                'en-US',
                                                                {
                                                                    month: 'short',
                                                                    day: 'numeric',
                                                                    year: 'numeric',
                                                                },
                                                            )}
                                                        </p>
                                                    </div>
                                                    <div className="col-lg-3 col-md-3">
                                                        <span
                                                            className={getStatusTagClass(
                                                                job.status,
                                                            )}
                                                        >
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </>
                                )}
                            </div>
                            <CustomPagination
                                currentPage={pagination.current_page}
                                setCurrentPage={handlePageChange}
                                totalResults={pagination.total}
                                resultsPerPage={pagination.limit}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageApplicationPage
