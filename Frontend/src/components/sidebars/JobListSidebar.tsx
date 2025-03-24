// components/sidebars/JobListSidebar.tsx
import { Job } from '@/interfaces'
import { fetchJobsByUser } from '@/services/jobService'
import React, { useState, useEffect } from 'react'

interface JobListSidebarProps {
    onJobSelect: (projectId: string) => void
    selectedJobId?: string | null
}

const JobListSidebar: React.FC<JobListSidebarProps> = ({
    onJobSelect,
    selectedJobId,
}) => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const getJobs = async () => {
            try {
                setLoading(true)
                setError(null)
                const jobData = await fetchJobsByUser()
                setJobs(jobData)
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Failed to load jobs'
                setError(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        getJobs()
    }, [])

    if (loading) {
        return (
            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                <p className="text-danger">{error}</p>
            </div>
        )
    }

    return (
        <div className="d-flex flex-column h-100">
            <h4 className="text-center mb-4 fw-bold text-primary">
                Job Post List
            </h4>
            <div className="list-group flex-grow-1 overflow-auto">
                {jobs.map((job) => (
                    <div
                        key={job._id}
                        className={`list-group-item list-group-item-action border-0 mb-2 rounded ${
                            selectedJobId === job._id ? 'active' : ''
                        }`}
                        onClick={() => onJobSelect(job._id)}
                        style={{ cursor: 'pointer' }}
                    >
                        <div className="d-flex justify-content-between align-items-center">
                            <div>
                                <h6 className="mb-1 fw-semibold">
                                    {job.title}
                                </h6>
                                <small className="text-muted">
                                    Đăng ngày:{' '}
                                    {new Date(
                                        job.created_at,
                                    ).toLocaleDateString('vi-VN')}
                                </small>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default JobListSidebar
