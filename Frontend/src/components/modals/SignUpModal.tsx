import React, { useState } from 'react'

const SignupModal: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')
    const [confirmPassword, setConfirmPassword] = useState<string>('')
    const [agreeToTerms, setAgreeToTerms] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()

        if (password !== confirmPassword) {
            setError('Passwords do not match!')
            return
        }

        console.log('Signup Info:', { email, password, agreeToTerms })

        // Reset form after successful submission
        setEmail('')
        setPassword('')
        setConfirmPassword('')
        setAgreeToTerms(false)
        setError('')
    }

    return (
        <div
            className="modal fade form-modal"
            id="signup"
            tabIndex={-1}
            aria-hidden="true"
        >
            <div className="modal-dialog max-width-px-840 position-relative">
                <button
                    type="button"
                    className="circle-32 btn-reset bg-white pos-abs-tr mt-md-n6 mr-lg-n6 focus-reset z-index-supper"
                    data-dismiss="modal"
                >
                    <i className="lni lni-close"></i>
                </button>
                <div className="login-modal-main">
                    <div className="row no-gutters">
                        <div className="col-12">
                            <div className="row">
                                <div className="heading">
                                    <h3>
                                        Create a free Account <br /> Today
                                    </h3>
                                    <p>
                                        Create your account to continue <br />{' '}
                                        and explore new jobs.
                                    </p>
                                </div>
                                <div className="social-login">
                                    <ul>
                                        <li>
                                            <a className="google" href="#">
                                                <i className="lni lni-google"></i>{' '}
                                                Import from Google
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                                <div className="or-devider">
                                    <span>Or</span>
                                </div>
                                <form onSubmit={handleSubmit}>
                                    <div className="form-group">
                                        <label
                                            htmlFor="email"
                                            className="label"
                                        >
                                            E-mail
                                        </label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            placeholder="example@gmail.com"
                                            value={email}
                                            onChange={(e) =>
                                                setEmail(e.target.value)
                                            }
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label
                                            htmlFor="password"
                                            className="label"
                                        >
                                            Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Enter password"
                                                value={password}
                                                onChange={(e) =>
                                                    setPassword(e.target.value)
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label
                                            htmlFor="confirmPassword"
                                            className="label"
                                        >
                                            Confirm Password
                                        </label>
                                        <div className="position-relative">
                                            <input
                                                type="password"
                                                className="form-control"
                                                placeholder="Confirm password"
                                                value={confirmPassword}
                                                onChange={(e) =>
                                                    setConfirmPassword(
                                                        e.target.value,
                                                    )
                                                }
                                                required
                                            />
                                        </div>
                                    </div>
                                    {error && (
                                        <p className="text-danger">{error}</p>
                                    )}
                                    <div className="form-group d-flex flex-wrap justify-content-between">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="agreeToTerms"
                                                checked={agreeToTerms}
                                                onChange={() =>
                                                    setAgreeToTerms(
                                                        !agreeToTerms,
                                                    )
                                                }
                                                required
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="agreeToTerms"
                                            >
                                                Agree to the{' '}
                                                <a href="#">
                                                    Terms & Conditions
                                                </a>
                                            </label>
                                        </div>
                                    </div>
                                    <div className="form-group mb-8 button">
                                        <button className="btn" type="submit">
                                            Sign Up
                                        </button>
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

export default SignupModal
