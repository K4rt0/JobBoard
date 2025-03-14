import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

const schema = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
})

type FormData = {
    email: string
    password: string
}

const LoginModal: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(schema),
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setErrorMessage('')

        try {
            await login(data.email, data.password)
            console.log('data', data.email, data.password)

            navigate('/') // Chuyển hướng khi đăng nhập thành công
        } catch (error) {
            setErrorMessage(error as string)
        } finally {
            setLoading(false)
        }
    }

    return (
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
                                        Log in to continue your account <br />{' '}
                                        and explore new jobs.
                                    </p>
                                </div>
                                <div className="social-login">
                                    <ul>
                                        <li>
                                            <a className="google" href="#">
                                                <i className="lni lni-google"></i>{' '}
                                                Log in with Google
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
                                                id="password"
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
                                        <button className="btn" type="submit">
                                            Log in
                                        </button>
                                    </div>
                                    <p className="text-center create-new-account">
                                        Don’t have an account?{' '}
                                        <a href="#">Create a free account</a>
                                    </p>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginModal
