import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { loginSchema } from '@/schemas/authSchema'
import { useGoogleLogin } from '@react-oauth/google'

// Định nghĩa interface cho Bootstrap Modal (có thể không cần)
declare global {
    interface Window {
        jQuery: any
        $: any
        bootstrap: any
    }
}

type FormData = {
    email: string
    password: string
}

const LoginModal: React.FC<{ onLoginSuccess: () => void }> = ({
    onLoginSuccess,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormData>({
        resolver: yupResolver(loginSchema),
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { login } = useAuth()
    const navigate = useNavigate()
    const modalRef = useRef<HTMLDivElement>(null)
    const { loginWithGoogle } = useAuth()
    // Hàm để đóng modal một cách an toàn
    const closeModal = () => {
        try {
            // Nếu đang sử dụng Bootstrap 5
            if (window.bootstrap && modalRef.current) {
                const bsModal = window.bootstrap.Modal.getInstance(
                    modalRef.current,
                )
                if (bsModal) {
                    bsModal.hide()
                }
            }
            // Nếu đang sử dụng Bootstrap 4 hoặc jQuery
            else if (window.jQuery || window.$) {
                const $ = window.jQuery || window.$
                $('#login').modal('hide')
            }
            // Fallback nếu không có cách nào hoạt động
            else {
                // Loại bỏ các class để ẩn modal
                if (modalRef.current) {
                    modalRef.current.classList.remove('show')
                    modalRef.current.style.display = 'none'
                }
                // Loại bỏ backdrop
                const backdrop = document.querySelector('.modal-backdrop')
                if (backdrop) backdrop.remove()

                // Loại bỏ class modal-open từ body
                document.body.classList.remove('modal-open')
                document.body.style.removeProperty('padding-right')
            }
        } catch (error) {
            console.error('Lỗi khi đóng modal:', error)
        }
    }

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setErrorMessage('')

        try {
            const success = await login(data.email, data.password)

            if (success) {
                closeModal()
                onLoginSuccess()
                toast.success('Login successful!')
                setTimeout(() => navigate('/'), 100)
            } else {
                // Không đóng modal nếu đăng nhập thất bại
                setErrorMessage('Invalid email or password')
            }
        } catch (error) {
            setErrorMessage('An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    const googleLogin = useGoogleLogin({
        onSuccess: async (tokenResponse) => {
            try {
                console.log('Google Token Response:', tokenResponse)

                await loginWithGoogle(tokenResponse)
                closeModal()
                onLoginSuccess()
                toast.success('Google login successful!')
                navigate('/')
            } catch (error) {
                console.error('Google Login Failed:', error)
            }
        },
        onError: () => console.log('Google Login Failed'),
    })

    // Cập nhật event listener cho nút đóng
    useEffect(() => {
        const closeButton = document.querySelector('[data-dismiss="modal"]')
        if (closeButton) {
            closeButton.addEventListener('click', closeModal)
        }

        return () => {
            if (closeButton) {
                closeButton.removeEventListener('click', closeModal)
            }
        }
    }, [])

    return (
        <div
            className="modal fade form-modal"
            id="login"
            ref={modalRef}
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
                                    <ul className="d-flex justify-content-center">
                                        <li className="w-100">
                                            <a
                                                className="google"
                                                href="#"
                                                onClick={() => googleLogin()}
                                            >
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
                                        <button
                                            className="btn"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? 'Đang đăng nhập...'
                                                : 'Log in'}
                                        </button>
                                    </div>
                                    {errorMessage && (
                                        <div className="alert alert-danger mb-4">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <p className="text-center create-new-account">
                                        Don&apos;t have an account?{' '}
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
