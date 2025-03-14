import React, { useState } from 'react'

const LoginModal: React.FC = () => {
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault()
        console.log('Login Info:', { email, password })
        // Xử lý đăng nhập ở đây (Gọi API, xác thực...)
    }

    return (
        <>
            <div
                className="modal fade form-modal"
                id="login"
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
                                        <h3>Login From Here</h3>
                                        <p>
                                            Log in to continue your account{' '}
                                            <br /> and explore new jobs.
                                        </p>
                                    </div>
                                    <div className="social-login">
                                        <ul>
                                            <li>
                                                <a
                                                    className="linkedin"
                                                    href="#"
                                                >
                                                    <i className="lni lni-linkedin-original"></i>{' '}
                                                    Log in with LinkedIn
                                                </a>
                                            </li>
                                            <li>
                                                <a className="google" href="#">
                                                    <i className="lni lni-google"></i>{' '}
                                                    Log in with Google
                                                </a>
                                            </li>
                                            <li>
                                                <a
                                                    className="facebook"
                                                    href="#"
                                                >
                                                    <i className="lni lni-facebook-original"></i>{' '}
                                                    Log in with Facebook
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
                                                id="email"
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
                                                    id="password"
                                                    placeholder="Enter password"
                                                    value={password}
                                                    onChange={(e) =>
                                                        setPassword(
                                                            e.target.value,
                                                        )
                                                    }
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="form-group d-flex flex-wrap justify-content-between">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="flexCheckDefault"
                                                />
                                                <label
                                                    className="form-check-label"
                                                    htmlFor="flexCheckDefault"
                                                >
                                                    Remember password
                                                </label>
                                            </div>
                                            <a
                                                href="#"
                                                className="font-size-3 text-dodger line-height-reset"
                                            >
                                                Forget Password
                                            </a>
                                        </div>
                                        <div className="form-group mb-8 button">
                                            <button
                                                className="btn"
                                                type="submit"
                                            >
                                                Log in
                                            </button>
                                        </div>
                                        <p className="text-center create-new-account">
                                            Don’t have an account?{' '}
                                            <a href="#">
                                                Create a free account
                                            </a>
                                        </p>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default LoginModal
