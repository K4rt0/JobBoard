import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import React, { useState, useEffect } from 'react'
import { getCurrentUser, updateUserProfile } from '@/services/userService'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { useAuth } from '@/hooks/useAuth'
import { Skill, UserInfoData } from '@/interfaces'
import { Button } from 'react-bootstrap'
import FormModal from '@/components/modals/FormModal'
import {
    ContactFormFields,
    BioFormFields,
    SkillsFormFields,
    ExperienceFormFields,
    EducationFormFields,
} from '@/components/forms/ProfileFormFields'

// Định nghĩa kiểu cho Modal
interface ModalConfigItem {
    title: string
    icon: string
    component: React.ComponentType<any>
}

// Định nghĩa kiểu cho danh sách Modal
type ModalConfig = {
    [key in
        | 'contact'
        | 'bio'
        | 'skills'
        | 'experience'
        | 'education']: ModalConfigItem
}

// Kiểu dữ liệu cho `showModal`
type ModalType = keyof ModalConfig | null

const ProfilePage: React.FC = () => {
    const [userData, setUserData] = useState<UserInfoData>({
        id: '',
        fullName: '',
        email: '',
        phoneNumber: '',
        role: '',
        bio: '',
        skills: [],
        experience: 0,
        education: null,
        cvUrl: null,
        status: '',
        createdAt: '',
        location: '',
        website: '',
        socialLinks: {},
    })

    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const { user } = useAuth()
    const accessToken = user?.access_token

    // State cho modal
    const [showModal, setShowModal] = useState<ModalType>(null)
    const [formData, setFormData] = useState<Partial<UserInfoData>>({})

    const menuItems = [
        {
            label: 'My Resume',
            link: 'profile',
            icon: 'lni lni-clipboard',
            active: true,
        },
        {
            label: 'Bookmarked Jobs',
            link: 'bookmarked',
            icon: 'lni lni-bookmark',
        },
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
        {
            label: 'Manage Resumes',
            link: 'manage-resumes',
            icon: 'lni lni-files',
        },
        {
            label: 'Change Password',
            link: 'change-password',
            icon: 'lni lni-lock',
        },
    ]

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                setLoading(true)
                if (!accessToken) throw new Error('No access token available')

                localStorage.setItem('accessToken', accessToken)
                const data = await getCurrentUser()

                const mockSocialLinks = {
                    facebook: 'https://facebook.com',
                    twitter: 'https://twitter.com',
                    linkedin: 'https://linkedin.com',
                    dribbble: 'https://dribbble.com',
                    pinterest: 'https://pinterest.com',
                }

                setUserData((prev) => ({
                    ...prev,
                    fullName: data.full_name || 'Unknown User',
                    email: data.email || '',
                    phoneNumber: data.phone_number || '',
                    role: data.role || 'Freelancer',
                    bio: data.bio || 'No bio available',
                    skills: data.skills || [],
                    experience: data.experience || 0,
                    education: data.education || null,
                    cvUrl: data.cv_url || null,
                    status: data.status || 'Active',
                    createdAt: data.created_at
                        ? new Date(data.created_at).toLocaleDateString()
                        : 'N/A',
                    socialLinks: mockSocialLinks,
                }))
            } catch (err) {
                const errorMessage =
                    err instanceof Error
                        ? err.message
                        : 'Failed to load profile data'
                setError(errorMessage)
                toast.error(errorMessage)
            } finally {
                setLoading(false)
            }
        }

        fetchUserProfile()
    }, [accessToken])

    // Hàm mở modal
    const handleOpenModal = (
        section: ModalType,
        initialData: Partial<UserInfoData> = {},
    ): void => {
        setShowModal(section)
        setFormData(initialData)
    }

    // Hàm đóng modal
    const handleCloseModal = (): void => {
        setShowModal(null)
        setFormData({})
    }

    // Xử lý thay đổi input
    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ): void => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSkillsChange = (selectedOptions: Skill[]): void => {
        setFormData((prev) => ({ ...prev, skills: selectedOptions }))
    }

    // Xử lý submit form
    const handleSubmit = async (): Promise<void> => {
        try {
            const updatedData = await updateUserProfile(formData)

            setUserData((prev) => ({
                ...prev,
                ...updatedData,
                createdAt: updatedData.createdAt
                    ? new Date(updatedData.createdAt).toLocaleDateString()
                    : prev.createdAt,
            }))

            toast.success('Profile updated successfully!')
            handleCloseModal()
        } catch (err) {
            const errorMessage =
                err instanceof Error ? err.message : 'Failed to update profile'
            toast.error(errorMessage)
        }
    }

    if (loading) return <div>Loading profile...</div>
    if (error) return <div>Error: {error}</div>

    // Modal configurations
    const modalConfig: ModalConfig = {
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
    }

    const currentModal = showModal ? modalConfig[showModal] : null
    const FormComponent = currentModal?.component

    return (
        <div className="resume section">
            <div className="container">
                <div className="resume-inner">
                    <div className="row">
                        {/* Sidebar */}
                        <div className="col-lg-4 col-12">
                            <DashboardSidebar menuItems={menuItems} />
                        </div>
                        {/* Main Content */}
                        <div className="col-lg-8 col-12">
                            <div className="inner-content">
                                {/* Personal Info */}
                                <div className="personal-top-content">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-5 col-12">
                                            <div className="name-head">
                                                <a
                                                    className="mb-2 w-100"
                                                    href="resume.html#"
                                                >
                                                    <img
                                                        className="circle-54 w-50"
                                                        src="/assets/images/avatars/unknown.jpg"
                                                        alt={userData.fullName}
                                                    />
                                                </a>
                                                <h4>
                                                    <a
                                                        className="name"
                                                        href="resume.html#"
                                                    >
                                                        {userData.fullName}
                                                    </a>
                                                </h4>
                                                <p>
                                                    <a
                                                        className="deg"
                                                        href="resume.html#"
                                                    >
                                                        {userData.role}
                                                    </a>
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
                                                                            className={`lni lni-${platform}-original`}
                                                                        ></i>
                                                                    </a>
                                                                </li>
                                                            ),
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <p className="font-size-4 mb-8">
                                                        No social links
                                                        available
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-7 col-12">
                                            <div className="content-right">
                                                <h5 className="title-main">
                                                    Contact Info
                                                    <Button
                                                        variant="link"
                                                        onClick={() =>
                                                            handleOpenModal(
                                                                'contact',
                                                                {
                                                                    email: userData.email,
                                                                    phoneNumber:
                                                                        userData.phoneNumber,
                                                                    location:
                                                                        userData.location,
                                                                    website:
                                                                        userData.website,
                                                                },
                                                            )
                                                        }
                                                        className="p-0 ms-2"
                                                    >
                                                        <i className="lni lni-pencil"></i>
                                                    </Button>
                                                </h5>
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        Location
                                                    </h5>
                                                    <p>
                                                        {userData.location ||
                                                            'No data available'}
                                                    </p>
                                                </div>
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        E-mail
                                                    </h5>
                                                    <p>
                                                        {userData.email ||
                                                            'No data available'}
                                                    </p>
                                                </div>
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        Phone
                                                    </h5>
                                                    <p>
                                                        {userData.phoneNumber ||
                                                            'No data available'}
                                                    </p>
                                                </div>
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        Website Linked
                                                    </h5>
                                                    {userData.website ? (
                                                        <p>
                                                            <a
                                                                href={
                                                                    userData.website
                                                                }
                                                            >
                                                                {
                                                                    userData.website
                                                                }
                                                            </a>
                                                        </p>
                                                    ) : (
                                                        <p>No data available</p>
                                                    )}
                                                </div>
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        CV
                                                    </h5>
                                                    {userData.cvUrl ? (
                                                        <p>
                                                            <a
                                                                href={
                                                                    userData.cvUrl
                                                                }
                                                            >
                                                                Download CV
                                                            </a>
                                                        </p>
                                                    ) : (
                                                        <p>No data available</p>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* About Section */}
                                <div className="single-section">
                                    <h4>
                                        About
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                handleOpenModal('bio', {
                                                    bio: userData.bio,
                                                })
                                            }
                                            className="p-0 ms-2"
                                        >
                                            <i className="lni lni-pencil"></i>
                                        </Button>
                                    </h4>
                                    {userData.bio &&
                                    userData.bio !== 'No bio available' ? (
                                        <p className="font-size-4 mb-8">
                                            {userData.bio}
                                        </p>
                                    ) : (
                                        <p className="font-size-4 mb-8">
                                            No bio available
                                        </p>
                                    )}
                                    <p className="font-size-4 mb-8">
                                        Account created: {userData.createdAt}
                                    </p>
                                    <p className="font-size-4 mb-8">
                                        Status: {userData.status}
                                    </p>
                                </div>
                                {/* Skills Section */}
                                <div className="single-section skill">
                                    <h4>
                                        Skills
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                handleOpenModal('skills', {
                                                    skills: userData.skills,
                                                })
                                            }
                                            className="p-0 ms-2"
                                        >
                                            <i className="lni lni-pencil"></i>
                                        </Button>
                                    </h4>
                                    {userData.skills.length > 0 ? (
                                        <ul className="list-unstyled d-flex align-items-center flex-wrap">
                                            {userData.skills.map(
                                                (skill, index) => (
                                                    <li key={index}>
                                                        <a href="resume.html#">
                                                            {skill.name}
                                                        </a>
                                                    </li>
                                                ),
                                            )}
                                        </ul>
                                    ) : (
                                        <p className="font-size-4 mb-8">
                                            No skills available
                                        </p>
                                    )}
                                </div>
                                {/* Experience Section */}
                                <div className="single-section exprerience">
                                    <h4>
                                        Work Experience
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                handleOpenModal('experience', {
                                                    experience:
                                                        userData.experience,
                                                })
                                            }
                                            className="p-0 ms-2"
                                        >
                                            <i className="lni lni-pencil"></i>
                                        </Button>
                                    </h4>
                                    {userData.experience > 0 ? (
                                        <div className="single-exp mb-30">
                                            <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                                <div className="image">
                                                    <img
                                                        src="assets/images/resume/work1.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="w-100 mt-n2">
                                                    <h3 className="mb-0">
                                                        <a href="resume.html#">
                                                            Experience
                                                        </a>
                                                    </h3>
                                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                                        <a href="resume.html#">
                                                            {
                                                                userData.experience
                                                            }{' '}
                                                            years
                                                        </a>
                                                        <a
                                                            href="resume.html#"
                                                            className="font-size-3 text-gray"
                                                        >
                                                            <span
                                                                className="mr-2"
                                                                style={{
                                                                    marginTop:
                                                                        '-2px',
                                                                }}
                                                            >
                                                                <i className="lni lni-map-marker"></i>
                                                            </span>
                                                            {userData.location ||
                                                                'No data available'}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="font-size-4 mb-8">
                                            No experience available
                                        </p>
                                    )}
                                </div>
                                {/* Education Section */}
                                <div className="single-section education">
                                    <h4>
                                        Education
                                        <Button
                                            variant="link"
                                            onClick={() =>
                                                handleOpenModal('education', {
                                                    education:
                                                        userData.education,
                                                })
                                            }
                                            className="p-0 ms-2"
                                        >
                                            <i className="lni lni-pencil"></i>
                                        </Button>
                                    </h4>
                                    {userData.education ? (
                                        <div className="single-edu mb-30">
                                            <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                                <div className="image">
                                                    <img
                                                        src="assets/images/resume/edu1.svg"
                                                        alt="#"
                                                    />
                                                </div>
                                                <div className="w-100 mt-n2">
                                                    <h3 className="mb-0">
                                                        <a href="resume.html#">
                                                            {userData.education}
                                                        </a>
                                                    </h3>
                                                    <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                                        <a href="resume.html#">
                                                            N/A
                                                        </a>
                                                        <a
                                                            href="resume.html#"
                                                            className="font-size-3 text-gray"
                                                        >
                                                            <span
                                                                className="mr-2"
                                                                style={{
                                                                    marginTop:
                                                                        '-2px',
                                                                }}
                                                            >
                                                                <i className="lni lni-map-marker"></i>
                                                            </span>
                                                            {userData.location ||
                                                                'No data available'}
                                                        </a>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <p className="font-size-4 mb-8">
                                            No education available
                                        </p>
                                    )}
                                </div>
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
                    {FormComponent && (
                        <FormComponent
                            formData={formData}
                            handleInputChange={handleInputChange}
                            handleSkillsChange={
                                showModal === 'skills'
                                    ? handleSkillsChange
                                    : undefined
                            }
                        />
                    )}
                </FormModal>
            )}
        </div>
    )
}

export default ProfilePage
