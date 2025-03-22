import React from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { jobFormSchema } from '@/schemas/jobSchema'
import { JobFormData } from '@/interfaces'

const PostJobPage: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<JobFormData>({
        resolver: yupResolver(jobFormSchema),
        defaultValues: {
            title: '',
            category: '',
            jobType: '',
            deadline: '',
            salary: '',
            description: '',
            companyName: '',
            industry: '',
            companyDescription: '',
            recruiterName: '',
            recruiterEmail: '',
            termsAgreed: false,
        },
    })

    const onSubmit = (data: JobFormData) => {
        console.log('Form submitted:', data)
        // Add your API submission logic here
    }

    return (
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
                                    Fill in the details below to create your job
                                    listing
                                </p>
                            </div>

                            <form onSubmit={handleSubmit(onSubmit)}>
                                {/* Job Information */}
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
                                            >
                                                <option value="">
                                                    Select Category
                                                </option>
                                                <option value="UX/UI Designer">
                                                    UX/UI Designer
                                                </option>
                                                <option value="Web Developer">
                                                    Web Developer
                                                </option>
                                                <option value="Web Designer">
                                                    Web Designer
                                                </option>
                                                <option value="Software Developer">
                                                    Software Developer
                                                </option>
                                                <option value="SEO">SEO</option>
                                            </select>
                                            {errors.category && (
                                                <div className="invalid-feedback">
                                                    {errors.category.message}
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
                                                    Select Job Type
                                                </option>
                                                <option value="Full Time">
                                                    Full Time
                                                </option>
                                                <option value="Part Time">
                                                    Part Time
                                                </option>
                                                <option value="Contract">
                                                    Contract
                                                </option>
                                                <option value="Internship">
                                                    Internship
                                                </option>
                                                <option value="Remote">
                                                    Remote
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
                                                Application Deadline
                                            </label>
                                            <input
                                                {...register('deadline')}
                                                id="deadline"
                                                type="date"
                                                className="form-control"
                                            />
                                        </div>

                                        <div className="col-md-6">
                                            <label
                                                htmlFor="salary"
                                                className="form-label fw-semibold"
                                            >
                                                Salary Range
                                            </label>
                                            <select
                                                {...register('salary')}
                                                id="salary"
                                                className="form-select"
                                            >
                                                <option value="">
                                                    Select Salary Range
                                                </option>
                                                <option value="$20,000 - $30,000">
                                                    $20,000 - $30,000
                                                </option>
                                                <option value="$40,000 - $50,000">
                                                    $40,000 - $50,000
                                                </option>
                                                <option value="$60,000 - $70,000">
                                                    $60,000 - $70,000
                                                </option>
                                                <option value="$80,000 - $90,000">
                                                    $80,000 - $90,000
                                                </option>
                                                <option value="$100,000+">
                                                    $100,000+
                                                </option>
                                            </select>
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
                                            />
                                            {errors.description && (
                                                <div className="invalid-feedback">
                                                    {errors.description.message}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Company Information */}
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
                                            />
                                            {errors.companyName && (
                                                <div className="invalid-feedback">
                                                    {errors.companyName.message}
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
                                            />
                                        </div>

                                        <div className="col-12">
                                            <label
                                                htmlFor="logo"
                                                className="form-label fw-semibold"
                                            >
                                                Company Logo
                                            </label>
                                            <input
                                                type="file"
                                                className="form-control"
                                                id="logo"
                                                {...register('logo')}
                                            />
                                            <small className="form-text text-muted">
                                                Maximum file size: 2 MB.
                                                Recommended dimensions:
                                                300x300px
                                            </small>
                                        </div>
                                    </div>
                                </fieldset>

                                {/* Recruiter Information */}
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
                                                {...register('recruiterName')}
                                                id="recruiterName"
                                                className={`form-control ${errors.recruiterName ? 'is-invalid' : ''}`}
                                                type="text"
                                                placeholder="Your full name"
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
                                                {...register('recruiterEmail')}
                                                id="recruiterEmail"
                                                className={`form-control ${errors.recruiterEmail ? 'is-invalid' : ''}`}
                                                type="email"
                                                placeholder="your@email.com"
                                            />
                                            {errors.recruiterEmail && (
                                                <div className="invalid-feedback">
                                                    {
                                                        errors.recruiterEmail
                                                            .message
                                                    }
                                                </div>
                                            )}
                                        </div>

                                        <div className="col-12">
                                            <div className="form-check">
                                                <input
                                                    {...register('termsAgreed')}
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
                                                            errors.termsAgreed
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
                                    >
                                        <i className="lni lni-upload me-2"></i>
                                        Post Job
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default PostJobPage
