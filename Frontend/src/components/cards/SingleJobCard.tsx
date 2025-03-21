import React from 'react'
import { Job } from '@/interfaces'
import { Link } from 'react-router-dom'

interface SingleJobCardProps {
    job: Job
}

const SingleJobCard: React.FC<SingleJobCardProps> = ({ job }) => {
    const formatDate = (timestamp: number) => {
        const date = new Date(timestamp)
        const now = new Date()
        const diffTime = Math.abs(now.getTime() - date.getTime())
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

        if (diffDays === 0) return 'Today'
        if (diffDays === 1) return 'Yesterday'
        if (diffDays < 7) return `${diffDays} days ago`
        if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
        return `${Math.floor(diffDays / 30)} months ago`
    }

    const formatDeadline = (dateString: string) => {
        try {
            const date = new Date(dateString)
            const now = new Date()
            if (isNaN(date.getTime())) throw new Error('Invalid date')

            if (date < now) return 'Expired'

            const diffTime = Math.abs(date.getTime() - now.getTime())
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

            if (diffDays === 0) return 'Expires today'
            if (diffDays === 1) return 'Expires tomorrow'
            if (diffDays < 7) return `${diffDays} days left`
            if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks left`
            return `Until ${date.toLocaleDateString()}`
        } catch (e) {
            return 'No deadline specified'
        }
    }

    const formatSalary = (min: number, max: string) => {
        return `$${min.toLocaleString()} - $${parseFloat(max).toLocaleString()}`
    }

    const getCompanyImage = () => {
        return 'assets/images/jobs/img1.png'
    }

    return (
        <div className="single-job mt-1 wow fadeInUp" data-wow-delay=".3s">
            <div className="row align-items-start">
                <div className="job-image">
                    <img
                        src={getCompanyImage()}
                        alt={`${job.employer_id || job.title} logo`}
                        className="img-fluid rounded-circle"
                    />
                </div>
                <div className="job-content row ps-4">
                    <div className="col-8">
                        <h4 className="pb-0">
                            <Link
                                to={`/jobs/${job.slug || job._id}`}
                                className="text-dark text-decoration-none"
                            >
                                {job.title}
                            </Link>
                        </h4>
                        <p className="text-muted mb-3">
                            {job.description ||
                                'We are looking for talented professionals to join our team.'}
                        </p>
                        <ul className="list-unstyled d-flex flex-wrap gap-3">
                            <li className="text-muted">
                                <i className="lni lni-dollar text-primary me-1"></i>
                                {job.salary && job.salary.min
                                    ? formatSalary(
                                          job.salary.min,
                                          job.salary.max,
                                      )
                                    : 'Competitive salary'}
                            </li>
                            <li className="text-muted">
                                <i className="lni lni-map-marker text-primary me-1"></i>
                                {job.location || 'Remote'}
                            </li>
                            {job.experience && (
                                <li className="text-muted">
                                    <i className="lni lni-briefcase text-primary me-1"></i>
                                    {job.experience} years experience
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="col-4">
                        <div className="d-flex flex-column h-100">
                            <div className="d-flex flex-column align-items-end">
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="btn btn-primary mb-2 px-4"
                                >
                                    Apply
                                </Link>
                                <span className="badge bg-light text-dark px-3 py-2 mb-3">
                                    {job.job_type?.toLowerCase() || 'Full-time'}
                                </span>
                            </div>
                            <div className="mt-auto text-end">
                                {job.created_at && (
                                    <span className="d-block text-muted small">
                                        <i className="lni lni-calendar text-primary me-1"></i>
                                        Posted {formatDate(job.created_at)}
                                    </span>
                                )}
                                {job.expiry_date && (
                                    <span className="d-block text-muted small">
                                        <i className="lni lni-timer text-primary me-1"></i>
                                        {formatDeadline(job.expiry_date)}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SingleJobCard
