import React from 'react'
import { Job } from '@/interfaces'
import { Link } from 'react-router-dom'
import { formatDate, formatDeadline, formatSalary } from '@/utils/handleFormat'

interface SingleJobCardProps {
    job: Job
}

const SingleJobCard: React.FC<SingleJobCardProps> = ({ job }) => {
    const getCompanyImage = () => {
        return 'assets/images/jobs/img1.png'
    }

    return (
        <div className="single-job mt-1 wow fadeInUp" data-wow-delay=".3s">
            <div className="row align-items-start g-3 justify-content-around">
                <div className="job-image col-12 col-md-12 col-lg-12">
                    <img
                        src={getCompanyImage()}
                        alt={`${job.employer_id || job.title} logo`}
                        className="img-fluid rounded-circle"
                        style={{ maxWidth: '60px' }}
                    />
                </div>
                <div className="job-content row ps-4 col-12 col-md-12 col-lg-12 ">
                    <div className="col-12 col-lg-8">
                        <h4 className="pb-0 pe-0 text-bold">
                            <Link
                                to={`/jobs/${job._id}`}
                                className="text-dark text-decoration-none d-block text-truncate"
                            >
                                {job.title}
                            </Link>
                        </h4>
                        <p
                            className="text-muted mb-3"
                            style={{
                                display: '-webkit-box',
                                WebkitLineClamp: 2,
                                WebkitBoxOrient: 'vertical',
                                overflow: 'hidden',
                            }}
                        >
                            {job.description ||
                                'We are looking for talented professionals to join our team.'}
                        </p>
                        <ul className="list-unstyled d-flex flex-wrap gap-3">
                            <li className="text-muted text-nowrap">
                                <i className="lni lni-dollar text-primary me-1"></i>
                                {job.salary && job.salary.min
                                    ? formatSalary(
                                          job.salary.min,
                                          job.salary.max,
                                      )
                                    : 'Competitive'}
                            </li>
                            <li className="text-muted text-nowrap">
                                <i className="lni lni-map-marker text-primary me-1"></i>
                                {job.location || 'Remote'}
                            </li>
                            {job.experience && job.experience ? (
                                <li className="text-muted text-nowrap">
                                    <i className="lni lni-briefcase text-primary me-1"></i>
                                    {job.experience} yrs
                                </li>
                            ) : (
                                <li className="text-muted text-nowrap">
                                    <i className="lni lni-briefcase text-primary me-1"></i>
                                    Not required exp
                                </li>
                            )}
                        </ul>
                    </div>
                    <div className="col-12 col-lg-4">
                        <div className="d-flex flex-column h-100">
                            <div className="d-flex flex-column align-items-end gap-2">
                                <Link
                                    to={`/jobs/${job._id}`}
                                    className="btn btn-primary mb-2 px-4 w-100 w-lg-auto"
                                >
                                    Apply
                                </Link>
                                <div className="d-flex flex-wrap gap-1 justify-content-end">
                                    {Array.isArray(job.job_type) &&
                                    job.job_type.length > 0 ? (
                                        job.job_type.map((type, index) => (
                                            <span
                                                key={index}
                                                className="badge bg-light text-dark px-3 py-2 mb-3 ms-1"
                                            >
                                                {type || 'Full-time'}
                                            </span>
                                        ))
                                    ) : (
                                        <span className="badge bg-light text-dark px-3 py-2 mb-3">
                                            Full-time
                                        </span>
                                    )}
                                </div>
                            </div>
                            <div className="mt-auto text-end mb-4">
                                {job.created_at && (
                                    <span className="d-block text-muted small">
                                        <i className="lni lni-calendar text-primary me-1"></i>
                                        Posted {formatDate(job.created_at)}
                                    </span>
                                )}
                                {job.expired_at && (
                                    <span className="d-block text-muted small">
                                        <i className="lni lni-timer text-primary me-1"></i>
                                        {formatDeadline(
                                            job.expired_at.toString(),
                                        )}
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
