import * as yup from 'yup'

// Schema xác thực dữ liệu bằng Yup
export const changePasswordSchema = yup.object().shape({
    oldPassword: yup.string().required('Old password is required'),
    newPassword: yup
        .string()
        .min(6, 'New password must be at least 6 characters')
        .required('New password is required'),
    retypeNewPassword: yup
        .string()
        .oneOf([yup.ref('newPassword')], 'Passwords must match')
        .required('Please confirm your new password'),
})
