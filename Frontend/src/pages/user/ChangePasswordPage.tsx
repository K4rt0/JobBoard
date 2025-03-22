import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import DashboardSidebar from '@/components/sidebars/DashboardSidebar'
import { Button, Form } from 'react-bootstrap'
import { toast } from 'react-toastify'
import { changePassword } from '@/services/userService'
import { changePasswordSchema } from '@/schemas/userSchema'
import { useAuth } from '@/hooks/useAuth'

// Thêm CSS tùy chỉnh để khớp với giao diện
const customStyles = `
  .password-content {
    background: #fff;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  .form-group {
    margin-bottom: 1.5rem;
  }

  .form-label {
    font-weight: 500;
    color: #333;
  }

  .form-control {
    border: 1px solid #ced4da;
    border-radius: 4px;
    padding: 0.75rem 1rem;
    font-size: 1rem;
    height: auto;
  }

  .btn-primary {
    background-color: #007bff;
    border-color: #007bff;
    padding: 0.75rem 1.5rem;
    font-weight: 500;
    border-radius: 4px;
  }

  .btn-primary:hover {
    background-color: #0056b3;
    border-color: #0056b3;
  }
  
  .password-field-container {
    position: relative;
  }
  
  .password-toggle {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: transparent;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 0;
    font-size: 1.25rem;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  }
  
  .password-toggle:hover {
    color: #495057;
  }
  
  .password-field-container input {
    padding-right: 40px;
  }
`

const ChangePasswordPage = () => {
    const [showOldPassword, setShowOldPassword] = useState(false)
    const [showNewPassword, setShowNewPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const { user } = useAuth()
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset,
    } = useForm({
        resolver: yupResolver(changePasswordSchema),
    })

    const onSubmit = async (data: any) => {
        try {
            await changePassword({
                old_password: data.oldPassword,
                new_password: data.newPassword,
                retype_new_password: data.retypeNewPassword,
            })
            toast.success('Change password successfully')
            reset()
        } catch (error) {
            toast.error('Change password failed')
        }
    }

    const togglePasswordVisibility = (
        field: 'old' | 'new' | 'confirm',
    ): void => {
        switch (field) {
            case 'old':
                setShowOldPassword(!showOldPassword)
                break
            case 'new':
                setShowNewPassword(!showNewPassword)
                break
            case 'confirm':
                setShowConfirmPassword(!showConfirmPassword)
                break
            default:
                break
        }
    }

    const menuItems = [
        {
            label: 'My Profile',
            link: '/profile',
            icon: 'lni lni-clipboard',
            active: true,
        },
        {
            label: 'Bookmarked Jobs',
            link: '/profile/bookmarked',
            icon: 'lni lni-bookmark',
        },
        {
            label: 'Manage Applications',
            link: '/profile/manage-applications',
            icon: 'lni lni-envelope',
        },
        {
            label: 'Manage Resumes',
            link: '/profile/manage-resumes',
            icon: 'lni lni-files',
        },
        {
            label: 'Change Password',
            link: '/profile/change-password',
            icon: 'lni lni-lock',
        },
    ]

    return (
        <>
            <style>{customStyles}</style>
            <div
                className="change-password section"
                style={{ background: '#f5f7fa', minHeight: '100vh' }}
            >
                <div className="container">
                    <div className="alerts-inner">
                        <div className="row">
                            {/* Sidebar */}
                            <div className="col-lg-4 col-12">
                                <DashboardSidebar role={user?.role} />
                            </div>

                            {/* Main Content */}
                            <div className="col-lg-8">
                                <div className="password-content">
                                    <h3 className="mb-3">Change Password</h3>
                                    <p className="text-muted mb-4">
                                        Update your password securely.
                                    </p>

                                    <Form onSubmit={handleSubmit(onSubmit)}>
                                        {/* Old Password */}
                                        <Form.Group className="mb-4">
                                            <Form.Label>
                                                Old Password
                                            </Form.Label>
                                            <div className="password-field-container">
                                                <Form.Control
                                                    type={
                                                        showOldPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    {...register('oldPassword')}
                                                    placeholder="Enter old password"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() =>
                                                        togglePasswordVisibility(
                                                            'old',
                                                        )
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            showOldPassword
                                                                ? 'bx bx-show'
                                                                : 'bx bx-hide'
                                                        }
                                                    ></i>
                                                </button>
                                            </div>
                                            <p className="text-danger small mt-1">
                                                {errors.oldPassword?.message}
                                            </p>
                                        </Form.Group>

                                        {/* New Password */}
                                        <Form.Group className="mb-4">
                                            <Form.Label>
                                                New Password
                                            </Form.Label>
                                            <div className="password-field-container">
                                                <Form.Control
                                                    type={
                                                        showNewPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    {...register('newPassword')}
                                                    placeholder="Enter new password"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() =>
                                                        togglePasswordVisibility(
                                                            'new',
                                                        )
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            showNewPassword
                                                                ? 'bx bx-show'
                                                                : 'bx bx-hide'
                                                        }
                                                    ></i>
                                                </button>
                                            </div>
                                            <p className="text-danger small mt-1">
                                                {errors.newPassword?.message}
                                            </p>
                                        </Form.Group>

                                        {/* Retype New Password */}
                                        <Form.Group className="mb-4">
                                            <Form.Label>
                                                Confirm New Password
                                            </Form.Label>
                                            <div className="password-field-container">
                                                <Form.Control
                                                    type={
                                                        showConfirmPassword
                                                            ? 'text'
                                                            : 'password'
                                                    }
                                                    {...register(
                                                        'retypeNewPassword',
                                                    )}
                                                    placeholder="Retype new password"
                                                />
                                                <button
                                                    type="button"
                                                    className="password-toggle"
                                                    onClick={() =>
                                                        togglePasswordVisibility(
                                                            'confirm',
                                                        )
                                                    }
                                                >
                                                    <i
                                                        className={
                                                            showConfirmPassword
                                                                ? 'bx bx-show'
                                                                : 'bx bx-hide'
                                                        }
                                                    ></i>
                                                </button>
                                            </div>
                                            <p className="text-danger small mt-1">
                                                {
                                                    errors.retypeNewPassword
                                                        ?.message
                                                }
                                            </p>
                                        </Form.Group>

                                        <Button
                                            className="btn btn-primary"
                                            type="submit"
                                        >
                                            Save Change{' '}
                                        </Button>
                                    </Form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ChangePasswordPage
