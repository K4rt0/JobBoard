import * as yup from 'yup'

// Define the validation schema
export const jobFormSchema = yup.object().shape({
    title: yup.string().required('Job title is required'),
    category: yup.string().required('Category is required'),
    jobType: yup.string().required('Job type is required'),
    deadline: yup.string().optional(), // Optional
    salary: yup.string().optional(), // Optional
    description: yup.string().required('Job description is required'),
    companyName: yup.string().required('Company name is required'),
    industry: yup.string().optional(), // Optional
    companyDescription: yup.string().optional(), // Optional
    // logo validation is handled separately (can't easily validate with yup)
    recruiterName: yup.string().required('Recruiter name is required'),
    recruiterEmail: yup
        .string()
        .email('Enter a valid email')
        .required('Email is required'),
    termsAgreed: yup
        .boolean()
        .default(false)
        .oneOf([true], 'You must agree to the terms and conditions'),
})
