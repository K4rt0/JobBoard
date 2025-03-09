import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import React from 'react'

const ProfilePage = () => {
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
        <div className="resume section">
            <div className="container">
                <div className="resume-inner">
                    <div className="row">
                        {/* <!-- Start Main Content --> */}
                        <div className="col-lg-4 col-12">
                            <DashboardSidebar menuItems={menuItems} />
                        </div>
                        {/* <!-- End Main Content --> */}
                        <div className="col-lg-8 col-12">
                            <div className="inner-content">
                                {/* <!-- Start Personal Top Content --> */}
                                <div className="personal-top-content">
                                    <div className="row">
                                        <div className="col-lg-5 col-md-5 col-12">
                                            <div className="name-head">
                                                <a
                                                    className="mb-2"
                                                    href="resume.html#"
                                                >
                                                    <img
                                                        className="circle-54"
                                                        src="https://demo.graygrids.com/themes/jobgrids/assets/images/resume/avater.png"
                                                        alt=""
                                                    />
                                                </a>
                                                <h4>
                                                    <a
                                                        className="name"
                                                        href="resume.html#"
                                                    >
                                                        David Henricks
                                                    </a>
                                                </h4>
                                                <p>
                                                    <a
                                                        className="deg"
                                                        href="resume.html#"
                                                    >
                                                        Product Designer
                                                    </a>
                                                </p>
                                                <ul className="social">
                                                    <li>
                                                        <a href="resume.html#">
                                                            <i className="lni lni-facebook-original"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="resume.html#">
                                                            <i className="lni lni-twitter-original"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="resume.html#">
                                                            <i className="lni lni-linkedin-original"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="resume.html#">
                                                            <i className="lni lni-dribbble"></i>
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="resume.html#">
                                                            <i className="lni lni-pinterest"></i>
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <div className="col-lg-7 col-md-7 col-12">
                                            <div className="content-right">
                                                <h5 className="title-main">
                                                    Contact Info
                                                </h5>
                                                {/* <!-- Single List --> */}
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        Location
                                                    </h5>
                                                    <p>New York , USA</p>
                                                </div>
                                                {/* <!-- Single List/ */}
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        E-mail
                                                    </h5>
                                                    <p>youremail@gmail.com</p>
                                                </div>
                                                {/* <!-- Single List -->
                                            <!-- Single List --> */}
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        Phone
                                                    </h5>
                                                    <p>+999 565 562</p>
                                                </div>
                                                {/* <!-- Single List -->
                                            <!-- Single List --> */}
                                                <div className="single-list">
                                                    <h5 className="title">
                                                        Website Linked
                                                    </h5>
                                                    <p>
                                                        <a href="resume.html#">
                                                            yourwebsite.com
                                                        </a>
                                                    </p>
                                                </div>
                                                {/* <!-- Single List --> */}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <!-- End Persona/e Section --> */}
                                <div className="single-section">
                                    <h4>About</h4>
                                    <p className="font-size-4 mb-8">
                                        A talented professional with an academic
                                        background in IT and proven commercial
                                        development experience as C++ developer
                                        since 1999. Has a sound knowledge of the
                                        software development life cycle. Was
                                        involved in more than 140 software
                                        development outsourcing projects.
                                    </p>
                                    <p className="font-size-4 mb-8">
                                        Programming Languages: C/C++, .NET C++,
                                        Python, Bash, Shell, PERL, Regular
                                        expressions, Python, Active-script.
                                    </p>
                                </div>
                                {/* <!-- End Single Section --> */}
                                {/* <!-- Start Single Section --> */}
                                <div className="single-section skill">
                                    <h4>Skills</h4>
                                    <ul className="list-unstyled d-flex align-items-center flex-wrap">
                                        <li>
                                            <a href="resume.html#">Agile</a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Wireframing
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Prototyping
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Information
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Waterfall Model
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                New Layout
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Ui/Ux Design
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Web Design
                                            </a>
                                        </li>
                                        <li>
                                            <a href="resume.html#">
                                                Graphics Design
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                {/* <!-- End Single Section --> */}
                                {/* <!-- Start Single Section --> */}
                                <div className="single-section exprerience">
                                    <h4>Work Exprerience</h4>
                                    {/* <!-- Single Exp --> */}
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
                                                        Lead Product Designer
                                                    </a>
                                                </h3>
                                                <a href="resume.html#">
                                                    Airabnb
                                                </a>
                                                <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                                    <a href="resume.html#">
                                                        Jun 2020 - April 2023- 3
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
                                                        New York, USA
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Single Exp --> */}
                                    {/* <!-- Single Exp --> */}
                                    <div className="single-exp mb-30">
                                        <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                            <div className="image">
                                                <img
                                                    src="assets/images/resume/work2.png"
                                                    alt="#"
                                                />
                                            </div>
                                            <div className="w-100 mt-n2">
                                                <h3 className="mb-0">
                                                    <a href="resume.html#">
                                                        Senior UI/UX Designer
                                                    </a>
                                                </h3>
                                                <a href="resume.html#">
                                                    Google Inc
                                                </a>
                                                <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                                    <a href="resume.html#">
                                                        Jun 2020 - April 2023- 3
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
                                                        New York, USA
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Single Exp --> */}
                                </div>
                                {/* <!-- End Single Section --> */}
                                {/* <!-- Start Single Section --> */}
                                <div className="single-section education">
                                    <h4>Education</h4>
                                    {/* <!-- Sing/le Edu --> */}
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
                                                        Masters in Art Design
                                                    </a>
                                                </h3>
                                                <a href="resume.html#">
                                                    Harvard University
                                                </a>
                                                <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                                    <a href="resume.html#">
                                                        Jun 2020 - April 2023- 3
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
                                                        Brylin, USA
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Single Edu --> */}
                                    {/* <!-- Single Edu --> */}
                                    <div className="single-edu mb-30">
                                        <div className="d-flex align-items-center pr-11 mb-9 flex-wrap flex-sm-nowrap">
                                            <div className="image">
                                                <img
                                                    src="assets/images/resume/edu2.svg"
                                                    alt="#"
                                                />
                                            </div>
                                            <div className="w-100 mt-n2">
                                                <h3 className="mb-0">
                                                    <a href="resume.html#">
                                                        Bachelor in Software
                                                        Engineering
                                                    </a>
                                                </h3>
                                                <a href="resume.html#">
                                                    Manipal Institute of
                                                    Technology
                                                </a>
                                                <div className="d-flex align-items-center justify-content-md-between flex-wrap">
                                                    <a href="resume.html#">
                                                        Fed 2019 - April 2023 -
                                                        4 years{' '}
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
                                                        New York, USA
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <!-- End Single Edu --> */}
                                </div>
                                {/* <!-- End Single Section --> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProfilePage
