// components/sidebars/JobListSidebar.tsx
import React from 'react'

interface Job {
    _id: string
    title: string
    postedDate: string
}

interface JobListSidebarProps {
    onJobSelect: (projectId: string) => void
    selectedJobId?: string | null
}

const JobListSidebar: React.FC<JobListSidebarProps> = ({
    onJobSelect,
    selectedJobId,
}) => {
    const jobs: Job[] = [
        {
            _id: '67ddd3b4aca77a44f41d130e',
            title: 'Frontend Developer',
            postedDate: '15/03/2025',
        },
        {
            _id: '67ddd3b4aca77a44f41d130f', // Đảm bảo _id khác nhau
            title: 'Backend Developer',
            postedDate: '14/03/2025',
        },
        {
            _id: '67dd4a85e418388d747bfcaf',
            title: 'UI/UX Designer',
            postedDate: '13/03/2025',
        },
    ]

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
                                    Đăng ngày: {job.postedDate}
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
