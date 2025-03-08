import React from 'react'

const JobDetailPage = () => {
    return (
        <div className="job-details section">
            <div className="container">
                <div className="row mb-n5">
                    {/* <!-- Job List Details Start --> */}
                    <div className="col-lg-8 col-12">
                        <div className="job-details-inner">
                            <div className="job-details-head row mx-0">
                                <div className="company-logo col-auto">
                                    <a
                                        href="job-details.html#"
                                        style={{
                                            borderRadius: '4px',
                                            overflow: 'hidden',
                                        }}
                                    >
                                        <img
                                            src="assets/images/universal-image/job-details.png"
                                            alt="Company Logo"
                                        />
                                    </a>
                                </div>
                                <div className="salary-type col-auto order-sm-3">
                                    <span className="salary-range">
                                        $5000 - $8000
                                    </span>
                                    <span className="badge badge-success">
                                        Full Time
                                    </span>
                                </div>
                                <div className="content col">
                                    <h5 className="title">
                                        Website front end development
                                    </h5>
                                    <ul className="meta">
                                        <li>
                                            <strong className="text-primary">
                                                <a href="http://www.graygrids.com">
                                                    GrayGrids
                                                </a>
                                            </strong>
                                        </li>
                                        <li>
                                            <i className="lni lni-map-marker"></i>{' '}
                                            2023 Willshire Glen, GA-30009
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="job-details-body">
                                <h6 className="mb-3">Job Description</h6>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur,
                                    adipisicing elit. Similique, ex iusto!
                                    Tenetur iusto dolore amet voluptates esse?
                                    Ut debitis perferendis, impedit ullam ea
                                    officia sapiente soluta cupiditate molestiae
                                    eius enim aut laboriosam, saepe deleniti.
                                    Excepturi nobis amet fugit ipsa corrupti!
                                </p>
                                <p>
                                    Lorem ipsum dolor sit amet consectetur
                                    adipisicing elit. Quo ratione odit qui
                                    inventore maiores labore tenetur earum! Quam
                                    eaque, deleniti quibusdam deserunt quos
                                    reprehenderit dolor, in quo voluptates
                                    maxime nostrum.
                                </p>
                                <h6 className="mb-3 mt-4">Responsibilities</h6>
                                <ul>
                                    <li>
                                        Proven work experienceas a web designer
                                    </li>
                                    <li>
                                        Demonstrable graphic design skills with
                                        a strong portfolio
                                    </li>
                                    <li>
                                        Proficiency in HTML, CSS and JavaScript
                                        for rapid prototyping
                                    </li>
                                    <li>
                                        Experience working in an Agile/Scrum
                                        development process
                                    </li>
                                    <li>
                                        Proven work experienceas a web designer
                                    </li>
                                    <li>
                                        Excellent visual design skills with
                                        sensitivity to user-system interaction
                                    </li>
                                    <li>
                                        Ability to solve problems creatively and
                                        effectively
                                    </li>
                                    <li>
                                        Proven work experienceas a web designer
                                    </li>
                                    <li>
                                        Up-to-date with the latest Web trends,
                                        techniques and technologies
                                    </li>
                                    <li>
                                        BS/MS in Human-Computer Interaction,
                                        Interaction Design or a Visual Arts
                                        subject
                                    </li>
                                </ul>
                                <h6 className="mb-3 mt-4">
                                    Education + Experience
                                </h6>
                                <ul>
                                    <li>
                                        Advanced degree or equivalent experience
                                        in graphic and web design
                                    </li>
                                    <li>
                                        3 or more years of professional design
                                        experience
                                    </li>
                                    <li>Direct response email experience</li>
                                    <li>Ecommerce website design experience</li>
                                    <li>
                                        Familiarity with mobile and web apps
                                        preferred
                                    </li>
                                    <li>
                                        Excellent communication skills, most
                                        notably a demonstrated ability to
                                        solicit and address creative and design
                                        feedback
                                    </li>
                                    <li>
                                        Must be able to work under pressure and
                                        meet deadlines while maintaining a
                                        positive attitude and providing
                                        exemplary customer service
                                    </li>
                                    <li>
                                        Ability to work independently and to
                                        carry out assignments to completion
                                        within parameters of instructions given,
                                        prescribed routines, and standard
                                        accepted practices
                                    </li>
                                </ul>
                                <h6 className="mb-3 mt-4">Benefits</h6>
                                <ul>
                                    <li>Medical insurance</li>
                                    <li>Dental insurance</li>
                                    <li>Vision insurance</li>
                                    <li>
                                        Supplemental benefits (Short Term
                                        Disability, Cancer & Accident).
                                    </li>
                                    <li>
                                        Employer-sponsored Basic Life & AD&D
                                        Insurance
                                    </li>
                                    <li>
                                        Employer-sponsored Long Term Disability
                                    </li>
                                    <li>
                                        Employer-sponsored Value Adds – Fresh
                                        Beanies
                                    </li>
                                    <li>401(k)with matching</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    {/* <!-- Job List Details End --> */}
                    {/* <!-- Job Sidebar Wrap Start --> */}
                    <div className="col-lg-4 col-12">
                        <div className="job-details-sidebar">
                            {/* <!-- Sidebar (Apply Buttons) Start --> */}
                            <div className="sidebar-widget">
                                <div className="inner">
                                    <div className="row m-n2 button">
                                        <div className="col-xl-auto col-lg-12 col-sm-auto col-12 p-2">
                                            <a
                                                href="bookmarked.html"
                                                className="d-block btn"
                                            >
                                                <i className="fa fa-heart-o mr-1"></i>{' '}
                                                Save Job
                                            </a>
                                        </div>
                                        <div className="col-xl-auto col-lg-12 col-sm-auto col-12 p-2">
                                            <a
                                                href="job-details.html"
                                                className="d-block btn btn-alt"
                                            >
                                                Apply Now
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Sidebar (Apply Buttons) End --> */}
                            {/* <!-- Sidebar (Job Overview) Start --> */}
                            <div className="sidebar-widget">
                                <div className="inner">
                                    <h6 className="title">Job Overview</h6>
                                    <ul className="job-overview list-unstyled">
                                        <li>
                                            <strong>Published on:</strong> Nov
                                            6, 2023
                                        </li>
                                        <li>
                                            <strong>Vacancy:</strong> 02
                                        </li>
                                        <li>
                                            <strong>Employment Status:</strong>{' '}
                                            Full-time
                                        </li>
                                        <li>
                                            <strong>Experience:</strong> 2 to 3
                                            year(s)
                                        </li>
                                        <li>
                                            <strong>Job Location:</strong>{' '}
                                            Willshire Glen
                                        </li>
                                        <li>
                                            <strong>Salary:</strong> $5k - $8k
                                        </li>
                                        <li>
                                            <strong>Gender:</strong> Any
                                        </li>
                                        <li>
                                            <strong>
                                                Application Deadline:
                                            </strong>{' '}
                                            Dec 15, 2023
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            {/* <!-- Sidebar (Job Overview) End --> */}

                            {/* <!-- Sidebar (Job Location) Start --> */}
                            <div className="sidebar-widget">
                                <div className="inner">
                                    <h6 className="title">Job Location</h6>
                                    <div
                                        className="mapouter"
                                        style={{
                                            position: 'relative',
                                            textAlign: 'right',
                                            height: '300px',
                                            width: '100%',
                                        }}
                                    >
                                        <div
                                            className="gmap_canvas"
                                            style={{
                                                overflow: 'hidden',
                                                background: 'none',
                                                height: '300px',
                                                width: '100%',
                                            }}
                                        >
                                            <iframe
                                                width="100%"
                                                height="300"
                                                id="gmap_canvas"
                                                src="https://maps.google.com/maps?q=New%20York&t=&z=13&ie=UTF8&iwloc=&output=embed"
                                                style={{ border: 'none' }}
                                                loading="lazy"
                                            ></iframe>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* <!-- Sidebar (Job Location) End --> */}
                        </div>
                    </div>
                    {/* <!-- Job Sidebar Wrap End --> */}
                </div>
            </div>
        </div>
    )
}

export default JobDetailPage
