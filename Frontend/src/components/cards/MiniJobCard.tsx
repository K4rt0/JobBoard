import React from 'react'
import { Job } from '@/interfaces'
import { Link } from 'react-router-dom'
import { Heart } from 'react-bootstrap-icons'

interface MiniJobCardProps {
    job: Job
}

const MiniJobCard: React.FC<MiniJobCardProps> = ({ job }) => {
    // Hàm định dạng ngày đăng
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays}d ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)}w ago`
        return `${Math.floor(diffDays / 30)}m ago`
    }

    // Hàm định dạng lương (rút gọn)
    const formatSalary = (min: number, max: string) => {
        const minInMillions = min / 1_000_000 // Chuyển từ số tiền sang triệu
        const maxInMillions = parseFloat(max) / 1_000_000
        return `${minInMillions} - ${maxInMillions} triệu`
    }

    return (
        <div
            className="card h-100 shadow-sm border-0 p-3 single-job d-flex flex-column gap-2 hover-shadow-lg hover-bg-light wow fadeInUp"
            data-wow-delay=".4s"
            style={{ cursor: 'pointer' }}
        >
            {/* Tiêu đề và nút heart */}
            <div className="d-flex justify-content-between align-items-start mb-1 border-bottom pb-2">
                <div className="w-75">
                    <h5 className="card-title mb-0 fs-5 fw-bold text-dark text-wrap">
                        <Link
                            to={`/jobs/${job._id}`}
                            className="text-decoration-none text-dark hover-text-primary"
                        >
                            {job.title}
                        </Link>
                    </h5>
                </div>
                <button className="btn btn-link ms-1 rounded-circle border border-success">
                    <Heart size={14} className="text-success" />
                </button>
            </div>
            {/* Job type, địa điểm, và lương dưới dạng tag */}
            <div className="d-flex flex-wrap gap-2 mb-1">
                <span className="badge bg-light text-dark border border-secondary-subtle px-2 py-1 small">
                    {Array.isArray(job.job_type) && job.job_type.length > 0
                        ? job.job_type[0]
                        : 'Full-time'}
                </span>
                <span className="badge bg-light text-dark border border-secondary-subtle px-2 py-1 small">
                    {job.location || 'Remote'}
                </span>
                <span className="badge bg-light text-success border border-secondary-subtle px-2 py-1 small">
                    {job.salary && job.salary.min
                        ? formatSalary(job.salary.min, job.salary.max)
                        : 'Competitive'}
                </span>
            </div>
            {/* Ngày đăng */}
            {job.created_at && (
                <div className="text-secondary small">
                    <i className="lni lni-calendar fs-6 me-1 text-primary"></i>
                    Posted {formatDate(job.created_at)}
                </div>
            )}
        </div>
    )
}

export default MiniJobCard
