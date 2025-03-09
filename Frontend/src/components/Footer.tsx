import { useState } from 'react'

const Footer = () => {
  const [email, setEmail] = useState<string>('')

  const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.placeholder = ''
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    e.target.placeholder = 'Your email address'
  }

  return (
    <footer className="footer">
      {/* Footer Middle */}
      <div className="footer-middle">
        <div className="container">
          <div className="row">
            <div className="col-lg-4 col-md-6 col-12">
              {/* Single Widget */}
              <div className="f-about single-footer">
                <div className="logo">
                  <a href="#">
                    <img src="assets/images/logo/logo.svg" alt="Logo" />
                  </a>
                </div>
                <p>
                  Start building your creative website with our awesome template
                  Massive.
                </p>
                <ul className="contact-address">
                  <li>
                    <span>Address:</span> 555 Wall Street, USA, NY
                  </li>
                  <li>
                    <span>Email:</span> example@apus.com
                  </li>
                  <li>
                    <span>Call:</span> 555-555-1234
                  </li>
                </ul>
                <div className="footer-social">
                  <ul>
                    <li>
                      <a href="#">
                        <i className="lni lni-facebook-original"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="lni lni-twitter-original"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="lni lni-linkedin-original"></i>
                      </a>
                    </li>
                    <li>
                      <a href="#">
                        <i className="lni lni-pinterest"></i>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="col-lg-8 col-12">
              <div className="row">
                <div className="col-lg-4 col-md-6 col-12">
                  {/* Single Widget */}
                  <div className="single-footer f-link">
                    <h3>For Candidates</h3>
                    <ul>
                      <li>
                        <a href="#">User Dashboard</a>
                      </li>
                      <li>
                        <a href="#">CV Packages</a>
                      </li>
                      <li>
                        <a href="#">Jobs Featured</a>
                      </li>
                      <li>
                        <a href="#">Jobs Urgent</a>
                      </li>
                      <li>
                        <a href="#">Candidate List</a>
                      </li>
                      <li>
                        <a href="#">Candidates Grid</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  {/* Single Widget */}
                  <div className="single-footer f-link">
                    <h3>For Employers</h3>
                    <ul>
                      <li>
                        <a href="#">Post New</a>
                      </li>
                      <li>
                        <a href="#">Employer List</a>
                      </li>
                      <li>
                        <a href="#">Employers Grid</a>
                      </li>
                      <li>
                        <a href="#">Job Packages</a>
                      </li>
                      <li>
                        <a href="#">Jobs Listing</a>
                      </li>
                      <li>
                        <a href="#">Jobs Featured</a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="col-lg-4 col-md-6 col-12">
                  {/* Single Widget */}
                  <div className="single-footer newsletter">
                    <h3>Join Our Newsletter</h3>
                    <p>
                      Subscribe to get the latest jobs posted, candidates...
                    </p>
                    <form
                      action="https://demo.graygrids.com/themes/jobgrids/mail/mail.php"
                      method="get"
                      target="_blank"
                      className="newsletter-inner"
                    >
                      <input
                        name="EMAIL"
                        placeholder="Your email address"
                        className="common-input"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        onFocus={handleFocus}
                        onBlur={handleBlur}
                      />
                      <div className="button">
                        <button className="btn" type="submit">
                          Subscribe Now! <span className="dir-part"></span>
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className="footer-bottom">
        <div className="container">
          <div className="inner">
            <div className="row">
              <div className="col-lg-6 col-md-6 col-12">
                <div className="left">
                  <p>
                    Designed and Developed by{' '}
                    <a
                      href="https://graygrids.com/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      GrayGrids
                    </a>
                  </p>
                </div>
              </div>
              <div className="col-lg-6 col-md-6 col-12">
                <div className="right">
                  <ul>
                    <li>
                      <a href="#">Terms of use</a>
                    </li>
                    <li>
                      <a href="#">Privacy Policy</a>
                    </li>
                    <li>
                      <a href="#">FAQ</a>
                    </li>
                    <li>
                      <a href="#">Contact</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
