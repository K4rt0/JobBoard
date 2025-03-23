// components/ApplicantList.tsx
import { Applicant } from '@/interfaces'
import React, { useState } from 'react'

interface ApplicantListProps {
    applicants?: Applicant[]
}

const ApplicantList: React.FC<ApplicantListProps> = ({ applicants }) => {
    const defaultApplicants: Applicant[] = [
        {
            _id: '67dc1b86f4505b8d9901dadb',
            applied_at: 1742591071746,
            status: 'pending',
            expired_at: '',
            user: {
                _id: '67dc1b86f4505b8d9901dadb',
                full_name: 'Dương Khoa Nam',
                email: 'admin@gmail.com',
                phone_number: '',
                birth_date: null,
                role: 'Freelancer',
                avatar: {
                    url: '',
                    delete_hash: '',
                },
                bio: null,
                education: null,
                experience: '0',
                cv_url: 'https://facebook.com/',
                skills: [],
                socials: [],
                status: '',
                created_at: undefined,
                updated_at: undefined,
            },
        },
    ]

    const [applicantData, setApplicantData] = useState<Applicant[]>(
        applicants || defaultApplicants,
    )

    // Hàm chuyển đổi timestamp sang định dạng ngày
    const formatDate = (timestamp: number | null): string => {
        if (!timestamp) return 'N/A'
        return new Date(timestamp).toLocaleDateString('vi-VN')
    }

    // Hàm xử lý duyệt applicant
    const handleApprove = (applicantId: string) => {
        // Cập nhật trạng thái trong state
        const updatedApplicants = applicantData.map((applicant) =>
            applicant._id === applicantId
                ? { ...applicant, status: 'approved' }
                : applicant,
        )
        setApplicantData(updatedApplicants)

        // TODO: Gọi API để cập nhật trạng thái trên server
        // Ví dụ:
        // await updateApplicantStatus(applicantId, 'approved');
    }

    // Hàm xử lý từ chối applicant (tùy chọn)
    const handleReject = (applicantId: string) => {
        const updatedApplicants = applicantData.map((applicant) =>
            applicant._id === applicantId
                ? { ...applicant, status: 'rejected' }
                : applicant,
        )
        setApplicantData(updatedApplicants)

        // TODO: Gọi API để cập nhật trạng thái trên server
        // await updateApplicantStatus(applicantId, 'rejected');
    }

    return (
        <>
            <h2 className="mb-4">Applicant list</h2>
            <div className="table-responsive">
                <table className="table table-striped table-hover">
                    <thead className="table-dark">
                        <tr>
                            <th>#</th>
                            <th>Full name</th>
                            <th>Email</th>
                            <th>Phone number</th>
                            <th>Apply date</th>
                            <th>Status</th>
                            <th>CV</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applicantData.map((applicant, index) => (
                            <tr key={applicant._id + index}>
                                <td>{index + 1}</td>
                                <td>{applicant.user.full_name}</td>
                                <td>{applicant.user.email}</td>
                                <td>{applicant.user.phone_number || 'N/A'}</td>
                                <td>{formatDate(applicant.applied_at)}</td>
                                <td>
                                    <span
                                        className={`badge bg-${
                                            applicant.status === 'pending'
                                                ? 'warning'
                                                : applicant.status ===
                                                    'approved'
                                                  ? 'success'
                                                  : 'danger'
                                        }`}
                                    >
                                        {applicant.status === 'pending'
                                            ? 'In progress'
                                            : applicant.status === 'approved'
                                              ? 'Approved'
                                              : 'Injected'}
                                    </span>
                                </td>
                                <td>
                                    {applicant.user.cv_url ? (
                                        <a
                                            href={applicant.user.cv_url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-sm btn-outline-primary"
                                        >
                                            Check CV
                                        </a>
                                    ) : (
                                        'Không có'
                                    )}
                                </td>
                                <td>
                                    {applicant.status === 'pending' && (
                                        <div className="btn-group" role="group">
                                            <button
                                                className="btn btn-sm btn-success"
                                                onClick={() =>
                                                    handleApprove(applicant._id)
                                                }
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() =>
                                                    handleReject(applicant._id)
                                                }
                                            >
                                                Inject
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}

export default ApplicantList
