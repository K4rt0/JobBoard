import React from 'react'
import { Link } from 'react-router-dom'
const SingleFreelancerCard: React.FC = () => {
    return (
        <div className="single-job wow fadeInUp" data-wow-delay=".3s">
            <div className="job-image">
                <img src="assets/images/jobs/img1.png" alt="#" />
            </div>
            <div className="job-content">
                <div className="user-info">
                    <div className="d-flex justify-content-center align-items-start flex-column mb-1">
                        <Link className="text-dark py-2" to={'/'}>
                            <span className="fs-4 fw-bold">
                                Ngo Thai Hoan{' '}
                                <span>
                                    <i className="fi fi-rr-america"></i>
                                </span>
                            </span>
                        </Link>
                        <small className="user-skill text-muted">
                            LABEL | PACKAGING | 3D Mockups | LOGO | BRANDING
                        </small>
                    </div>
                </div>
                <p>
                    We are looking for Enrollment Advisors who are looking to
                    take 30-35 appointments per week. All leads are
                    pre-scheduled.{' '}
                </p>
                <ul>
                    <li className=" bg-warning text-white">
                        <i className="lni lni-dollar"></i> 20 USD/hr
                    </li>
                    <li>
                        <i className="lni lni-bookmark"></i>
                        <a href="index.html#"> 37 reviews</a>
                    </li>

                    <li>
                        <i className="lni lni-star"></i> 5.0
                    </li>
                </ul>
            </div>
            <div className="job-button">
                <ul>
                    <li>
                        <Link to={'/'}>Hire Me</Link>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SingleFreelancerCard
