import React from 'react'
import { Link } from 'react-router-dom'

const ErrorPage = () => {
    return (
        <div className="error-area">
            <div className="d-table">
                <div className="d-table-cell">
                    <div className="container">
                        <div className="error-content">
                            <h1>Opps!</h1>
                            <h2>Here Is Some Problem</h2>
                            <p>The page you are looking for it maybe deleted</p>
                            <div className="button">
                                <Link to={'/'} className="btn">
                                    Go To Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ErrorPage
