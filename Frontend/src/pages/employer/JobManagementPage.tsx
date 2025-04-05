import React, { useState, useCallback, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import axiosInstance, { proactiveTokenRefresh } from '@/services/axiosInstance'
import { fetchCategories } from '@/services/categoryService'
import { getSkillsList } from '@/services/skillService'
import { useAuthStore } from '@/store/authStore'
import { useNavigate } from 'react-router-dom'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import axios from 'axios'
import { Helmet } from 'react-helmet'
import sanitizeHtml from 'sanitize-html'
import Select from 'react-select'
import 'bootstrap/dist/css/bootstrap.min.css'
import JobListSidebar from '@/components/sidebars/JobListSidebar'
import { Job, Skill } from '@/interfaces'
import { updateJob, JobPayload } from '@/services/postJobService'

// Interfaces
interface Province {
    name: string
    code: number
    codename: string
    districts: Array<{
        name: string
        code: number
        codename: string
        wards: null | any[]
    }> | null
}

interface Category {
    _id: string
    name: string
}

// Validation Schema
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
                    'Max salary must exceed min salary',
                    function (value) {
                        return value >= (this.parent.min || 0)
                    },
                ),
        })
        .required(),
    description: yup.string().max(1000).required('Job description is required'),
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
    province: yup.string().required('Province is required'),
    district: yup.string().required('District is required'),
    benefits: yup.string().required('Benefits are required'),
    quantity: yup.number().min(1).required('Number of positions is required'),
    experience: yup.number().min(0).required('Experience is required'),
})

type JobFormData = yup.InferType<typeof jobFormSchema>

// Data Fetch Hook
const useJobFormData = (authToken: string | null) => {
    const [categories, setCategories] = useState<Category[]>([])
    const [skills, setSkills] = useState<Skill[]>([])
    const [provinces, setProvinces] = useState<Province[]>([])
    const [loading, setLoading] = useState({
        categories: false,
        skills: false,
        provinces: false,
    })
    const [error, setError] = useState<string | null>(null)

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

            const newCategories = categoryData.data || []
            const newSkills = skillData || []
            const newProvinces = provinceResponse.data || []

            if (!newProvinces.length)
                throw new Error('Failed to load province list.')

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
            setError('Failed to load data. Please try again.')
            toast.error('Failed to load data.')
            console.error(error)
        }
    }, [authToken])

    return { categories, skills, provinces, fetchData, loading, error }
}

const JobManagementPage = () => {
    const [authUser] = useState(useAuthStore.getState().user)
    const { categories, skills, provinces, fetchData, loading, error } =
        useJobFormData(authUser?.access_token || null)
    const navigate = useNavigate()
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [jobs, setJobs] = useState<Job[] | null>(null)
    const [showConfirm, setShowConfirm] = useState(false)

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        watch,
        control,
        setValue,
        reset,
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
            recruiterName: authUser?.full_name || '',
            recruiterEmail: authUser?.email || '',
            phoneNumber: '',
            termsAgreed: false,
            skills: [],
            gender: 'Any',
            province: '',
            district: '',
            benefits: '',
            quantity: 1,
            experience: 0,
        },
    })

    const provinceValue = watch('province')
    const selectedProvinceData =
        provinces.find((p) => p.code === parseInt(provinceValue)) || null
    const districts = selectedProvinceData?.districts || []
    const skillOptions = skills.map((skill) => ({
        value: skill._id,
        label: skill.name,
    }))

    const handleJobSelect = (jobId: string) => {
        const job = jobs?.find((j) => j._id === jobId) || null
        setSelectedJob(job)
        if (job) {
            const [districtName, provinceName] = job.location.split(', ')
            const province = provinces.find((p) => p.name === provinceName)
            const district = province?.districts?.find(
                (d) => d.name === districtName,
            )
            reset({
                title: job.title,
                category: job.category_id,
                jobType: job.job_type[0],
                deadline: new Date(job.expired_at).toISOString().split('T')[0],
                salary: { min: job.salary.min, max: job.salary.max },
                description: job.description,
                recruiterName: job.contact.full_name,
                recruiterEmail: job.contact.email,
                phoneNumber: job.contact.phone_number,
                termsAgreed: true,
                skills: job.skills.map((skill) => skill._id),
                gender: job.gender as 'Male' | 'Female' | 'Any',
                province: province?.code.toString() || '',
                district: district?.code.toString() || '',
                benefits: job.benefits.join('\n'),
                quantity: job.quantity,
                experience: job.experience,
            })
        }
    }

    const handleJobsLoaded = (loadedJobs: Job[]) => setJobs(loadedJobs)

    useEffect(() => {
        fetchData()
        const interval = setInterval(
            () => proactiveTokenRefresh(),
            5 * 60 * 1000,
        )
        return () => clearInterval(interval)
    }, [fetchData])

    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newProvince = e.target.value
        setValue('province', newProvince)
        setValue('district', '')
    }

    const onSubmit = async (data: JobFormData) => {
        if (!selectedJob) return
        try {
            await proactiveTokenRefresh()
            const sanitizedData = {
                ...data,
                description: sanitizeHtml(data.description),
                benefits: sanitizeHtml(data.benefits),
            }
            const benefitsArray = sanitizedData.benefits
                .split('\n')
                .map((b) => b.trim())
                .filter((b) => b.length > 0)
            const selectedProvinceData = provinces.find(
                (p) => p.code === parseInt(sanitizedData.province),
            )
            const selectedDistrictData = selectedProvinceData?.districts?.find(
                (d) => d.code === parseInt(sanitizedData.district),
            )

            const locationName =
                selectedDistrictData && selectedProvinceData
                    ? `${selectedDistrictData.name}, ${selectedProvinceData.name}`
                    : selectedProvinceData?.name || 'Not specified'

            const payload: Partial<JobPayload> = {
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
                skills:
                    sanitizedData.skills?.filter(
                        (skill): skill is string => skill !== undefined,
                    ) || [],
                experience: sanitizedData.experience,
                requirements: sanitizedData.description
                    .split('\n')
                    .map((r) => r.trim())
                    .filter((r) => r.length > 0),
                benefits: benefitsArray,
                contact: {
                    full_name: sanitizedData.recruiterName,
                    email: sanitizedData.recruiterEmail,
                    phone_number: sanitizedData.phoneNumber,
                },
                job_type: [sanitizedData.jobType.toLowerCase()],
                status: selectedJob.status,
                employer_id: selectedJob.employer_id,
            }

            console.log('Payload:', payload)
            toast.success('Job updated successfully!')
            const updatedSkills = skills.filter((skill) =>
                (payload.skills || []).includes(skill._id),
            )
            const updatedJob: Job = {
                ...selectedJob,
                ...payload,
                skills: updatedSkills,
                contact: {
                    full_name: sanitizedData.recruiterName || '',
                    email: sanitizedData.recruiterEmail || '',
                    phone_number: sanitizedData.phoneNumber || '',
                },
            }
            setSelectedJob(updatedJob)
            if (jobs)
                setJobs(
                    jobs.map((j) =>
                        j._id === selectedJob._id ? updatedJob : j,
                    ),
                )
        } catch (error) {
            const axiosError = error as any
            const errorMessage =
                axiosError.response?.data?.message ||
                'Failed to update job. Please check your input or try again.'
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
                <title>Job Management - JobGrids</title>
                <meta name="description" content="Manage and edit your jobs." />
            </Helmet>
            <ToastContainer position="top-right" autoClose={3000} />
            <div className="container h-100 section">
                <div className="row h-100">
                    <div
                        className="col-md-3 p-3"
                        style={{ height: '100vh', overflowY: 'auto' }}
                    >
                        <JobListSidebar
                            onJobSelect={handleJobSelect}
                            selectedJobId={selectedJob?._id}
                            onJobsLoaded={handleJobsLoaded}
                        />
                    </div>
                    <div className="col-md-9 p-3">
                        {selectedJob ? (
                            <div className="card shadow-sm border-0">
                                <div className="card-body">
                                    <h2
                                        className="card-title mb-4 fw-bold"
                                        style={{ color: '#2042e3' }}
                                    >
                                        Edit Job: {selectedJob.title}
                                    </h2>
                                    {Object.values(loading).some((l) => l) && (
                                        <div className="text-center mb-4">
                                            <div
                                                className="spinner-border text-primary"
                                                role="status"
                                            >
                                                <span className="visually-hidden">
                                                    Loading...
                                                </span>
                                            </div>
                                            <p>Loading data, please wait...</p>
                                        </div>
                                    )}
                                    {error && (
                                        <div
                                            className="alert alert-danger"
                                            role="alert"
                                        >
                                            {error}
                                        </div>
                                    )}
                                    <form
                                        onSubmit={handleSubmit(() =>
                                            setShowConfirm(true),
                                        )}
                                    >
                                        <fieldset className="mb-4">
                                            <h3 className="p-2 rounded">
                                                <i className="lni lni-briefcase me-2"></i>
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
                                                        placeholder="Enter job title"
                                                    />
                                                    {errors.title && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.title
                                                                    .message
                                                            }
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
                                                        {...register(
                                                            'category',
                                                        )}
                                                        id="category"
                                                        className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                                                    >
                                                        <option value="">
                                                            Select category
                                                        </option>
                                                        {categories.map(
                                                            (cat) => (
                                                                <option
                                                                    key={
                                                                        cat._id
                                                                    }
                                                                    value={
                                                                        cat._id
                                                                    }
                                                                >
                                                                    {cat.name}
                                                                </option>
                                                            ),
                                                        )}
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
                                                    >
                                                        <option value="">
                                                            Select job type
                                                        </option>
                                                        <option value="full-time">
                                                            Full-time
                                                        </option>
                                                        <option value="part-time">
                                                            Part-time
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
                                                            {
                                                                errors.jobType
                                                                    .message
                                                            }
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
                                                        {...register(
                                                            'deadline',
                                                        )}
                                                        id="deadline"
                                                        type="date"
                                                        className={`form-control ${errors.deadline ? 'is-invalid' : ''}`}
                                                        min={
                                                            new Date()
                                                                .toISOString()
                                                                .split('T')[0]
                                                        }
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
                                                        Minimum Salary*{' '}
                                                        <small>(VND)</small>
                                                    </label>
                                                    <input
                                                        {...register(
                                                            'salary.min',
                                                        )}
                                                        id="salaryMin"
                                                        type="number"
                                                        min="0"
                                                        className={`form-control ${errors.salary?.min ? 'is-invalid' : ''}`}
                                                        placeholder="e.g., 10000000"
                                                    />
                                                    {errors.salary?.min && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.salary
                                                                    .min.message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-3">
                                                    <label
                                                        htmlFor="salaryMax"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Maximum Salary*{' '}
                                                        <small>(VND)</small>
                                                    </label>
                                                    <input
                                                        {...register(
                                                            'salary.max',
                                                        )}
                                                        id="salaryMax"
                                                        type="number"
                                                        min="0"
                                                        className={`form-control ${errors.salary?.max ? 'is-invalid' : ''}`}
                                                        placeholder="e.g., 15000000"
                                                    />
                                                    {errors.salary?.max && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.salary
                                                                    .max.message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label
                                                        htmlFor="province"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Province*
                                                    </label>
                                                    <select
                                                        {...register(
                                                            'province',
                                                        )}
                                                        id="province"
                                                        className={`form-select ${errors.province ? 'is-invalid' : ''}`}
                                                        onChange={
                                                            handleProvinceChange
                                                        }
                                                        disabled={
                                                            loading.provinces ||
                                                            !provinces.length
                                                        }
                                                    >
                                                        <option value="">
                                                            Select Province
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
                                                                    {
                                                                        province.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    {errors.province && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.province
                                                                    .message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label
                                                        htmlFor="district"
                                                        className="form-label fw-semibold"
                                                    >
                                                        District*
                                                    </label>
                                                    <select
                                                        {...register(
                                                            'district',
                                                        )}
                                                        id="district"
                                                        className={`form-select ${errors.district ? 'is-invalid' : ''}`}
                                                        disabled={
                                                            !provinceValue ||
                                                            !districts.length
                                                        }
                                                    >
                                                        <option value="">
                                                            Select District
                                                        </option>
                                                        {districts.map(
                                                            (district) => (
                                                                <option
                                                                    key={
                                                                        district.code
                                                                    }
                                                                    value={
                                                                        district.code
                                                                    }
                                                                >
                                                                    {
                                                                        district.name
                                                                    }
                                                                </option>
                                                            ),
                                                        )}
                                                    </select>
                                                    {errors.district && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors.district
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
                                                        Gender Requirement*
                                                    </label>
                                                    <select
                                                        {...register('gender')}
                                                        id="gender"
                                                        className={`form-select ${errors.gender ? 'is-invalid' : ''}`}
                                                    >
                                                        <option value="">
                                                            Select gender
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
                                                            {
                                                                errors.gender
                                                                    .message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-md-6">
                                                    <label
                                                        htmlFor="quantity"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Number of Positions*
                                                    </label>
                                                    <input
                                                        {...register(
                                                            'quantity',
                                                        )}
                                                        id="quantity"
                                                        type="number"
                                                        min="1"
                                                        className={`form-control ${errors.quantity ? 'is-invalid' : ''}`}
                                                        placeholder="e.g., 1"
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
                                                        {...register(
                                                            'experience',
                                                        )}
                                                        id="experience"
                                                        type="number"
                                                        min="0"
                                                        className={`form-control ${errors.experience ? 'is-invalid' : ''}`}
                                                        placeholder="e.g., 2"
                                                    />
                                                    {errors.experience && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors
                                                                    .experience
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
                                                        Skills*{' '}
                                                        <small>
                                                            (Multiple selection)
                                                        </small>
                                                    </label>
                                                    <Controller
                                                        name="skills"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select
                                                                {...field}
                                                                isMulti
                                                                options={
                                                                    skillOptions
                                                                }
                                                                className={`basic-multi-select ${errors.skills ? 'is-invalid' : ''}`}
                                                                classNamePrefix="select"
                                                                placeholder="Select skills..."
                                                                onChange={(
                                                                    selectedOptions,
                                                                ) =>
                                                                    field.onChange(
                                                                        selectedOptions.map(
                                                                            (
                                                                                option,
                                                                            ) =>
                                                                                option.value,
                                                                        ),
                                                                    )
                                                                }
                                                                value={skillOptions.filter(
                                                                    (option) =>
                                                                        field.value?.includes(
                                                                            option.value,
                                                                        ),
                                                                )}
                                                                isDisabled={
                                                                    loading.skills ||
                                                                    !skills.length
                                                                }
                                                            />
                                                        )}
                                                    />
                                                    {errors.skills && (
                                                        <div className="invalid-feedback d-block">
                                                            {
                                                                errors.skills
                                                                    .message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="col-12">
                                                    <label
                                                        htmlFor="benefits"
                                                        className="form-label fw-semibold"
                                                    >
                                                        Benefits*{' '}
                                                        <small>
                                                            (One per line)
                                                        </small>
                                                    </label>
                                                    <textarea
                                                        {...register(
                                                            'benefits',
                                                        )}
                                                        id="benefits"
                                                        className={`form-control ${errors.benefits ? 'is-invalid' : ''}`}
                                                        rows={3}
                                                        placeholder="e.g., Competitive salary\nHealth insurance"
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
                                                        {...register(
                                                            'description',
                                                        )}
                                                        id="description"
                                                        className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                                                        rows={5}
                                                        placeholder="Describe responsibilities, requirements, etc."
                                                    />
                                                    {errors.description && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors
                                                                    .description
                                                                    .message
                                                            }
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </fieldset>
                                        <fieldset className="mb-4">
                                            <h3 className="p-2 rounded">
                                                <i className="lni lni-user me-2"></i>
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
                                                    />
                                                    {errors.recruiterName && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors
                                                                    .recruiterName
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
                                                        {...register(
                                                            'phoneNumber',
                                                        )}
                                                        id="phoneNumber"
                                                        className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                                        type="text"
                                                        placeholder="e.g., 0912345678"
                                                    />
                                                    {errors.phoneNumber && (
                                                        <div className="invalid-feedback">
                                                            {
                                                                errors
                                                                    .phoneNumber
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
                                                        />
                                                        <label
                                                            className="form-check-label"
                                                            htmlFor="termsAgreed"
                                                        >
                                                            I agree to the{' '}
                                                            <a href="https://demo.graygrids.com/themes/jobgrids/terms-conditions.html">
                                                                Terms &
                                                                Conditions
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
                                        <div className="mt-4">
                                            <h3 className="fw-semibold">
                                                Additional Information
                                            </h3>
                                            <p>
                                                Status:{' '}
                                                <span className="fw-medium">
                                                    {selectedJob.status}
                                                </span>
                                            </p>
                                            <p>
                                                Expiration:{' '}
                                                <span className="fw-medium">
                                                    {new Date(
                                                        selectedJob.expired_at,
                                                    ).toLocaleDateString()}
                                                </span>
                                            </p>
                                        </div>
                                        <button
                                            type="submit"
                                            className="btn btn-primary"
                                            style={{
                                                backgroundColor: '#2042e3',
                                                borderColor: '#2042e3',
                                            }}
                                            disabled={
                                                isSubmitting ||
                                                Object.values(loading).some(
                                                    (l) => l,
                                                )
                                            }
                                        >
                                            {isSubmitting
                                                ? 'Saving...'
                                                : 'Save Changes'}
                                        </button>
                                    </form>
                                    {showConfirm && (
                                        <div
                                            className="modal fade show d-block"
                                            tabIndex={-1}
                                            style={{
                                                backgroundColor:
                                                    'rgba(0,0,0,0.5)',
                                            }}
                                        >
                                            <div className="modal-dialog">
                                                <div className="modal-content">
                                                    <div className="modal-header">
                                                        <h5 className="modal-title">
                                                            Confirm Update
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
                                                        update this job?
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
                        ) : (
                            <div className="d-flex justify-content-center align-items-center h-100">
                                <h2 className="text-muted">
                                    Select a job to edit
                                </h2>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    )
}

export default JobManagementPage
