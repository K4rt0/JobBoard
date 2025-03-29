import React from 'react'
import { Job } from '@/interfaces'
import { Link } from 'react-router-dom'
import { Heart } from 'react-bootstrap-icons'

// Thêm CSS inline hoặc trong file CSS riêng
const styles = `
    .mini-job-card {
        transition: all 0.3s ease;
        background-color: #fff; /* Đặt màu nền mặc định */
    }
    .mini-job-card:hover {
        transform: translateY(-5px);
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
        background-color: #f8f9fa !important; /* Đảm bảo màu nền khi hover */
        .footer {
            background-color: #f8f9fa !important;
        }
    }
    .mini-job-card .company-logo img {
        width: 40px;
        height: 40px;
        object-fit: contain;
        border-radius: 50%;
        border: 1px solid #e0e0e0;
    }
    .mini-job-card .title-container {
        display: flex;
        align-items: center;
        gap: 0.75rem; /* Khoảng cách giữa logo và tiêu đề */
        width: 100%;
    }
    .mini-job-card .job-title {
        font-size: 1.1rem;
        font-weight: 600;
        margin-bottom: 0;
        white-space: nowrap; /* Ngăn xuống dòng */
        overflow: hidden; /* Ẩn phần vượt quá */
        text-overflow: ellipsis; /* Hiển thị dấu ... */
        max-width: calc(100% - 50px); /* Giới hạn chiều rộng, trừ đi khoảng cách cho logo */
    }
    .mini-job-card .job-title a {
        color: #212529;
        text-decoration: none;
    }
    .mini-job-card .job-title a:hover {
        color: #007bff;
        text-decoration: underline;
    }
    .mini-job-card .tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin-bottom: 0.5rem;
    }
    .mini-job-card .tags .badge {
        font-size: 0.85rem;
        padding: 0.3rem 0.6rem;
        border-radius: 12px;
        flex: 1; /* Các thẻ có kích thước bằng nhau */
        text-align: center; /* Căn giữa nội dung trong thẻ */
        min-width: 80px; /* Đảm bảo kích thước tối thiểu */
        max-width: 100px; /* Giới hạn kích thước tối đa */
        white-space: nowrap; /* Ngăn xuống dòng */
        overflow: hidden; /* Ẩn phần vượt quá */
        text-overflow: ellipsis; /* Hiển thị dấu ... */
    }
    .mini-job-card .footer {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .mini-job-card .posted-date {
        font-size: 0.85rem;
        color: #6c757d;
    }
    .mini-job-card .posted-date i {
        font-size: 1rem;
        vertical-align: middle;
    }
    .mini-job-card .heart-btn {
        font-size: 0.85rem;
    }
`

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
        <div className="card h-100 border-0 p-3 mini-job-card d-flex flex-column gap-2">
            <style>{styles}</style> {/* Thêm CSS inline */}
            {/* Tiêu đề và logo công ty */}
            <div className="title-container mb-1 border-bottom pb-2">
                {/* Logo công ty */}
                <div className="company-logo">
                    <img
                        src={`/assets/images/jobs/manage-job4.png`}
                        alt={job.slug || 'Company'}
                    />
                </div>
                <div className="w-100">
                    <h5 className="job-title mb-0">
                        <Link to={`/jobs/${job._id}`}>{job.title}</Link>
                    </h5>
                </div>
            </div>
            {/* Địa điểm và lương dưới dạng tag */}
            <div className="tags">
                <span
                    className="badge bg-light text-dark border border-secondary-subtle"
                    style={{ minWidth: '10rem' }}
                >
                    {job.location || 'Remote'}
                </span>
                <span className="badge bg-light text-success border border-secondary-subtle">
                    {job.salary && job.salary.min
                        ? formatSalary(job.salary.min, job.salary.max)
                        : 'Competitive'}
                </span>
            </div>
            {/* Footer: Ngày đăng và nút Heart */}
            {job.created_at && (
                <div className="footer">
                    <div className="posted-date d-flex align-items-center">
                        <i className="lni lni-calendar me-1 text-primary"></i>
                        Posted {formatDate(job.created_at)}
                    </div>
                    <button className="btn btn-link heart-btn rounded-circle border border-success">
                        <Heart size={14} className="text-success" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default MiniJobCard
