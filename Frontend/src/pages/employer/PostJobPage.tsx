import React, { useState, useCallback, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axiosInstance, { proactiveTokenRefresh } from '@/services/axiosInstance'
import { fetchCategories } from '@/services/categoryService' // Đã có sẵn trong code
import { getSkillsList } from '@/services/skillService'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios, { AxiosError } from 'axios'
import { Helmet } from 'react-helmet'
import sanitizeHtml from 'sanitize-html'

interface Province {
    name: string
    code: number
    division_type: string
    phone_code: number
    codename: string
    districts: Array<{
        name: string
        code: number
        codename: string
        division_type: string
        province_code: number
        wards: null | any[]
    }> | null
}

interface Category {
    _id: string
    name: string
}

interface ErrorResponse {
    message?: string
}

const jobFormSchema = yup.object().shape({
    title: yup.string().min(3).max(100).required('Job title is required'),
    category: yup.string().required('Category is required'),
    jobType: yup.string().required('Job type is required'),
    deadline: yup.string().required('Application deadline is required'),
    salary: yup
        .object({
            min: yup.number().min(0).required('Minimum salary is required'),
            max: yup
                .number()
                .min(0)
                .required('Maximum salary is required')
                .test(
                    'max-greater-than-min',
                    'Maximum salary must be greater than minimum salary',
                    function (value) {
                        return value >= (this.parent.min || 0)
                    },
                ),
        })
        .required(),
    description: yup.string().max(1000).required('Job description is required'),
    companyName: yup.string().required('Company name is required'),
    industry: yup.string(),
    companyDescription: yup.string(),
    recruiterName: yup.string().required('Recruiter name is required'),
    recruiterEmail: yup
        .string()
        .email()
        .required('Recruiter email is required'),
    phoneNumber: yup
        .string()
        .matches(/^[0-9]{10,11}$/, 'Phone number must be 10-11 digits')
        .required('Phone number is required'),
    termsAgreed: yup.boolean().oneOf([true], 'You must agree to the terms'),
    skills: yup
        .array()
        .of(yup.string())
        .min(1, 'At least one skill is required'),
    gender: yup
        .string()
        .oneOf(['Male', 'Female', 'Any'])
        .required('Gender is required'),
    location: yup.string().required('Location is required'),
    benefits: yup.string().required('At least one benefit is required'),
    quantity: yup.number().min(1).required('Number of vacancies is required'),
    experience: yup.number().min(0).required('Experience is required'),
})

type JobFormData = yup.InferType<typeof jobFormSchema>

const useJobFormData = (authToken: string | null) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [skills, setSkills] = useState<{ _id: string; name: string }[]>([])
    const [provinces, setProvinces] = useState<Province[]>([])
    const [loading, setLoading] = useState({
        categories: false,
        skills: false,
        provinces: false,
    })

    const fetchData = useCallback(async () => {
        const cached = JSON.parse(localStorage.getItem('jobFormData') || '{}')
        if (
            cached.categories?.length &&
            cached.skills?.length &&
            cached.provinces?.length
        ) {
            setCategories(cached.categories)
            setSkills(cached.skills)
            setProvinces(cached.provinces)
            return
        }

        setLoading({ categories: true, skills: true, provinces: true })
        try {
            const [categoryData, skillData, provinceResponse] =
                await Promise.all([
                    fetchCategories(1, 100, 'all', '').finally(() =>
                        setLoading((l) => ({ ...l, categories: false })),
                    ),
                    getSkillsList().finally(() =>
                        setLoading((l) => ({ ...l, skills: false })),
                    ),
                    axios
                        .get('https://provinces.open-api.vn/api/?depth=2')
                        .finally(() =>
                            setLoading((l) => ({ ...l, provinces: false })),
                        ),
                ])
            const newCategories = categoryData.data || [] // Lấy mảng categories từ response
            const newSkills = skillData || []
            const newProvinces = provinceResponse.data || []
            setCategories(newCategories)
            setSkills(newSkills)
            setProvinces(newProvinces)
            localStorage.setItem(
                'jobFormData',
                JSON.stringify({
                    categories: newCategories,
                    skills: newSkills,
                    provinces: newProvinces,
                }),
            )
        } catch (error) {
            toast.error('Error fetching data.')
            console.error(error)
        }
    }, [authToken])

    return { categories, skills, provinces, fetchData, loading }
}

const PostJobPage = () => {
    const [authUser, setAuthUser] = useState(useAuthStore.getState().user)
    const { categories, skills, provinces, fetchData, loading } =
        useJobFormData(authUser?.access_token || null)
    const navigate = useNavigate()
    const [showConfirm, setShowConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<JobFormData>({
        resolver: yupResolver(jobFormSchema),
        mode: 'onChange',
        defaultValues: {
            title: '',
            category: '',
            jobType: '',
            deadline: '',
            salary: { min: 0, max: 0 },
            description: '',
            companyName: '',
            industry: '',
            companyDescription: '',
            recruiterName: authUser?.full_name || '',
            recruiterEmail: authUser?.email || '',
            phoneNumber: '',
            termsAgreed: false,
            skills: [],
            gender: 'Any',
            location: '',
            benefits: '',
            quantity: 1,
            experience: 0,
        },
    })

    useEffect(() => {
        const unsubscribe = useAuthStore.subscribe((state) =>
            setAuthUser(state.user),
        )
        fetchData()
        const interval = setInterval(
            () => proactiveTokenRefresh(),
            5 * 60 * 1000,
        )
        return () => {
            unsubscribe()
            clearInterval(interval)
        }
    }, [fetchData])

    const onSubmit = async (data: JobFormData) => {
        try {
            await proactiveTokenRefresh()
            const sanitizedData = {
                ...data,
                description: sanitizeHtml(data.description),
                benefits: sanitizeHtml(data.benefits),
            }

            const benefitsArray = sanitizedData.benefits
                .split('\n')
                .map((benefit: string) => benefit.trim())
                .filter((benefit: string) => benefit.length > 0)
            const selectedProvince = provinces.find(
                (p) => p.code === parseInt(sanitizedData.location),
            )
            const locationName = selectedProvince
                ? selectedProvince.name
                : sanitizedData.location

            const payload = {
                title: sanitizedData.title,
                salary: {
                    min: sanitizedData.salary.min,
                    max: sanitizedData.salary.max,
                },
                location: locationName,
                description: sanitizedData.description,
                expired_at: new Date(sanitizedData.deadline).getTime(),
                category_id: sanitizedData.category,
                quantity: sanitizedData.quantity,
                skills: sanitizedData.skills,
                experience: sanitizedData.experience,
                gender: sanitizedData.gender,
                requirements: sanitizedData.description
                    .split('\n')
                    .map((req: string) => req.trim())
                    .filter((req: string) => req.length > 0),
                benefits: benefitsArray,
                contact: {
                    full_name: sanitizedData.recruiterName,
                    email: sanitizedData.recruiterEmail,
                    phone_number: sanitizedData.phoneNumber,
                },
                job_type: [sanitizedData.jobType.toLowerCase()], // Đảm bảo định dạng đúng
                status: 'opening', // Xác nhận giá trị này có phù hợp không
            }
            console.log(
                'Payload gửi lên server:',
                JSON.stringify(payload, null, 2),
            ) // Thêm log
            const response = await axiosInstance.post(
                '/project/create',
                payload,
                {
                    timeout: 15000,
                },
            )
            console.log('Response từ server:', response.data)
            toast.success('Job posted successfully!')
            navigate('/jobs')
        } catch (error) {
            const axiosError = error as AxiosError<ErrorResponse>
            const errorMessage =
                axiosError.response?.data?.message ||
                'Failed to post job. Please check your input or try again.'
            console.error('Lỗi từ server:', axiosError.response?.data)
            toast.error(errorMessage)
        }
    }

    if (!authUser) {
        navigate('/login')
        return null
    }

    return (
        <>
            <Helmet>
                <title>Post a Job - JobGrids</title>
                <meta
                    name="description"
                    content="Create and post your job listing easily."
                />
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} />
            <section className="job-post py-5 bg-light pt-5">
                <div className="container pt-5">
                    <div className="row justify-content-center pt-3">
                        <div className="col-lg-10 col-12">
                            <div className="card shadow-sm p-4 job-infomation">
                                <div className="text-center mb-5">
                                    <h2 className="fw-bold text-primary">
                                        Post a New Job
                                    </h2>
                                    <p className="text-muted">
                                        Fill in the details below to create your
                                        job listing
                                    </p>
                                </div>

                                {Object.values(loading).some((l) => l) && (
                                    <div className="text-center">
                                        <div
                                            className="spinner-border text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>
                                        <p>Loading data...</p>
                                    </div>
                                )}

                                <form
                                    onSubmit={handleSubmit(() =>
                                        setShowConfirm(true),
                                    )}
                                >
                                    <fieldset className="mb-4">
                                        <h3 className="p-2 rounded">
                                            <i className="lni lni-briefcase mr-2"></i>
                                            Job Information
                                        </h3>
                                        <div className="row g-3">
                                            <div className="col-12 form-group">
                                                <label
                                                    htmlFor="title"
                                                    className="form-label fw-semibold"
                                                >
                                                    Job Title*
                                                </label>
                                                <input
                                                    {...register('title')}
                                                    id="title"
                                                    className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="e.g. Senior React Developer"
                                                    aria-label="Job Title"
                                                />
                                                {errors.title && (
                                                    <div className="invalid-feedback">
                                                        {errors.title.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="category"
                                                    className="form-label fw-semibold"
                                                >
                                                    Category*
                                                </label>
                                                <select
                                                    {...register('category')}
                                                    id="category"
                                                    className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                                    aria-label="Category"
                                                >
                                                    <option value="">
                                                        Select Category
                                                    </option>
                                                    {categories.map((cat) => (
                                                        <option
                                                            key={cat._id}
                                                            value={cat._id}
                                                        >
                                                            {cat.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.category && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.category
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="jobType"
                                                    className="form-label fw-semibold"
                                                >
                                                    Job Type*
                                                </label>
                                                <select
                                                    {...register('jobType')}
                                                    id="jobType"
                                                    className={`form-select ${errors.jobType ? 'is-invalid' : ''}`}
                                                    aria-label="Job Type"
                                                >
                                                    <option value="">
                                                        Select Job Type
                                                    </option>
                                                    <option value="full-time">
                                                        Full Time
                                                    </option>
                                                    <option value="part-time">
                                                        Part Time
                                                    </option>
                                                    <option value="remote">
                                                        Remote
                                                    </option>
                                                    <option value="internship">
                                                        Internship
                                                    </option>
                                                </select>
                                                {errors.jobType && (
                                                    <div className="invalid-feedback">
                                                        {errors.jobType.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="deadline"
                                                    className="form-label fw-semibold"
                                                >
                                                    Application Deadline*
                                                </label>
                                                <input
                                                    {...register('deadline')}
                                                    id="deadline"
                                                    type="date"
                                                    className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                                                    aria-label="Deadline"
                                                />
                                                {errors.deadline && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.deadline
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-3">
                                                <label
                                                    htmlFor="salaryMin"
                                                    className="form-label fw-semibold"
                                                >
                                                    Min Salary*
                                                </label>
                                                <input
                                                    {...register('salary.min')}
                                                    id="salaryMin"
                                                    type="number"
                                                    min="0"
                                                    className={`form-control ${errors.salary?.min ? 'is-invalid' : ''}`}
                                                    placeholder="e.g. 20000"
                                                    aria-label="Minimum Salary"
                                                />
                                                {errors.salary?.min && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.salary.min
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-3">
                                                <label
                                                    htmlFor="salaryMax"
                                                    className="form-label fw-semibold"
                                                >
                                                    Max Salary*
                                                </label>
                                                <input
                                                    {...register('salary.max')}
                                                    id="salaryMax"
                                                    type="number"
                                                    min="0"
                                                    className={`form-control ${errors.salary?.max ? 'is-invalid' : ''}`}
                                                    placeholder="e.g. 30000"
                                                    aria-label="Maximum Salary"
                                                />
                                                {errors.salary?.max && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.salary.max
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="location"
                                                    className="form-label fw-semibold"
                                                >
                                                    Location*
                                                </label>
                                                <select
                                                    {...register('location')}
                                                    id="location"
                                                    className={`form-select ${errors.location ? 'is-invalid' : ''}`}
                                                    aria-label="Location"
                                                >
                                                    <option value="">
                                                        Select Location
                                                    </option>
                                                    {provinces.map(
                                                        (province) => (
                                                            <option
                                                                key={
                                                                    province.code
                                                                }
                                                                value={
                                                                    province.code
                                                                }
                                                            >
                                                                {province.name}
                                                            </option>
                                                        ),
                                                    )}
                                                </select>
                                                {errors.location && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.location
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="gender"
                                                    className="form-label fw-semibold"
                                                >
                                                    Gender*
                                                </label>
                                                <select
                                                    {...register('gender')}
                                                    id="gender"
                                                    className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                                                    aria-label="Gender"
                                                >
                                                    <option value="">
                                                        Select Gender
                                                    </option>
                                                    <option value="Male">
                                                        Male
                                                    </option>
                                                    <option value="Female">
                                                        Female
                                                    </option>
                                                    <option value="Any">
                                                        Any
                                                    </option>
                                                </select>
                                                {errors.gender && (
                                                    <div className="invalid-feedback">
                                                        {errors.gender.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="quantity"
                                                    className="form-label fw-semibold"
                                                >
                                                    Number of Vacancies*
                                                </label>
                                                <input
                                                    {...register('quantity')}
                                                    id="quantity"
                                                    type="number"
                                                    min="1"
                                                    className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                                    placeholder="e.g. 1"
                                                    aria-label="Number of Vacancies"
                                                />
                                                {errors.quantity && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.quantity
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="experience"
                                                    className="form-label fw-semibold"
                                                >
                                                    Years of Experience*
                                                </label>
                                                <input
                                                    {...register('experience')}
                                                    id="experience"
                                                    type="number"
                                                    min="0"
                                                    className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                                                    placeholder="e.g. 2"
                                                    aria-label="Years of Experience"
                                                />
                                                {errors.experience && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.experience
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    htmlFor="skills"
                                                    className="form-label fw-semibold"
                                                >
                                                    Skills*
                                                </label>
                                                <select
                                                    {...register('skills')}
                                                    id="skills"
                                                    multiple
                                                    className={`form-select ${errors.skills ? 'is-invalid' : ''}`}
                                                    aria-label="Skills"
                                                >
                                                    {skills.map((skill) => (
                                                        <option
                                                            key={skill._id}
                                                            value={skill._id}
                                                        >
                                                            {skill.name}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.skills && (
                                                    <div className="invalid-feedback">
                                                        {errors.skills.message}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    htmlFor="benefits"
                                                    className="form-label fw-semibold"
                                                >
                                                    Benefits* (Enter each
                                                    benefit on a new line)
                                                </label>
                                                <textarea
                                                    {...register('benefits')}
                                                    id="benefits"
                                                    className={`form-control ${errors.benefits ? 'is-invalid' : ''}`}
                                                    rows={3}
                                                    placeholder="e.g. Competitive salary\nHealth insurance\nRemote work"
                                                    aria-label="Benefits"
                                                />
                                                {errors.benefits && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.benefits
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    htmlFor="description"
                                                    className="form-label fw-semibold"
                                                >
                                                    Job Description*
                                                </label>
                                                <textarea
                                                    {...register('description')}
                                                    id="description"
                                                    className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                    rows={5}
                                                    placeholder="Describe job responsibilities, requirements, benefits, etc."
                                                    aria-label="Job Description"
                                                />
                                                {errors.description && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.description
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="mb-4">
                                        <h3 className="text-success p-2 rounded">
                                            <i className="lni lni-apartment mr-2"></i>
                                            Company Information
                                        </h3>
                                        <div className="row g-3">
                                            <div className="col-12">
                                                <label
                                                    htmlFor="companyName"
                                                    className="form-label fw-semibold"
                                                >
                                                    Company Name*
                                                </label>
                                                <input
                                                    {...register('companyName')}
                                                    id="companyName"
                                                    className={`form-control ${errors.companyName ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Your company name"
                                                    aria-label="Company Name"
                                                />
                                                {errors.companyName && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.companyName
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="industry"
                                                    className="form-label fw-semibold"
                                                >
                                                    Company Industry
                                                </label>
                                                <input
                                                    {...register('industry')}
                                                    id="industry"
                                                    className="form-control"
                                                    type="text"
                                                    placeholder="e.g. Information Technology"
                                                    aria-label="Industry"
                                                />
                                            </div>

                                            <div className="col-12">
                                                <label
                                                    htmlFor="companyDescription"
                                                    className="form-label fw-semibold"
                                                >
                                                    Company Description
                                                </label>
                                                <textarea
                                                    {...register(
                                                        'companyDescription',
                                                    )}
                                                    id="companyDescription"
                                                    className="form-control"
                                                    rows={5}
                                                    placeholder="Tell candidates about your company and culture"
                                                    aria-label="Company Description"
                                                />
                                            </div>
                                        </div>
                                    </fieldset>

                                    <fieldset className="mb-4">
                                        <h3 className="text-info p-2 rounded">
                                            <i className="lni lni-user mr-2"></i>
                                            Recruiter Information
                                        </h3>
                                        <div className="row g-3">
                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="recruiterName"
                                                    className="form-label fw-semibold"
                                                >
                                                    Full Name*
                                                </label>
                                                <input
                                                    {...register(
                                                        'recruiterName',
                                                    )}
                                                    id="recruiterName"
                                                    className={`form-control ${errors.recruiterName ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="Your full name"
                                                    aria-label="Recruiter Name"
                                                />
                                                {errors.recruiterName && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.recruiterName
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="recruiterEmail"
                                                    className="form-label fw-semibold"
                                                >
                                                    Email*
                                                </label>
                                                <input
                                                    {...register(
                                                        'recruiterEmail',
                                                    )}
                                                    id="recruiterEmail"
                                                    className={`form-control ${errors.recruiterEmail ? 'is-invalid' : ''}`}
                                                    type="email"
                                                    placeholder="your@email.com"
                                                    aria-label="Recruiter Email"
                                                />
                                                {errors.recruiterEmail && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors
                                                                .recruiterEmail
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-md-6">
                                                <label
                                                    htmlFor="phoneNumber"
                                                    className="form-label fw-semibold"
                                                >
                                                    Phone Number*
                                                </label>
                                                <input
                                                    {...register('phoneNumber')}
                                                    id="phoneNumber"
                                                    className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                                    type="text"
                                                    placeholder="e.g. 0912345678"
                                                    aria-label="Phone Number"
                                                />
                                                {errors.phoneNumber && (
                                                    <div className="invalid-feedback">
                                                        {
                                                            errors.phoneNumber
                                                                .message
                                                        }
                                                    </div>
                                                )}
                                            </div>

                                            <div className="col-12">
                                                <div className="form-check">
                                                    <input
                                                        {...register(
                                                            'termsAgreed',
                                                        )}
                                                        type="checkbox"
                                                        className={`form-check-input ${errors.termsAgreed ? 'is-invalid' : ''}`}
                                                        id="termsAgreed"
                                                        aria-label="Terms Agreement"
                                                    />
                                                    <label
                                                        className="form-check-label"
                                                        htmlFor="termsAgreed"
                                                    >
                                                        I agree to the{' '}
                                                        <a href="https://demo.graygrids.com/themes/jobgrids/terms-conditions.html">
                                                            Terms & Conditions
                                                        </a>{' '}
                                                        and{' '}
                                                        <a href="privacy-policy.html">
                                                            Privacy Policy
                                                        </a>
                                                    </label>
                                                    {errors.termsAgreed && (
                                                        <div className="invalid-feedback d-block">
                                                            {
                                                                errors
                                                                    .termsAgreed
                                                                    .message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </fieldset>

                                    <div className="text-center">
                                        <button
                                            type="submit"
                                            className="btn btn-primary btn-lg px-5"
                                            disabled={
                                                isSubmitting ||
                                                Object.values(loading).some(
                                                    (l) => l,
                                                )
                                            }
                                        >
                                            <i className="lni lni-upload me-2"></i>
                                            {isSubmitting
                                                ? 'Posting...'
                                                : 'Post Job'}
                                        </button>
                                    </div>
                                </form>

                                {showConfirm && (
                                    <div
                                        className="modal fade show d-block"
                                        tabIndex={-1}
                                        style={{
                                            backgroundColor: 'rgba(0,0,0,0.5)',
                                        }}
                                    >
                                        <div className="modal-dialog">
                                            <div className="modal-content">
                                                <div className="modal-header">
                                                    <h5 className="modal-title">
                                                        Confirm Posting
                                                    </h5>
                                                    <button
                                                        type="button"
                                                        className="btn-close"
                                                        onClick={() =>
                                                            setShowConfirm(
                                                                false,
                                                            )
                                                        }
                                                    ></button>
                                                </div>
                                                <div className="modal-body">
                                                    Are you sure you want to
                                                    post this job?
                                                </div>
                                                <div className="modal-footer">
                                                    <button
                                                        className="btn btn-secondary"
                                                        onClick={() =>
                                                            setShowConfirm(
                                                                false,
                                                            )
                                                        }
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        className="btn btn-primary"
                                                        onClick={() => {
                                                            setShowConfirm(
                                                                false,
                                                            )
                                                            handleSubmit(
                                                                onSubmit,
                                                            )()
                                                        }}
                                                    >
                                                        Confirm
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default PostJobPage
