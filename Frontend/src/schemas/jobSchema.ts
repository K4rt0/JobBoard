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

export const jobFormPostSchema = yup.object().shape({
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
