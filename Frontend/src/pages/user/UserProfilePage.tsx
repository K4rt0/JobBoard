import React, { useState, useEffect } from 'react'
import { getUserById } from '@/services/userService'
import { BaseUserInfo, Freelancer, Employer } from '@/interfaces'
import ErrorPage from '../ErrorPage'
import { useParams } from 'react-router-dom'

// Initial user data
const initialUserData: BaseUserInfo = {
    id: '',
    fullName: '',
    email: '',
    phoneNumber: '',
    birthDate: null,
    role: '',
    bio: null,
    avatar: '',
    status: '',
    createdAt: '',
    updatedAt: null,
    location: '',
    website: '',
    socials: [],
}

const UserProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<
        BaseUserInfo | Freelancer | Employer
    >(initialUserData)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const { userId } = useParams<{ userId: string }>()

    const fetchUserProfile = async () => {
        if (!userId) {
            return
        }

        try {
            setLoading(true)
            const data = await getUserById(userId as string)
            setUserData(data)
        } catch (err) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Failed to load profile data'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        if (userId) {
            fetchUserProfile()
        }
    }, [userId])

    if (loading) return <div id="loading-area"></div>
    if (error) return <ErrorPage />

    return (
        <div className="resume section">
            <div className="container">
                <div className="resume-inner">
                    <div className="row justify-content-center">
                        <div className="col-lg-10 col-12">
                            <div className="inner-content">
                                <div className="personal-top-content">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-5 col-12">
                                            <div className="name-head text-center">
                                                <div className="d-inline-block">
                                                    <img
                                                        className="rounded shadow img-fluid"
                                                        src={
                                                            userData.avatar ||
                                                            '/assets/images/avatars/unknown.jpg'
                                                        }
                                                        alt={userData.fullName}
                                                        style={{
                                                            width: '10rem',
                                                            height: '10rem',
                                                            objectFit: 'cover',
                                                        }}
                                                    />
                                                </div>
                                                <h4 className="mt-4">
                                                    {userData.fullName}
                                                </h4>
                                                <p className="text-danger">
                                                    --{userData.role}--
                                                </p>
                                                {userData.socials &&
                                                userData.socials.length > 0 ? (
                                                    <ul className="social">
                                                        {userData.socials
                                                            .filter(
                                                                (social) =>
                                                                    social.url &&
                                                                    social.url.trim() !==
                                                                        '',
                                                            )
                                                            .map(
                                                                (
                                                                    social,
                                                                    index,
                                                                ) => (
                                                                    <li
                                                                        key={
                                                                            index
                                                                        }
                                                                    >
                                                                        <a
                                                                            href={
                                                                                social.url
                                                                            }
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                        >
                                                                            <i
                                                                                className={`lni ${social.icon}`}
                                                                            ></i>
                                                                        </a>
                                                                    </li>
                                                                ),
                                                            )}
                                                    </ul>
                                                ) : (
                                                    <p>
                                                        No social links
                                                        available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-7 col-12">
                                            <div className="content-right">
                                                <div className="card shadow-sm border-0 p-3">
                                                    {/* Thông tin liên hệ */}
                                                    <div className="mt-3">
                                                        <ul className="list-unstyled">
                                                            <li className="d-flex align-items-center mb-2">
                                                                <i className="lni lni-map-marker text-primary me-2"></i>
                                                                <strong className="me-2">
                                                                    Location:
                                                                </strong>
                                                                <span>
                                                                    {userData.location ||
                                                                        'N/A'}
                                                                </span>
                                                            </li>

                                                            <li className="d-flex align-items-center mb-2">
                                                                <i className="lni lni-envelope text-danger me-2"></i>
                                                                <strong className="me-2">
                                                                    Email:
                                                                </strong>
                                                                <a
                                                                    href={`mailto:${userData.email}`}
                                                                    className="text-decoration-none text-primary"
                                                                >
                                                                    {userData.email ||
                                                                        'N/A'}
                                                                </a>
                                                            </li>

                                                            <li className="d-flex align-items-center mb-2">
                                                                <i className="lni lni-phone text-success me-2"></i>
                                                                <strong className="me-2">
                                                                    Phone:
                                                                </strong>
                                                                <span>
                                                                    {userData.phoneNumber ||
                                                                        'N/A'}
                                                                </span>
                                                            </li>

                                                            <li className="d-flex align-items-center mb-2">
                                                                <i className="lni lni-world text-warning me-2"></i>
                                                                <strong className="me-2">
                                                                    Website:
                                                                </strong>
                                                                {userData.website ? (
                                                                    <a
                                                                        href={
                                                                            userData.website
                                                                        }
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-decoration-none text-primary"
                                                                    >
                                                                        {
                                                                            userData.website
                                                                        }
                                                                    </a>
                                                                ) : (
                                                                    <span>
                                                                        N/A
                                                                    </span>
                                                                )}
                                                            </li>

                                                            <li className="d-flex align-items-center">
                                                                <i className="lni lni-calendar text-info me-2"></i>
                                                                <strong className="me-2">
                                                                    Birth Date:
                                                                </strong>
                                                                <span>
                                                                    {userData.birthDate ||
                                                                        'N/A'}
                                                                </span>
                                                            </li>
                                                        </ul>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="single-section">
                                    <h4>About</h4>
                                    <p>{userData.bio || 'No bio available'}</p>
                                    {userData.updatedAt && (
                                        <p>
                                            Last updated: {userData.updatedAt}
                                        </p>
                                    )}
                                </div>

                                {userData.role === 'Freelancer' && (
                                    <>
                                        <div className="single-section skill">
                                            <h4>Skills</h4>
                                            {(userData as Freelancer).skills
                                                ?.length > 0 ? (
                                                <ul className="list-unstyled d-flex align-items-center flex-wrap">
                                                    {(
                                                        userData as Freelancer
                                                    ).skills.map(
                                                        (skill, index) => (
                                                            <li key={index}>
                                                                <a href="#">
                                                                    {skill.name}
                                                                </a>
                                                            </li>
                                                        ),
                                                    )}
                                                </ul>
                                            ) : (
                                                <p>No skills available</p>
                                            )}
                                        </div>

                                        <div className="single-section exprerience">
                                            <h4>Work Experience</h4>
                                            {(userData as Freelancer)
                                                .experience ? (
                                                <div className="single-exp mb-30">
                                                    <h3>Experience</h3>
                                                    <p>
                                                        {
                                                            (
                                                                userData as Freelancer
                                                            ).experience
                                                        }{' '}
                                                        years
                                                    </p>
                                                </div>
                                            ) : (
                                                <p>No experience available</p>
                                            )}
                                        </div>

                                        <div className="single-section education">
                                            <h4>Education</h4>
                                            {(userData as Freelancer)
                                                .education ? (
                                                <p>
                                                    {
                                                        (userData as Freelancer)
                                                            .education
                                                    }
                                                </p>
                                            ) : (
                                                <p>No education available</p>
                                            )}
                                        </div>
                                    </>
                                )}

                                {userData.role === 'Employer' && (
                                    <>
                                        <div className="single-section">
                                            <h4>Company Info</h4>
                                            <p>
                                                Company Name:{' '}
                                                {(userData as Employer)
                                                    .companyName || 'N/A'}
                                            </p>
                                            <p>
                                                Description:{' '}
                                                {(userData as Employer)
                                                    .companyDescription ||
                                                    'No description available'}
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UserProfilePage
