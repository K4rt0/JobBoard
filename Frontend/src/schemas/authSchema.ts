import * as yup from 'yup'

export const loginSchema = yup.object().shape({
    username: yup
        .string()
        .required('Username is required')
        .min(3, 'Must be at least 3 characters'),
    password: yup
        .string()
        .min(6, 'Password must be at least 6 characters')
        .required('Password is required'),
    rememberMe: yup.boolean(),
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
export const changePasswordschema = yup.object().shape({
    currentPassword: yup.string().required('Vui lòng nhập mật khẩu hiện tại'),
    newPassword: yup
        .string()
        .min(8, 'Mật khẩu mới phải có ít nhất 8 ký tự')
        .required('Vui lòng nhập mật khẩu mới'),
    confirmPassword: yup
        .string()
        .oneOf(
            [yup.ref('newPassword'), undefined],
            'Mật khẩu xác nhận không khớp',
        )
        .required('Vui lòng xác nhận mật khẩu'),
})
