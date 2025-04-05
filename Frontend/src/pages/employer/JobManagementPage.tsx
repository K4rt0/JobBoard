// JobManagement.tsx
import React, { useState } from 'react'
import { Job } from '@/interfaces'
import 'bootstrap/dist/css/bootstrap.min.css'
import JobListSidebar from '@/components/sidebars/JobListSidebar'

const JobManagementPage = () => {
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [editedJob, setEditedJob] = useState<Job | null>(null)
    const [jobs, setJobs] = useState<Job[] | null>(null)

    const handleJobSelect = (jobId: string) => {
        const job = jobs?.find((j) => j._id === jobId) || null
        setSelectedJob(job)
        setEditedJob(job ? { ...job } : null)
    }

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        if (!editedJob) return
        const { name, value } = e.target
        setEditedJob({ ...editedJob, [name]: value })
    }

    const handleSave = () => {
        console.log('Saving job:', editedJob)
        if (editedJob) {
            setSelectedJob(editedJob)
            if (jobs) {
                setJobs(
                    jobs.map((job) =>
                        job._id === editedJob._id ? editedJob : job,
                    ),
                )
            }
        }
    }

    const handleJobsLoaded = (loadedJobs: Job[]) => {
        setJobs(loadedJobs)
    }

    return (
        <div
            className=" h-100 section"
            style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}
        >
            <div className="container">
                <div className="row h-100">
                    <div
                        className="col-md-3 p-3"
                        style={{ height: '100vh', overflowY: 'auto' }}
                    >
                        <JobListSidebar
                            onJobSelect={handleJobSelect}
                            selectedJobId={selectedJob?._id}
                            onJobsLoaded={handleJobsLoaded}
                        />
                    </div>

                    <div className="col-md-9 p-3">
                        {selectedJob && editedJob ? (
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h2
                                        className="card-title mb-4 fw-bold"
                                        style={{ color: '#2042e3' }}
                                    >
                                        Edit Job: {selectedJob.title}
                                    </h2>
                                    <form>
                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Title
                                            </label>
                                            <input
                                                type="text"
                                                name="title"
                                                className="form-control"
                                                value={editedJob.title}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Location
                                            </label>
                                            <input
                                                type="text"
                                                name="location"
                                                className="form-control"
                                                value={editedJob.location}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Description
                                            </label>
                                            <textarea
                                                name="description"
                                                className="form-control"
                                                value={editedJob.description}
                                                onChange={handleInputChange}
                                                rows={4}
                                            />
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col">
                                                <label className="form-label fw-semibold">
                                                    Min Salary
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={editedJob.salary.min}
                                                    onChange={(e) =>
                                                        setEditedJob({
                                                            ...editedJob,
                                                            salary: {
                                                                ...editedJob.salary,
                                                                min: Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                            <div className="col">
                                                <label className="form-label fw-semibold">
                                                    Max Salary
                                                </label>
                                                <input
                                                    type="number"
                                                    className="form-control"
                                                    value={editedJob.salary.max}
                                                    onChange={(e) =>
                                                        setEditedJob({
                                                            ...editedJob,
                                                            salary: {
                                                                ...editedJob.salary,
                                                                max: Number(
                                                                    e.target
                                                                        .value,
                                                                ),
                                                            },
                                                        })
                                                    }
                                                />
                                            </div>
                                        </div>

                                        <div className="mb-3">
                                            <label className="form-label fw-semibold">
                                                Experience (years)
                                            </label>
                                            <input
                                                type="number"
                                                name="experience"
                                                className="form-control"
                                                value={editedJob.experience}
                                                onChange={handleInputChange}
                                            />
                                        </div>

                                        <button
                                            type="button"
                                            className="btn btn-primary"
                                            style={{
                                                backgroundColor: '#2042e3',
                                                borderColor: '#2042e3',
                                            }}
                                            onClick={handleSave}
                                        >
                                            Save Changes
                                        </button>
                                    </form>

                                    <div className="mt-4">
                                        <h3 className="fw-semibold">
                                            Additional Details
                                        </h3>
                                        <p>
                                            Status:{' '}
                                            <span className="fw-medium">
                                                {selectedJob.status}
                                            </span>
                                        </p>
                                        <p>
                                            Expires:{' '}
                                            <span className="fw-medium">
                                                {new Date(
                                                    selectedJob.expired_at,
                                                ).toLocaleDateString()}
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <h2 className="text-muted">
                                    Select a job to edit
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobManagementPage
