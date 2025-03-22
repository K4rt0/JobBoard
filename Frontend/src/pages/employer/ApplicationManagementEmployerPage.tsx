// pages/ApplicationManagementEmployer.tsx
import React, { useState, useEffect } from 'react'
import ApplicantList from '@/components/ApplicantList'
import JobListSidebar from '@/components/sidebars/JobListSidebar'
import 'bootstrap/dist/css/bootstrap.min.css'
import { getApplicantByProjectId } from '@/services/employerService'
import { Applicant } from '@/interfaces'

const ApplicationManagementEmployerPage: React.FC = () => {
    const [applicants, setApplicants] = useState<Applicant[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [selectedProjectId, setSelectedProjectId] = useState<string | null>(
        null,
    )

    const loadApplicants = async (projectId: string | null) => {
        if (!projectId) return

        try {
            setLoading(true)
            setError(null)
            const data = await getApplicantByProjectId(projectId)
            setApplicants(data)
        } catch (err) {
            setError('Không thể tải danh sách ứng viên')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (selectedProjectId) {
            loadApplicants(selectedProjectId)
        }
    }, [selectedProjectId])

    const handleJobSelect = (projectId: string) => {
        setSelectedProjectId(projectId) // Cập nhật job được chọn
    }

    return (
        <div
            className="container-fluid p-0"
            style={{ minHeight: '100vh', backgroundColor: '#f5f6fa' }}
        >
            <div className="container pt-5">
                <div className="row m-0 h-100 pt-5 mt-3">
                    <div className="col-md-3 col-lg-2 p-0">
                        <div className="card h-100 border-0 shadow-sm">
                            <div className="card-body p-3">
                                <JobListSidebar
                                    onJobSelect={handleJobSelect}
                                    selectedJobId={selectedProjectId} // Truyền selectedProjectId
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-9 col-lg-10 px-5">
                        <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                                {!selectedProjectId && !loading && (
                                    <div className="alert alert-info text-center py-5">
                                        <i className="bi bi-info-circle me-2"></i>
                                        Please select a job from the list to
                                        view candidates
                                    </div>
                                )}
                                {loading && (
                                    <div className="text-center py-5">
                                        <div
                                            className="spinner-border text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                        <p className="mt-2 text-muted">
                                            Loading data...
                                        </p>
                                    </div>
                                )}
                                {error && (
                                    <div className="alert alert-danger d-flex align-items-center">
                                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                                        {error}
                                    </div>
                                )}
                                {!loading && !error && selectedProjectId && (
                                    <ApplicantList applicants={applicants} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicationManagementEmployerPage
