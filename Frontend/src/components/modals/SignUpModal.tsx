import React, { useState, useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { registerSchema } from '@/schemas/authSchema'
import { useAuth } from '@/hooks/useAuth'
import { useNavigate } from 'react-router-dom'

// Định nghĩa kiểu dữ liệu form
type FormData = {
    full_name: string
    email: string
    password: string
    agree_to_terms?: boolean
}

const SignupModal: React.FC<{ onSignupSuccess?: () => void }> = ({
    onSignupSuccess,
}) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm<FormData>({
        resolver: yupResolver(registerSchema),
    })
    const [loading, setLoading] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')
    const { register: registerUser } = useAuth()
    const navigate = useNavigate()
    const modalRef = useRef<HTMLDivElement>(null)

    // Hàm để đóng modal một cách an toàn
    const closeModal = () => {
        try {
            // Xử lý đóng modal bằng nhiều cách khác nhau

            // Cách 1: Sử dụng Bootstrap API nếu có
            if (window.bootstrap && modalRef.current) {
                const bsModal = window.bootstrap.Modal.getInstance(
                    modalRef.current,
                )
                if (bsModal) {
                    bsModal.hide()
                    return
                }
            }

            // Cách 2: Sử dụng jQuery nếu có
            if (typeof window.jQuery !== 'undefined') {
                window.jQuery('#signup').modal('hide')
                return
            }

            if (typeof window.$ !== 'undefined') {
                window.$('#signup').modal('hide')
                return
            }

            // Cách 3: Thêm thuộc tính trực tiếp vào DOM
            const modalElement = document.getElementById('signup')
            if (modalElement) {
                // Loại bỏ các class bootstrap
                modalElement.classList.remove('show')
                modalElement.setAttribute('aria-hidden', 'true')
                modalElement.style.display = 'none'

                // Loại bỏ backdrop
                const backdrop = document.querySelector('.modal-backdrop')
                if (backdrop && backdrop.parentNode) {
                    backdrop.parentNode.removeChild(backdrop)
                }

                // Loại bỏ class modal-open từ body
                document.body.classList.remove('modal-open')
                document.body.style.removeProperty('padding-right')
                document.body.style.overflow = ''
            }
        } catch (error) {
            console.error('Lỗi khi đóng modal:', error)
        }
    }

    const onSubmit = async (data: FormData) => {
        setLoading(true)
        setErrorMessage('')

        try {
            await registerUser(data.full_name, data.email, data.password)

            // Đóng modal trước khi chuyển hướng
            closeModal()

            // Gọi callback nếu có
            if (onSignupSuccess) {
                onSignupSuccess()
            }

            // Reset form
            reset()

            // Chuyển hướng sau khi đóng modal
            setTimeout(() => {
                navigate('/')
            }, 300) // Tăng độ trễ để đảm bảo modal đã đóng hoàn toàn
        } catch (error) {
            setErrorMessage(
                error instanceof Error ? error.message : String(error),
            )
        } finally {
            setLoading(false)
        }
    }

    // Cập nhật event listener cho nút đóng modal
    useEffect(() => {
        // Tìm nút đóng trong modal
        const closeButton = document.querySelector(
            '#signup button[data-dismiss="modal"]',
        )
        if (closeButton) {
            const handleClose = (e: Event) => {
                e.preventDefault()
                closeModal()
            }

            closeButton.addEventListener('click', handleClose)

            return () => {
                closeButton.removeEventListener('click', handleClose)
            }
        }
    }, [])

    return (
        <div
            className="modal fade form-modal"
            id="signup"
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
                                            id="full_name"
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
                                                id="agree_to_terms"
                                                {...register('agree_to_terms')}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor="agree_to_terms"
                                            >
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
                                    {errorMessage && (
                                        <div className="alert alert-danger mb-4">
                                            {errorMessage}
                                        </div>
                                    )}
                                    <div className="form-group mb-8 button">
                                        <button
                                            className="btn"
                                            type="submit"
                                            disabled={loading}
                                        >
                                            {loading
                                                ? 'Đang đăng ký...'
                                                : 'Sign Up'}
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
