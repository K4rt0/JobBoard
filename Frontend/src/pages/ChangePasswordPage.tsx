import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import React from 'react'

const ChangePasswordPage = () => {
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
            link: 'manage-applications.html',
            icon: 'lni lni-envelope',
        },
        {
            label: 'Manage Resumes',
            link: 'manage-resumes.html',
            icon: 'lni lni-files',
        },
        {
            label: 'Change Password',
            link: 'change-password',
            icon: 'lni lni-lock',
        },
        { label: 'Sign Out', link: 'index.html', icon: 'lni lni-upload' },
    ]
    return (
        <div className="change-password section">
            <div className="container">
                <div className="alerts-inner">
                    <div className="row">
                        {/* <!-- Start Main Content --> */}
                        <div className="col-lg-4 col-12">
                            <DashboardSidebar menuItems={menuItems} />
                        </div>
                        {/* <!-- End Main Content --> */}
                        <div className="col-lg-8">
                            <div className="password-content">
                                <h3>Change Password</h3>
                                <p>
                                    Here you can change your password please
                                    fill up the form.
                                </p>
                                <form>
                                    <div className="row">
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>Old Password</label>
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="password"
                                                />
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group">
                                                <label>New Password</label>
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="password"
                                                />
                                                <i className="bx bxs-low-vision"></i>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="form-group last">
                                                <label>Confirm Password</label>
                                                <input
                                                    className="form-control"
                                                    type="password"
                                                    name="password"
                                                />
                                                <i className="bx bxs-low-vision"></i>
                                            </div>
                                        </div>
                                        <div className="col-lg-12">
                                            <div className="button">
                                                <button className="btn">
                                                    Save Change
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChangePasswordPage
