import React from 'react'
import LoginModal from './modals/LoginModal'
import SignupModal from './modals/SignUpModal'

const Header = () => {
    return (
        <>
            <header className="header" style={{ zIndex: '1000' }}>
                <div className="navbar-area">
                    <div className="container">
                        <div className="row align-items-center">
                            <div className="col-lg-12">
                                <nav className="navbar navbar-expand-lg">
                                    <a className="navbar-brand logo" href="/">
                                        <img
                                            className="logo1"
                                            src="/assets/images/logo/logo.svg"
                                            alt="Logo"
                                        />
                                    </a>
                                    <button
                                        className="navbar-toggler"
                                        type="button"
                                        data-toggle="collapse"
                                        data-target="#navbarSupportedContent"
                                        aria-controls="navbarSupportedContent"
                                        aria-expanded="false"
                                        aria-label="Toggle navigation"
                                    >
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                        <span className="toggler-icon"></span>
                                    </button>
                                    <div
                                        className="collapse navbar-collapse sub-menu-bar"
                                        id="navbarSupportedContent"
                                    >
                                        <ul
                                            id="nav"
                                            className="navbar-nav ml-auto"
                                        >
                                            <li className="nav-item">
                                                <a href="/" className="active">
                                                    Home
                                                </a>
                                            </li>
                                            <li className="nav-item">
                                                <a>Hire Freelancers</a>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <a href="/freelancer-marketplace">
                                                            Find Freelancers
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="/post-job">
                                                            Post a Job
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="nav-item">
                                                <a>Find Jobs</a>
                                                <ul className="sub-menu">
                                                    <li>
                                                        <a href="/jobs">
                                                            Find Jobs
                                                        </a>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </div>
                                    {/* <!-- navbar collapse --> */}
                                    <div className="button">
                                        <a
                                            href="javascript:"
                                            data-toggle="modal"
                                            data-target="#login"
                                            className="login"
                                        >
                                            <i className="lni lni-lock-alt"></i>{' '}
                                            Login
                                        </a>
                                        <a
                                            href="javascript:"
                                            data-toggle="modal"
                                            data-target="#signup"
                                            className="btn"
                                        >
                                            Sign Up
                                        </a>
                                    </div>
                                </nav>
                                {/* <!-- navbar --> */}
                            </div>
                        </div>
                        {/* <!-- row --> */}
                    </div>
                    {/* <!-- container --> */}
                </div>
                {/* <!-- navbar area --> */}
            </header>
            <LoginModal />
            <SignupModal />
        </>
    )
}

export default Header
