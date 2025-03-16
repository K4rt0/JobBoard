import { Job } from '@/interfaces'
import React from 'react'

interface SingleJobCardProps {
    job: Job
}

const SingleJobCard: React.FC<SingleJobCardProps> = ({ job }) => {
    return (
        <div className="single-job mt-1 wow fadeInUp" data-wow-delay=".3s">
            <div className="job-image">
                <img
                    src={job.companyLogo || 'assets/images/jobs/img1.png'}
                    alt={`${job.company} logo`}
                />
            </div>
            <div className="job-content">
                <h4>
                    <a href="job-details.html">{job.title}</a>
                </h4>
                <p>
                    {job.description ||
                        'We are looking for talented professionals to join our team.'}
                </p>
                <ul>
                    <li>
                        <i className="lni lni-website"></i>
                        <a href={job.companyWebsite || '#'}>
                            {job.companyWebsite?.split('/')[2] ||
                                `${job.company.toLowerCase()}.com`}
                        </a>
                    </li>
                    <li>
                        <i className="lni lni-dollar"></i> {job.salary}
                    </li>
                    <li>
                        <i className="lni lni-map-marker"></i> {job.location}
                    </li>
                </ul>
            </div>
            <div className="job-button">
                <ul>
                    <li>
                        <a href="job-details.html">Apply</a>
                    </li>
                    <li>
                        <span>{job.type.toLowerCase()}</span>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default SingleJobCard
