import React from 'react'

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
                <a href="index.html" className="btn">
                  Go To Home
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ErrorPage
