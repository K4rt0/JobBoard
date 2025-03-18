import React, { useState, useEffect } from 'react'
import {
    addUserSkills,
    getCurrentUser,
    updateUserProfile,
} from '@/services/userService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/hooks/useAuth'
import {
    Skill,
    UserInfo,
    Freelancer,
    Employer,
    ProfileFormData,
} from '@/interfaces'
import { Button, Form } from 'react-bootstrap'
import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import FormModal from '@/components/modals/FormModal'
import {
    ContactFormFields,
    BioFormFields,
    SkillsFormFields,
    ExperienceFormFields,
    EducationFormFields,
} from '@/components/forms/ProfileFormFields'
import ErrorPage from './ErrorPage'

// Modal types và config giữ nguyên
type ModalType =
    | 'contact'
    | 'bio'
    | 'skills'
    | 'experience'
    | 'education'
    | 'company'
    | null

const MODAL_CONFIG = {
    contact: {
        title: 'Edit Contact Information',
        icon: 'lni lni-user',
        component: ContactFormFields,
    },
    bio: {
        title: 'Edit Bio',
        icon: 'lni lni-user-alt',
        component: BioFormFields,
    },
    skills: {
        title: 'Edit Skills',
        icon: 'lni lni-star',
        component: SkillsFormFields,
    },
    experience: {
        title: 'Edit Experience',
        icon: 'lni lni-briefcase',
        component: ExperienceFormFields,
    },
    education: {
        title: 'Edit Education',
        icon: 'lni lni-graduation',
        component: EducationFormFields,
    },
    company: {
        title: 'Edit Company Info',
        icon: 'lni lni-briefcase',
        component: ContactFormFields,
    },
}

// Sidebar menu items giữ nguyên
const SIDEBAR_MENU_ITEMS = [
    {
        label: 'My Resume',
        link: 'profile',
        icon: 'lni lni-clipboard',
        active: true,
    },
    { label: 'Bookmarked Jobs', link: 'bookmarked', icon: 'lni lni-bookmark' },
    {
        label: 'Notifications',
        link: 'notifications',
        icon: 'lni lni-alarm',
        notification: 5,
    },
    {
        label: 'Manage Applications',
        link: 'manage-applications',
        icon: 'lni lni-envelope',
    },
    { label: 'Manage Resumes', link: 'manage-resumes', icon: 'lni lni-files' },
    { label: 'Change Password', link: 'change-password', icon: 'lni lni-lock' },
]

// Initial user data
const initialUserData: UserInfo = {
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
    socialLinks: {},
}

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserInfo | Freelancer | Employer>(
        initialUserData,
    )
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [showModal, setShowModal] = useState<ModalType>(null)
    const [formData, setFormData] = useState<ProfileFormData>({})
    const [uploading, setUploading] = useState<boolean>(false)
    const [avatarUploading, setAvatarUploading] = useState<boolean>(false)
    const [isEditingCV, setIsEditingCV] = useState<boolean>(false)
    const [cvUrl, setCvUrl] = useState<string>(
        (userData as Freelancer).cvUrl || '',
    )
    const { user } = useAuth()
    const accessToken = user?.access_token
    const fetchUserProfile = async () => {
        if (!accessToken) {
            setError('No access token available')
            setLoading(false)
            return
        }

        try {
            setLoading(true)
            const data = await getCurrentUser()
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
    // Fetch user profile data
    useEffect(() => {
        fetchUserProfile()
    }, [accessToken, updateUserProfile])

    // Modal handlers
    const handleOpenModal = (
        modalType: ModalType,
        initialData: ProfileFormData = {},
    ): void => {
        if (modalType === 'contact') {
            const { email, ...rest } = initialData // Loại bỏ email khỏi dữ liệu
            setFormData({
                fullName: userData.fullName,
                ...rest,
            })
        } else {
            setFormData(initialData)
        }
        setShowModal(modalType)
    }

    const handleCloseModal = (): void => {
        setShowModal(null)
        setFormData({})
    }

    // Form handlers
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSkillsChange = (selectedOptions: Skill[]): void => {
        setFormData((prev) => ({ ...prev, skills: selectedOptions }))
    }

    // Avatar upload handler
    const handleUploadAvatar = async (
        event: React.ChangeEvent<HTMLInputElement>,
    ) => {
        if (!event.target.files || event.target.files.length === 0) return
        const file = event.target.files[0]

        try {
            setAvatarUploading(true)
            const updatedData = await updateUserProfile({ avatar: file })
            setUserData((prev) => ({
                ...prev,
                avatar: updatedData.avatar || '',
            }))
            toast.success('Avatar uploaded successfully!')
        } catch (error) {
            toast.error('Failed to upload avatar')
        } finally {
            setAvatarUploading(false)
        }
    }

    // CV upload handler
    const handleSaveCV = async () => {
        if (!cvUrl.trim()) {
            toast.error('Please enter a valid CV link.')
            return
        }

        try {
            setUploading(true)

            const updatedData = await updateUserProfile({ cvUrl })

            setUserData((prev) => ({
                ...prev,
                cvUrl: (updatedData as Freelancer).cvUrl || '',
            }))

            toast.success('CV link updated successfully!')
            setIsEditingCV(false) // Ẩn input sau khi lưu thành công
        } catch (error) {
            toast.error('Failed to update CV link')
        } finally {
            setUploading(false)
        }
    }

    // Submit form handler
    const handleSubmit = async (): Promise<void> => {
        try {
            let updatedData: UserInfo | Freelancer | Employer
            if (showModal === 'skills' && formData.skills) {
                const skillIds = formData.skills.map((skill) => skill._id)
                updatedData = await addUserSkills(skillIds)
                setUserData((prev) => ({
                    ...prev,
                    skills:
                        (updatedData as Freelancer).skills || formData.skills,
                }))
            } else {
                updatedData = await updateUserProfile(formData)
                setUserData((prev) => ({ ...prev, ...updatedData }))
                // Kiểm tra nếu dữ liệu không đầy đủ (ví dụ: thiếu id hoặc email)
                if (!updatedData.id || !updatedData.email) {
                    await fetchUserProfile()
                }
            }
            toast.success('Profile updated successfully!')
            handleCloseModal()
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to update profile'
            toast.error(errorMessage)
        }
    }

    if (loading) return <div id="loading-area"></div>
    if (error) return <ErrorPage />

    const currentModal = showModal ? MODAL_CONFIG[showModal] : null

    return (
        <div className="resume section">
            <div className="container">
                <div className="resume-inner">
                    <div className="row">
                        <div className="col-lg-4 col-12">
                            <DashboardSidebar menuItems={SIDEBAR_MENU_ITEMS} />
                        </div>

                        <div className="col-lg-8 col-12">
                            <div className="inner-content">
                                <div className="personal-top-content">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-5 col-12">
                                            <div className="name-head text-center position-relative">
                                                <div className="position-relative d-inline-block">
                                                    {/* Ảnh đại diện với shadow */}
                                                    <img
                                                        className="rounded shadow img-fluid"
                                                        src={
                                                            userData.avatar ||
                                                            '/assets/images/avatars/unknown.jpg'
                                                        }
                                                        alt={userData.fullName}
                                                        style={{
                                                            width: '10rem', // Kích thước cố định
                                                            height: '10rem', // Vuông
                                                            objectFit: 'cover',
                                                        }}
                                                    />

                                                    {/* Nút upload ảnh */}
                                                    <label
                                                        htmlFor="uploadAvatar"
                                                        className="position-absolute bottom-0 end-0 bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '30px',
                                                            height: '30px',
                                                            cursor: 'pointer',
                                                        }}
                                                    >
                                                        <i className="lni lni-cloud-upload fs-5"></i>
                                                    </label>
                                                    <Form.Control
                                                        id="uploadAvatar"
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={
                                                            handleUploadAvatar
                                                        }
                                                        disabled={
                                                            avatarUploading
                                                        }
                                                        className="d-none"
                                                    />
                                                </div>

                                                {avatarUploading && (
                                                    <p className="mt-2 text-primary">
                                                        Uploading avatar...
                                                    </p>
                                                )}
                                                <h4 className="mt-4">
                                                    {userData.fullName}
                                                </h4>
                                                <p className="text-danger">
                                                    --{userData.role}--
                                                </p>
                                                {userData.socialLinks &&
                                                Object.keys(
                                                    userData.socialLinks,
                                                ).length > 0 ? (
                                                    <ul className="social">
                                                        {Object.entries(
                                                            userData.socialLinks,
                                                        ).map(
                                                            ([
                                                                platform,
                                                                link,
                                                            ]) => (
                                                                <li
                                                                    key={
                                                                        platform
                                                                    }
                                                                >
                                                                    <a
                                                                        href={
                                                                            link
                                                                        }
                                                                    >
                                                                        <i
                                                                            className={`lni lni-${platform}`}
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
                                                    {/* Header - Avatar + Name + Button */}
                                                    <div className="d-flex align-items-center justify-content-between">
                                                        {/* Nút chỉnh sửa */}
                                                        <Button
                                                            variant="outline-primary"
                                                            size="sm"
                                                            className="rounded-pill px-3"
                                                            onClick={() =>
                                                                handleOpenModal(
                                                                    'contact',
                                                                    {
                                                                        email: userData.email,
                                                                        phoneNumber:
                                                                            userData.phoneNumber,
                                                                        birthDate:
                                                                            userData.birthDate,
                                                                        location:
                                                                            userData.location,
                                                                        website:
                                                                            userData.website,
                                                                    },
                                                                )
                                                            }
                                                        >
                                                            <i className="lni lni-pencil-alt me-1"></i>{' '}
                                                            Edit Profile
                                                        </Button>
                                                    </div>

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
                                    <h4>
                                        About
                                        <Button
                                            variant="outline-primary"
                                            size="sm"
                                            className="rounded-pill px-3 mx-2"
                                            onClick={() =>
                                                handleOpenModal('bio', {
                                                    bio: userData.bio,
                                                })
                                            }
                                        >
                                            <i className="lni lni-pencil"></i>
                                        </Button>
                                    </h4>
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
                                            <h4>
                                                Skills
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill px-3 mx-2"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            'skills',
                                                            {
                                                                skills: (
                                                                    userData as Freelancer
                                                                ).skills,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <i className="lni lni-pencil"></i>
                                                </Button>
                                            </h4>
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
                                            <h4>
                                                Work Experience
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill px-3 mx-2"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            'experience',
                                                            {
                                                                experience: (
                                                                    userData as Freelancer
                                                                ).experience,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <i className="lni lni-pencil"></i>
                                                </Button>
                                            </h4>
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
                                            <h4>
                                                Education
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill px-3 mx-2"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            'education',
                                                            {
                                                                education: (
                                                                    userData as Freelancer
                                                                ).education,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <i className="lni lni-pencil"></i>
                                                </Button>
                                            </h4>
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

                                        <div className="single-section">
                                            <h4>
                                                CV {/* Nút Edit CV */}
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill px-3 mx-2"
                                                    onClick={() =>
                                                        setIsEditingCV(true)
                                                    }
                                                >
                                                    <i className="lni lni-pencil-alt me-1"></i>{' '}
                                                    Edit CV
                                                </Button>
                                            </h4>

                                            {!isEditingCV ? (
                                                <>
                                                    {(userData as Freelancer)
                                                        .cvUrl ? (
                                                        <p>
                                                            <a
                                                                href={
                                                                    (
                                                                        userData as Freelancer
                                                                    ).cvUrl ||
                                                                    ''
                                                                }
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="text-primary"
                                                            >
                                                                View CV
                                                            </a>
                                                        </p>
                                                    ) : (
                                                        <p>No CV available</p>
                                                    )}
                                                </>
                                            ) : (
                                                <>
                                                    {/* Input nhập CV link */}
                                                    <Form.Group controlId="cvUrl">
                                                        <Form.Control
                                                            type="text"
                                                            placeholder="Enter new CV URL (Google Drive, LinkedIn, Dropbox)"
                                                            value={cvUrl}
                                                            onChange={(e) =>
                                                                setCvUrl(
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            disabled={uploading}
                                                        />
                                                    </Form.Group>

                                                    {/* Nút Save */}
                                                    <Button
                                                        variant="primary"
                                                        size="sm"
                                                        className="mt-2 me-2"
                                                        onClick={handleSaveCV}
                                                        disabled={
                                                            uploading ||
                                                            !cvUrl.trim()
                                                        }
                                                    >
                                                        {uploading
                                                            ? 'Saving...'
                                                            : 'Save'}
                                                    </Button>

                                                    {/* Nút Cancel */}
                                                    <Button
                                                        variant="outline-secondary"
                                                        size="sm"
                                                        className="mt-2"
                                                        onClick={() => {
                                                            setIsEditingCV(
                                                                false,
                                                            )
                                                            setCvUrl(
                                                                (
                                                                    userData as Freelancer
                                                                ).cvUrl || '',
                                                            ) // Khôi phục URL cũ nếu hủy
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                </>
                                            )}
                                        </div>

                                        <div className="single-section">
                                            <h4>Rate & Rating</h4>
                                            <p>
                                                Hourly Rate:{' '}
                                                {(userData as Freelancer)
                                                    .hourlyRate || 0}{' '}
                                                {(userData as Freelancer)
                                                    .currency || 'USD'}
                                            </p>
                                            <p>
                                                Rating:{' '}
                                                {(userData as Freelancer)
                                                    .rating || 0}{' '}
                                                / 5 (
                                                {(userData as Freelancer)
                                                    .reviews || 0}{' '}
                                                reviews)
                                            </p>
                                            <p>
                                                Level:{' '}
                                                {(userData as Freelancer)
                                                    .level || 0}
                                            </p>
                                        </div>
                                    </>
                                )}

                                {userData.role === 'Employer' && (
                                    <>
                                        <div className="single-section">
                                            <h4>
                                                Company Info
                                                <Button
                                                    variant="outline-primary"
                                                    size="sm"
                                                    className="rounded-pill px-3 mx-2"
                                                    onClick={() =>
                                                        handleOpenModal(
                                                            'company',
                                                            {
                                                                companyName: (
                                                                    userData as Employer
                                                                ).companyName,
                                                                companyDescription:
                                                                    (
                                                                        userData as Employer
                                                                    )
                                                                        .companyDescription,
                                                            },
                                                        )
                                                    }
                                                >
                                                    <i className="lni lni-pencil"></i>
                                                </Button>
                                            </h4>
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

                                        <div className="single-section">
                                            <h4>Rate & Rating</h4>
                                            <p>
                                                Hourly Rate:{' '}
                                                {(userData as Employer)
                                                    .hourlyRate || 0}{' '}
                                                {(userData as Employer)
                                                    .currency || 'USD'}
                                            </p>
                                            <p>
                                                Rating:{' '}
                                                {(userData as Employer)
                                                    .rating || 0}{' '}
                                                / 5
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && currentModal && (
                <FormModal
                    show={!!showModal}
                    onHide={handleCloseModal}
                    onSubmit={handleSubmit}
                    title={currentModal.title}
                    icon={currentModal.icon}
                >
                    {showModal === 'skills' && (
                        <SkillsFormFields
                            formData={{ skills: formData.skills || [] }}
                            handleSkillsChange={handleSkillsChange}
                        />
                    )}
                    {showModal === 'contact' && (
                        <ContactFormFields
                            formData={formData as UserInfo}
                            handleInputChange={handleInputChange}
                        />
                    )}
                    {showModal === 'bio' && (
                        <BioFormFields
                            formData={formData as UserInfo}
                            handleInputChange={handleInputChange}
                        />
                    )}
                    {showModal === 'experience' && (
                        <ExperienceFormFields
                            formData={formData as UserInfo}
                            handleInputChange={handleInputChange}
                        />
                    )}
                    {showModal === 'education' && (
                        <EducationFormFields
                            formData={formData as UserInfo}
                            handleInputChange={handleInputChange}
                        />
                    )}
                    {showModal === 'company' && (
                        <ContactFormFields
                            formData={formData as UserInfo}
                            handleInputChange={handleInputChange}
                        />
                    )}
                </FormModal>
            )}
        </div>
    )
}

export default ProfilePage
