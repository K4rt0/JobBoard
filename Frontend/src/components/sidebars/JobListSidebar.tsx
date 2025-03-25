// components/sidebars/JobListSidebar.tsx
import { Job } from '@/interfaces'
import { fetchJobsByEmployer } from '@/services/employerService'
import React, { useState, useEffect } from 'react'
import { useAuth } from '@/hooks/useAuth'

interface JobListSidebarProps {
    onJobSelect: (projectId: string) => void
    selectedJobId?: string | null
    onJobsLoaded?: (jobs: Job[]) => void // Thêm prop để truyền jobs lên parent
}

const JobListSidebar: React.FC<JobListSidebarProps> = ({
    onJobSelect,
    selectedJobId,
    onJobsLoaded,
}) => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [error, setError] = useState<string | null>(null)
    const { user } = useAuth()

    useEffect(() => {
        const getJobs = async () => {
            try {
                setError(null)
                if (user?.id) {
                    const jobData = await fetchJobsByEmployer(user.id)
                    setJobs(jobData)
                    if (onJobsLoaded) {
                        onJobsLoaded(jobData) // Gọi callback để truyền jobs lên parent
                    }
                }
            } catch (err) {
                const errorMessage =
                    err instanceof Error ? err.message : 'Failed to load jobs'
                setError(errorMessage)
            }
        }

        getJobs()
    }, [user, onJobsLoaded])

    if (error) {
        return (
            <div className="d-flex flex-column h-100 justify-content-center align-items-center">
                <p className="text-danger">{error}</p>
            </div>
        )
    }

    return (
        <div className="card shadow-sm border-0 h-100">
            <div className="card-body p-3">
                <h4
                    className="text-center mb-4 fw-bold"
                    style={{ color: '#2042e3' }}
                >
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
                            style={{
                                cursor: 'pointer',
                                backgroundColor:
                                    selectedJobId === job._id
                                        ? '#2042e3'
                                        : '#fff',
                                color:
                                    selectedJobId === job._id ? '#fff' : '#000',
                                padding: '10px',
                            }}
                            onMouseOver={(e) =>
                                selectedJobId !== job._id &&
                                (e.currentTarget.style.backgroundColor =
                                    '#e6f0ff')
                            }
                            onMouseOut={(e) =>
                                selectedJobId !== job._id &&
                                (e.currentTarget.style.backgroundColor = '#fff')
                            }
                        >
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <h6
                                        className="mb-1 fw-semibold"
                                        style={{
                                            color:
                                                selectedJobId === job._id
                                                    ? '#fff'
                                                    : '#000',
                                        }}
                                    >
                                        {job.title}
                                    </h6>
                                    <small
                                        style={{
                                            color:
                                                selectedJobId === job._id
                                                    ? '#d1e7ff'
                                                    : '#6c757d',
                                        }}
                                    >
                                        Posted on:{' '}
                                        {new Date(
                                            job.created_at,
                                        ).toLocaleDateString('en-US')}
                                    </small>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default JobListSidebar
