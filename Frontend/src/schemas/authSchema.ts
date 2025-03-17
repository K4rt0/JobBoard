import * as yup from 'yup'

export const loginSchema = yup.object().shape({
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
})

// 🛠 Định nghĩa schema validation bằng Yup
export const registerSchema = yup.object().shape({
    full_name: yup
        .string()
        .min(3, 'Full name must be at least 3 characters')
        .required('Full name is required'),
    email: yup
        .string()
        .email('Invalid email format')
        .required('Email is required'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    agree_to_terms: yup.boolean().oneOf([true], 'You must accept the terms'),
})
