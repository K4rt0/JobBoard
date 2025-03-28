import React, { useState, FormEvent } from 'react'
import styled from 'styled-components'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from '@/store/authStore'
import { useAuth } from '@/hooks/useAuth'

// Interfaces
interface FormData {
    fullName: string
    email: string
    password: string
    companyName: string
    role: 'Employer'
}

// Styled-components
const PageWrapper = styled.div`
    display: flex;
    min-height: 100vh;
    background-color: #f5f6f5;
`

const LeftColumn = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: #fff;
    padding: 40px;
`

const RightColumn = styled.div`
    flex: 1;
    background: url('https://i.pinimg.com/736x/86/f2/d8/86f2d80e5a47407caf29850586cd85c0.jpg')
        no-repeat center/cover;
    display: flex;
    align-items: center;
    justify-content: center;
    object-fit: cover;
`

const FormContainer = styled.div`
    max-width: 400px;
    width: 100%;
`

const Title = styled.h1`
    font-size: 28px;
    color: #333;
    margin-bottom: 20px;
    font-weight: 600;
    text-align: left;
`

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
`

const Label = styled.label`
    font-size: 14px;
    color: #555;
    margin-bottom: 8px;
    font-weight: 500;
`

const Input = styled.input`
    padding: 12px 16px;
    font-size: 14px;
    border: 1px solid #ddd;
    border-radius: 4px;
    outline: none;
    transition: border-color 0.2s ease;

    &:focus {
        border-color: #00b14f; /* TopCV's green accent */
    }

    &::placeholder {
        color: #999;
    }
`

const SubmitButton = styled.button`
    padding: 14px;
    font-size: 16px;
    color: #fff;
    background-color: #00b14f; /* TopCV's primary green */
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-weight: 600;
    transition: background-color 0.2s ease;

    &:hover {
        background-color: #009b44;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }
`

const ErrorMessage = styled.p`
    color: #ff4d4f;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
`

const LinkText = styled.a`
    font-size: 14px;
    color: #00b14f;
    text-align: center;
    text-decoration: none;
    margin-top: 15px;
    display: block;

    &:hover {
        text-decoration: underline;
    }
`

const EmployerRegistationPage: React.FC = () => {
    const { registerEmployer } = useAuth()
    const navigate = useNavigate()
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        email: '',
        password: '',
        companyName: '',
        role: 'Employer',
    })
    const [error, setError] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const success = await registerEmployer(
                formData.fullName,
                formData.email,
                formData.password,
                formData.companyName,
            )
            if (success) {
                setLoading(false)
                window.location.href = '/profile'
            } else {
                setLoading(false)
                setError('Fail to register. Please sign up again!')
            }
        } catch (err: unknown) {
            const errorMessage =
                err instanceof Error
                    ? err.message
                    : 'Đăng ký thất bại. Vui lòng thử lại.'
            setError(errorMessage)
        } finally {
            setLoading(false)
        }
    }

    return (
        <PageWrapper>
            <LeftColumn>
                <FormContainer>
                    <Title>Đăng ký nhà tuyển dụng</Title>
                    <Form onSubmit={handleSubmit}>
                        <InputWrapper>
                            <Label htmlFor="fullName">Full Name</Label>
                            <Input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                placeholder="Enter full name"
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="email">Email</Label>
                            <Input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                placeholder="Enter email"
                                required
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                required
                                minLength={6}
                            />
                        </InputWrapper>
                        <InputWrapper>
                            <Label htmlFor="companyName">Company Name</Label>
                            <Input
                                type="text"
                                id="companyName"
                                name="companyName"
                                value={formData.companyName}
                                onChange={handleChange}
                                placeholder="Enter company name"
                                required
                            />
                        </InputWrapper>
                        <SubmitButton type="submit" disabled={loading}>
                            {loading ? 'Registing...' : 'Register'}
                        </SubmitButton>
                    </Form>
                    {error && <ErrorMessage>{error}</ErrorMessage>}
                    <LinkText href="/">Register as a candidate</LinkText>
                    <LinkText href="/">
                        Already have an account? Sign in
                    </LinkText>
                </FormContainer>
            </LeftColumn>
            <RightColumn>Good Thinks Take Times</RightColumn>
        </PageWrapper>
    )
}

export default EmployerRegistationPage
