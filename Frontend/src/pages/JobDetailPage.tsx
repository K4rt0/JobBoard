import React, { useState, useEffect } from 'react'
import { Button, Form, InputGroup } from 'react-bootstrap'
import { useNavigate, useParams } from 'react-router-dom'
import { ApiResponse, Job, Skill } from '@/interfaces'
import { getJobByProjectId } from '@/services/jobSearchService'
import { applyJob } from '@/services/jobService'

const JobDetailPage = () => {
    const [job, setJob] = useState<Job | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    const { jobId } = useParams<{ jobId: string }>()
    useEffect(() => {
        const fetchJob = async () => {
            setIsLoading(true)
            setError(null)
            try {
                if (!jobId) {
                    throw new Error('Job ID is not provided')
                }

                // Fetch job data (skills are already fetched in getJobByProjectId)
                const jobData = await getJobByProjectId(jobId)
                setJob(jobData)
            } catch (err) {
                setError('Failed to fetch job details. Please try again later.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchJob()
    }, [jobId])

    if (isLoading) {
        return <div>Loading...</div>
    }

    if (error || !job) {
        return <div>{error || 'No job data available.'}</div>
    }

    const handleApplyJob = async () => {
        try {
            if (!jobId) {
                throw new Error('Job ID is not provided')
            }

            const applySuccess = await applyJob(jobId)
            if (applySuccess) {
                navigate('/profile')
            }
        } catch (err) {
            setError('Failed to apply job. Please try again later.')
        } finally {
            setIsLoading(false)
        }
    }
    return (
        <div className="job-details section">
            <div className="container">
                <div className="row mb-n5">
                    {/* Job List Details Start */}
                    <div className="col-lg-8 col-12">
                        <div className="job-details-inner">
                            <div className="job-details-head row mx-0">
                                <div className="company-logo col-auto">
                                    <a
                                        href="job-details.html#"
                                        style={{
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src="assets/images/universal-image/job-details.png"
                                            alt="Company Logo"
                                        />
                                    </a>
                                </div>
                                <div className="salary-type col-auto order-sm-3">
                                    <span className="salary-range">
                                        ${job.salary.min} - ${job.salary.max}
                                    </span>
                                    <div>
                                        {job.job_type &&
                                            job.job_type.map((type, index) => (
                                                <span
                                                    key={index}
                                                    className="badge badge-success me-2 mb-2"
                                                >
                                                    {type
                                                        .split('-')
                                                        .map(
                                                            (word) =>
                                                                word
                                                                    .charAt(0)
                                                                    .toUpperCase() +
                                                                word.slice(1),
                                                        )
                                                        .join(' ')}
                                                </span>
                                            ))}
                                    </div>
                                </div>
                                <div className="content col">
                                    <h5 className="title">{job.title}</h5>
                                    <ul className="meta">
                                        <li>
                                            <i className="lni lni-map-marker"></i>{' '}
                                            {job.location}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="job-details-body">
                                <h6 className="mb-3 mt-4">Required Skills</h6>
                                <div className="skills-list">
                                    {job.skills.length > 0 ? (
                                        job.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="badge badge-primary text-white bg-primary mr-2 mb-2"
                                            >
                                                {skill.name}
                                            </span>
                                        ))
                                    ) : (
                                        <p>No skills specified</p>
                                    )}
                                </div>

                                <h6 className="mb-3 mt-4">Requirements</h6>
                                <ul className="list-unstyled">
                                    {job.requirements.map((req, index) => (
                                        <li key={index}>{req}</li>
                                    ))}
                                </ul>

                                <h6 className="mb-3 mt-4">Benefits</h6>

                                <ul className="list-unstyled">
                                    {job.benefits.map((benefit, index) => (
                                        <li key={index}>{benefit}</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* Job List Details End */}

                    {/* Job Sidebar Wrap Start */}
                    <div className="col-lg-4 col-12">
                        <div className="job-details-sidebar">
                            {/* Sidebar (Apply Buttons) Start */}
                            <div className="sidebar-widget">
                                <div className="inner">
                                    <div className="row m-n2 button">
                                        <div className="col-xl-auto col-lg-12 col-sm-auto col-12 p-2">
                                            <a
                                                href="bookmarked.html"
                                                className="d-block btn"
                                            >
                                                <i className="fa fa-heart-o mr-1"></i>{' '}
                                                Save Job
                                            </a>
                                        </div>
                                        <div className="col-xl-auto col-lg-12 col-sm-auto col-12 p-2">
                                            <button
                                                onClick={handleApplyJob}
                                                className="d-block btn btn-alt"
                                            >
                                                Apply Now
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Sidebar (Apply Buttons) End */}
                            {/* Sidebar (Job Overview) Start */}
                            <div className="sidebar-widget">
                                <div className="inner">
                                    <h6 className="title">Job Overview</h6>
                                    <ul className="job-overview list-unstyled">
                                        <li>
                                            <strong>Published on:</strong>{' '}
                                            {new Date(
                                                job.created_at,
                                            ).toLocaleDateString()}
                                        </li>
                                        <li>
                                            <strong>Vacancy:</strong>{' '}
                                            {job.quantity}
                                        </li>
                                        <li>
                                            <strong>Employment Status:</strong>{' '}
                                            {job.job_type
                                                ? job.job_type
                                                      .map((type) =>
                                                          type
                                                              .split('-')
                                                              .map(
                                                                  (word) =>
                                                                      word
                                                                          .charAt(
                                                                              0,
                                                                          )
                                                                          .toUpperCase() +
                                                                      word.slice(
                                                                          1,
                                                                      ),
                                                              )
                                                              .join(' '),
                                                      )
                                                      .join(' / ') // Joining multiple job types with a separator (e.g., 'full-time / internship')
                                                : 'Full-time'}
                                        </li>
                                        <li>
                                            <strong>Experience:</strong>{' '}
                                            {job.experience} year(s)
                                        </li>
                                        <li>
                                            <strong>Job Location:</strong>{' '}
                                            {job.location}
                                        </li>
                                        <li>
                                            <strong>Salary:</strong> $
                                            {job.salary.min} - ${job.salary.max}
                                        </li>
                                        <li>
                                            <strong>Gender:</strong>{' '}
                                            {job.gender}
                                        </li>
                                        <li>
                                            <strong>
                                                Application Deadline:
                                            </strong>{' '}
                                            {new Date(
                                                parseInt(job.expiry_date),
                                            ).toLocaleDateString()}
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Sidebar (Job Overview) End */}
                            {/* Sidebar (Contact Information) Start */}
                            <div className="sidebar-widget">
                                <div className="inner">
                                    <h6 className="title">
                                        Contact Information
                                    </h6>
                                    <ul className="job-overview list-unstyled">
                                        <li>
                                            <strong>Contact Name:</strong>{' '}
                                            {job.contact.full_name}
                                        </li>
                                        <li>
                                            <strong>Email:</strong>{' '}
                                            <a
                                                href={`mailto:${job.contact.email}`}
                                            >
                                                {job.contact.email}
                                            </a>
                                        </li>
                                        <li>
                                            <strong>Phone:</strong>{' '}
                                            <a
                                                href={`tel:${job.contact.phone_number}`}
                                            >
                                                {job.contact.phone_number}
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* Sidebar (Contact Information) End */}
                        </div>
                    </div>
                    {/* Job Sidebar Wrap End */}
                </div>
            </div>
        </div>
    )
}

export default JobDetailPage
