import React from 'react'

const SingleJobCard: React.FC = () => {
    return (
        <>
            <div className="single-job wow fadeInUp" data-wow-delay=".3s">
                <div className="job-image">
                    <img src="assets/images/jobs/img1.png" alt="#" />
                </div>
                <div className="job-content">
                    <h4>
                        <a href="job-details.html">Software Engineer</a>
                    </h4>
                    <p>
                        We are looking for Enrollment Advisors who are looking
                        to take 30-35 appointments per week. All leads are
                        pre-scheduled.{' '}
                    </p>
                    <ul>
                        <li>
                            <i className="lni lni-website"></i>
                            <a href="index.html#"> winbrans.com</a>
                        </li>
                        <li>
                            <i className="lni lni-dollar"></i> $20k - $25k
                        </li>
                        <li>
                            <i className="lni lni-map-marker"></i> New York
                        </li>
                    </ul>
                </div>
                <div className="job-button">
                    <ul>
                        <li>
                            <a href="job-details.html">Apply</a>
                        </li>
                        <li>
                            <span>full time</span>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SingleJobCard
