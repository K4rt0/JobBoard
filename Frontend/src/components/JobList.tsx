// components/JobList.tsx
import { Job } from '@/interfaces'
import React from 'react'
import SingleJobCard from './cards/SingleJobCard'

interface JobListProps {
    jobs: Job[]
    isLoading: boolean
}

const JobList: React.FC<JobListProps> = ({ jobs, isLoading }) => {
    if (isLoading) {
        return (
            <div className="text-center p-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
            </div>
        )
    }

    if (jobs.length === 0) {
        return (
            <div className="card p-4 text-center">
                <p className="text-muted">No jobs match your criteria.</p>
            </div>
        )
    }

    return (
        <div className="row">
            <div className="single-head">
                <div className="row">
                    <div className="col-12 col-lg-12">
                        {jobs.map((job) => (
                            <SingleJobCard key={job._id} job={job} />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default JobList
