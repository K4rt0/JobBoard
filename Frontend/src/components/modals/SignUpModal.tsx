import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { registerSchema } from '@/schemas/authSchema'

// 📌 Định nghĩa kiểu dữ liệu form
type FormData = {
    full_name: string
    email: string
    password: string
    agree_to_terms?: boolean
}

const SignupModal: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(registerSchema),
    })

    const onSubmit = (data: FormData) => {
        console.log('Signup Info:', data)
        reset() // ✅ Reset form sau khi submit thành công
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
                                <form onSubmit={handleSubmit(onSubmit)}>
                                    <div className="form-group">
                                        <label
                                            htmlFor="full_name"
                                            className="label"
                                        >
                                            Full Name
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Enter your full name"
                                            {...register('full_name')}
                                        />
                                        {errors.full_name && (
                                            <p className="text-danger">
                                                {errors.full_name.message}
                                            </p>
                                        )}
                                    </div>
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
                                            {...register('email')}
                                        />
                                        {errors.email && (
                                            <p className="text-danger">
                                                {errors.email.message}
                                            </p>
                                        )}
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
                                                {...register('password')}
                                            />
                                            {errors.password && (
                                                <p className="text-danger">
                                                    {errors.password.message}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                    <div className="form-group d-flex flex-wrap justify-content-between">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                {...register('agree_to_terms')}
                                            />
                                            <label className="form-check-label">
                                                Agree to the{' '}
                                                <a href="#">
                                                    Terms & Conditions
                                                </a>
                                            </label>
                                        </div>
                                    </div>
                                    {errors.agree_to_terms && (
                                        <p className="text-danger">
                                            {errors.agree_to_terms.message}
                                        </p>
                                    )}
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
