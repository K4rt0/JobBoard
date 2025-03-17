import React, { useState, ChangeEvent, FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import styled from 'styled-components'

// Create interface for the Input component to accept custom props
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    hasIcon?: boolean
}

// Styled Components (giữ nguyên)
const PageContainer = styled.div`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #f0f4ff 0%, #e6eeff 100%);
    font-family: 'Inter', sans-serif;
    padding: 20px;
`

const LoginCard = styled.div`
    background: #ffffff;
    padding: 40px;
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.08);
    width: 480px;
    max-width: 100%;
`

const LogoContainer = styled.div`
    text-align: center;
    margin-bottom: 35px;
`

const LogoImage = styled.img`
    max-width: 160px;
    height: auto;
`

const Title = styled.h1`
    font-size: 26px;
    color: #1a202c;
    font-weight: 700;
    text-align: center;
    margin-bottom: 14px;
`

const Subtitle = styled.p`
    text-align: center;
    color: #718096;
    margin-bottom: 36px;
    font-size: 15px;
    line-height: 1.5;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 22px;
`

const InputGroup = styled.div`
    position: relative;
`

const InputLabel = styled.label`
    display: block;
    margin-bottom: 8px;
    font-size: 14px;
    font-weight: 500;
    color: #4a5568;
`

const Input = styled.input<InputProps>`
    width: 100%;
    padding: 14px 16px;
    padding-left: ${(props) => (props.hasIcon ? '46px' : '16px')};
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    font-size: 15px;
    transition: all 0.2s ease;
    background: #f8fafc;

    &:focus {
        outline: none;
        border-color: #4f6ef7;
        box-shadow: 0 0 0 3px rgba(79, 110, 247, 0.15);
        background: #ffffff;
    }

    &::placeholder {
        color: #a0aec0;
    }
`

const InputIcon = styled.div`
    position: absolute;
    left: 16px;
    top: 38px;
    color: #718096;
`

const RememberForgotRow = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 6px;
`

const RememberMe = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
`

const CheckboxContainer = styled.div`
    position: relative;
    display: flex;
    align-items: center;
`

const Checkbox = styled.input`
    width: 18px;
    height: 18px;
    accent-color: #4f6ef7;
    cursor: pointer;
`

const RememberLabel = styled.label`
    font-size: 14px;
    color: #4a5568;
    cursor: pointer;
`

const ForgotLink = styled.a`
    color: #4f6ef7;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.2s ease;
    font-size: 14px;

    &:hover {
        color: #3b5ce9;
        text-decoration: underline;
    }
`

const LoginButton = styled.button`
    padding: 14px 24px;
    background: #4f6ef7;
    color: #ffffff;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    font-size: 16px;
    font-weight: 600;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(79, 110, 247, 0.2);
    margin-top: 12px;
    position: relative;
    overflow: hidden;

    &:hover {
        background: #3b5ce9;
        box-shadow: 0 6px 16px rgba(79, 110, 247, 0.3);
    }

    &:active {
        transform: translateY(1px);
    }
`

const ReturnLink = styled.div`
    text-align: center;
    margin-top: 32px;
    font-size: 14px;
    color: #718096;

    a {
        color: #4f6ef7;
        text-decoration: none;
        font-weight: 500;
        transition: color 0.2s ease;
        margin-left: 5px;

        &:hover {
            color: #3b5ce9;
            text-decoration: underline;
        }
    }
`

const ErrorMessage = styled.p`
    color: red;
    text-align: center;
    font-size: 14px;
    margin-bottom: 10px;
`

// SVG Icons
const EmailIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
        <polyline points="22,6 12,13 2,6"></polyline>
    </svg>
)

const LockIcon = () => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
    >
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
)

// Main Admin Login Component
const AdminLoginPage: React.FC = () => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [rememberMe, setRememberMe] = useState(false)
    const [error, setError] = useState('')
    const navigate = useNavigate()

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        console.log('Dữ liệu gửi đi:', { username, password })

        try {
            const response = await fetch(
                'http://localhost:3000/api/v1/admin/login',
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username,
                        password,
                    }),
                },
            )

            const data = await response.json()
            console.log('Status:', response.status, 'Phản hồi:', data)

            if (response.ok) {
                console.log('Access Token:', data.data.access_token)
                localStorage.setItem('access-token', data.data.access_token) // Key là access-token
                console.log(
                    'Token trong localStorage:',
                    localStorage.getItem('access-token'),
                ) // Kiểm tra ngay sau khi lưu
                navigate('/admin/dashboard')
            } else {
                setError(
                    data.message || 'Đăng nhập thất bại. Vui lòng thử lại!',
                )
            }
        } catch (error) {
            console.error('Chi tiết lỗi:', error)
            setError('Có lỗi xảy ra. Vui lòng kiểm tra kết nối!')
        }
    }

    return (
        <PageContainer>
            <LoginCard>
                <LogoContainer>
                    <LogoImage
                        src="/assets/images/logo/logo.svg"
                        alt="Company Logo"
                    />
                </LogoContainer>
                <Title>Admin Dashboard</Title>
                <Subtitle>
                    Sign in to access your administration portal
                </Subtitle>

                {error && <ErrorMessage>{error}</ErrorMessage>}

                <Form onSubmit={handleSubmit}>
                    <InputGroup>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <InputIcon>
                            <EmailIcon />
                        </InputIcon>
                        <Input
                            type="text"
                            id="username"
                            placeholder="admin"
                            value={username}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setUsername(e.target.value)
                            }
                            required
                            hasIcon
                        />
                    </InputGroup>

                    <InputGroup>
                        <InputLabel htmlFor="password">Password</InputLabel>
                        <InputIcon>
                            <LockIcon />
                        </InputIcon>
                        <Input
                            type="password"
                            id="password"
                            placeholder="••••••••"
                            value={password}
                            onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                setPassword(e.target.value)
                            }
                            required
                            hasIcon
                        />
                    </InputGroup>

                    <RememberForgotRow>
                        <RememberMe>
                            <CheckboxContainer>
                                <Checkbox
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(
                                        e: ChangeEvent<HTMLInputElement>,
                                    ) => setRememberMe(e.target.checked)}
                                />
                            </CheckboxContainer>
                            <RememberLabel htmlFor="remember">
                                Remember me
                            </RememberLabel>
                        </RememberMe>
                        <ForgotLink href="/forgot-password">
                            Forgot password?
                        </ForgotLink>
                    </RememberForgotRow>

                    <LoginButton type="submit">Sign In</LoginButton>
                </Form>

                <ReturnLink>
                    Not an administrator? <a href="/">Return to main site</a>
                </ReturnLink>
            </LoginCard>
        </PageContainer>
    )
}

export default AdminLoginPage
