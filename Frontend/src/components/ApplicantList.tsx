import React, { useState } from 'react'
import { ApplicantResponse } from '@/interfaces'
import { updateApplicantStatus } from '@/services/employerService'

interface ApplicantListProps {
    projectId: string
    applicants?: ApplicantResponse[]
}

const ApplicantList: React.FC<ApplicantListProps> = ({
    projectId,
    applicants,
}) => {
    const defaultApplicants: ApplicantResponse[] = [
        {
            applicant: {
                _id: '67dc1b86f4505b8d9901dadb',
                applied_at: 1742591071746,
                status: 'pending',
                expired_at: '',
            },
            user: {
                _id: '67dc1b86f4505b8d9901dadb',
                full_name: 'Dương Khoa Nam',
                email: 'admin@gmail.com',
                phone_number: '',
                birth_date: null,
                role: 'Freelancer',
                avatar: { url: '', delete_hash: '' },
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

    const [applicantData, setApplicantData] = useState<ApplicantResponse[]>(
        applicants ? JSON.parse(JSON.stringify(applicants)) : defaultApplicants,
    )

    const formatDate = (timestamp: number | null): string => {
        if (!timestamp) return 'N/A'
        return new Date(timestamp).toLocaleDateString('en-US')
    }

    const handleApprove = async (applicantId: string) => {
        const updatedApplicant = await updateApplicantStatus(
            projectId,
            applicantId,
            'accepted',
        )
        console.log('id', projectId + '-' + applicantId)
        if (updatedApplicant) {
            setApplicantData((prevData) =>
                prevData.map((item) =>
                    item.applicant._id === applicantId
                        ? {
                              ...item,
                              applicant: {
                                  ...item.applicant,
                                  status: 'accepted',
                              },
                          }
                        : item,
                ),
            )
        }
    }

    const handleReject = async (applicantId: string) => {
        const updatedApplicant = await updateApplicantStatus(
            projectId,
            applicantId,
            'rejected',
        )
        console.log('id', projectId + '-' + applicantId)
        if (updatedApplicant) {
            setApplicantData((prevData) =>
                prevData.map((item) =>
                    item.applicant._id === applicantId
                        ? {
                              ...item,
                              applicant: {
                                  ...item.applicant,
                                  status: 'rejected',
                              },
                          }
                        : item,
                ),
            )
        }
    }

    return (
        <div className="container-fluid py-4">
            <h2 className="mb-4 fw-bold" style={{ color: '#2042e3' }}>
                Applicant List
            </h2>
            <div className="card shadow-sm border-0">
                <div className="card-body p-0">
                    <div className="table-responsive">
                        <table className="table table-bordered mb-0">
                            <thead
                                style={{
                                    backgroundColor: '#000',
                                    color: '#fff',
                                }}
                            >
                                <tr>
                                    <th scope="col" className="text-center">
                                        #
                                    </th>
                                    <th scope="col">Full Name</th>
                                    <th scope="col">Email</th>
                                    <th scope="col">Phone Number</th>
                                    <th scope="col" className="text-center">
                                        Applied Date
                                    </th>
                                    <th scope="col" className="text-center">
                                        Status
                                    </th>
                                    <th scope="col" className="text-center">
                                        CV
                                    </th>
                                    <th scope="col" className="text-center">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {applicantData.map((item, index) => (
                                    <tr
                                        key={item.applicant._id + index}
                                        className="align-middle"
                                    >
                                        <td className="text-center">
                                            {index + 1}
                                        </td>
                                        <td>{item.user.full_name}</td>
                                        <td>{item.user.email}</td>
                                        <td>
                                            {item.user.phone_number || 'N/A'}
                                        </td>
                                        <td className="text-center">
                                            {formatDate(
                                                item.applicant.applied_at,
                                            )}
                                        </td>
                                        <td className="text-center">
                                            <span
                                                className={`badge px-2 py-1 ${
                                                    item.applicant.status ===
                                                    'pending'
                                                        ? 'bg-warning text-dark'
                                                        : item.applicant
                                                                .status ===
                                                            'accepted'
                                                          ? 'bg-success text-white'
                                                          : 'bg-danger text-white'
                                                }`}
                                            >
                                                {item.applicant.status ===
                                                'pending'
                                                    ? 'Pending'
                                                    : item.applicant.status ===
                                                        'accepted'
                                                      ? 'Accepted'
                                                      : 'Rejected'}
                                            </span>
                                        </td>
                                        <td className="text-center">
                                            {item.user.cv_url ? (
                                                <a
                                                    href={item.user.cv_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-sm btn-outline-primary"
                                                    style={{
                                                        borderColor: '#2042e3',
                                                        color: '#2042e3',
                                                        borderRadius: '4px',
                                                        padding: '2px 8px',
                                                    }}
                                                >
                                                    View CV
                                                </a>
                                            ) : (
                                                <span className="text-muted">
                                                    N/A
                                                </span>
                                            )}
                                        </td>
                                        <td className="text-center">
                                            {item.applicant.status ===
                                            'pending' ? (
                                                <>
                                                    <button
                                                        className="btn btn-sm me-2"
                                                        style={{
                                                            backgroundColor:
                                                                '#28a745',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '2px 8px',
                                                        }}
                                                        onClick={() =>
                                                            handleApprove(
                                                                item.applicant
                                                                    ._id,
                                                            )
                                                        }
                                                        onMouseOver={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                '#218838')
                                                        }
                                                        onMouseOut={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                '#28a745')
                                                        }
                                                    >
                                                        Approve
                                                    </button>
                                                    <button
                                                        className="btn btn-sm"
                                                        style={{
                                                            backgroundColor:
                                                                '#dc3545',
                                                            color: '#fff',
                                                            border: 'none',
                                                            borderRadius: '4px',
                                                            padding: '2px 8px',
                                                        }}
                                                        onClick={() =>
                                                            handleReject(
                                                                item.applicant
                                                                    ._id,
                                                            )
                                                        }
                                                        onMouseOver={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                '#c82333')
                                                        }
                                                        onMouseOut={(e) =>
                                                            (e.currentTarget.style.backgroundColor =
                                                                '#dc3545')
                                                        }
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-muted">
                                                    —
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ApplicantList
