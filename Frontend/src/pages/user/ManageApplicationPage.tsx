import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import { useAuth } from '@/hooks/useAuth'
import React from 'react'

const ManageApplicationPage = () => {
    const { user } = useAuth()
    const menuItems = [
        {
            label: 'My Profile',
            link: '/profile',
            icon: 'lni lni-clipboard',
            active: true,
        },
        {
            label: 'Bookmarked Jobs',
            link: '/profile/bookmarked',
            icon: 'lni lni-bookmark',
        },
        {
            label: 'Manage Applications',
            link: '/profile/manage-applications',
            icon: 'lni lni-envelope',
        },
        {
            label: 'Manage Resumes',
            link: '/profile/manage-resumes',
            icon: 'lni lni-files',
        },
        {
            label: 'Change Password',
            link: '/profile/change-password',
            icon: 'lni lni-lock',
        },
    ]
    return (
        <div className="manage-applications section">
            <div className="container">
                <div className="alerts-inner">
                    <div className="row">
                        {/* <!-- Start Main Content --> */}
                        <div className="col-lg-4 col-12">
                            <DashboardSidebar role={user?.role} />
                        </div>
                        {/* <!-- End Main Content --> */}
                        <div className="col-lg-8 col-12">
                            <div className="job-items">
                                <div className="manage-content">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-lg-5 col-md-5">
                                            <div className="title-img">
                                                <div className="can-img">
                                                    <img
                                                        src="assets/images/jobs/manage-job1.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <h3>
                                                    Mechanical Engineer{' '}
                                                    <span>
                                                        Conzio construction
                                                    </span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>
                                                <span className="time">
                                                    Full-Time
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-3 col-md-3">
                                            <p>Nov 14th, 2023</p>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>Rejected</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="manage-content">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-lg-5 col-md-5">
                                            <div className="title-img">
                                                <div className="can-img">
                                                    <img
                                                        src="assets/images/jobs/manage-job2.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <h3>
                                                    Content Writing{' '}
                                                    <span>
                                                        Depan insider ltd.
                                                    </span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>
                                                <span className="time">
                                                    Full-Time
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-3 col-md-3">
                                            <p>Nov 14th, 2023</p>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>Processed</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="manage-content">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-lg-5 col-md-5">
                                            <div className="title-img">
                                                <div className="can-img">
                                                    <img
                                                        src="assets/images/jobs/manage-job3.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <h3>
                                                    Teacher - English{' '}
                                                    <span>Eduon education</span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>
                                                <span className="time">
                                                    Full-Time
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-3 col-md-3">
                                            <p>Nov 14th, 2023</p>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>Rejected</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="manage-content">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-lg-5 col-md-5">
                                            <div className="title-img">
                                                <div className="can-img">
                                                    <img
                                                        src="assets/images/jobs/manage-job4.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <h3>
                                                    Service Engineer{' '}
                                                    <span>
                                                        Autozon power ltd
                                                    </span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>
                                                <span className="time">
                                                    Part-Time
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-3 col-md-3">
                                            <p>Nov 14th, 2023</p>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>Approved</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="manage-content">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-lg-5 col-md-5">
                                            <div className="title-img">
                                                <div className="can-img">
                                                    <img
                                                        src="assets/images/jobs/manage-job5.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <h3>
                                                    Support Executive{' '}
                                                    <span>Saspol limited</span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>
                                                <span className="time">
                                                    Full-Time
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-3 col-md-3">
                                            <p>Nov 14th, 2023</p>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>Rejected</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="manage-content">
                                    <div className="row align-items-center justify-content-center">
                                        <div className="col-lg-5 col-md-5">
                                            <div className="title-img">
                                                <div className="can-img">
                                                    <img
                                                        src="assets/images/jobs/manage-job6.png"
                                                        alt="#"
                                                    />
                                                </div>
                                                <h3>
                                                    Research Assistant{' '}
                                                    <span>Medq medical</span>
                                                </h3>
                                            </div>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>
                                                <span className="time">
                                                    Full-Time
                                                </span>
                                            </p>
                                        </div>
                                        <div className="col-lg-3 col-md-3">
                                            <p>Nov 14th, 2023</p>
                                        </div>
                                        <div className="col-lg-2 col-md-2">
                                            <p>Approved</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Pagination --> */}
                            <div className="pagination left pagination-md-center">
                                <ul className="pagination-list">
                                    <li>
                                        <a href="manage-applications.html#">
                                            <i className="lni lni-arrow-left"></i>
                                        </a>
                                    </li>
                                    <li className="active">
                                        <a href="manage-applications.html#">
                                            1
                                        </a>
                                    </li>
                                    <li>
                                        <a href="manage-applications.html#">
                                            2
                                        </a>
                                    </li>
                                    <li>
                                        <a href="manage-applications.html#">
                                            3
                                        </a>
                                    </li>
                                    <li>
                                        <a href="manage-applications.html#">
                                            4
                                        </a>
                                    </li>
                                    <li>
                                        <a href="manage-applications.html#">
                                            <i className="lni lni-arrow-right"></i>
                                        </a>
                                    </li>
                                </ul>
                            </div>
                            {/* <!-- End Pagination --> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ManageApplicationPage
