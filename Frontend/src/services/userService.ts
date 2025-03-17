import { handleApiError } from '@/utils/apiHandlerError'
import axiosInstance from './axiosInstance'
import {
    ApiUserResponse,
    Employer,
    Freelancer,
    ProfileFormData,
    UserInfo,
    UserPasswordRequestDTO,
} from '@/interfaces'

/**
 * Lấy danh sách tất cả người dùng (Chỉ Admin)
 */
export const getAllUsers = async (): Promise<any[]> => {
    const response = await axiosInstance.get('/users')
    return response.data
}

export const getCurrentUser = async (): Promise<
    UserInfo | Freelancer | Employer
> => {
    const response = await axiosInstance.get('/user/profile', {})
    const apiData = response.data.data as ApiUserResponse

    // Mock social links for demonstration
    const mockSocialLinks = {
        facebook: 'https://facebook.com',
        twitter: 'https://twitter.com',
        linkedin: 'https://linkedin.com',
        dribbble: 'https://dribbble.com',
        pinterest: 'https://pinterest.com',
    }

    // Ánh xạ dữ liệu từ API sang interface
    const baseUserData: UserInfo = {
        id: apiData._id,
        fullName: apiData.full_name,
        email: apiData.email,
        phoneNumber: apiData.phone_number,
        birthDate: apiData.birth_date || null,
        role: apiData.role,
        bio: apiData.bio || null,
        avatar: apiData.avatar?.url || null,
        status: apiData.status,
        createdAt: new Date(apiData.created_at).toLocaleDateString(),
        updatedAt: apiData.updated_at
            ? new Date(apiData.updated_at).toLocaleDateString()
            : null,
        location: apiData.location || '',
        website: apiData.website || '',
        socialLinks: mockSocialLinks,
    }

    if (apiData.role === 'Freelancer') {
        return {
            ...baseUserData,
            education: apiData.education || null,
            experience: apiData.experience ? parseInt(apiData.experience) : 0,
            cvUrl: apiData.cv_url || null,
            skills: apiData.skills || [],
            hourlyRate: 0, // Giả định nếu API không trả
            currency: 'USD', // Giả định nếu API không trả
            rating: 0, // Giả định nếu API không trả
            level: 0, // Giả định nếu API không trả
            reviews: 0, // Giả định nếu API không trả
        } as Freelancer
    } else if (apiData.role === 'Employer') {
        return {
            ...baseUserData,
            companyName: apiData.company_name || null,
            companyDescription: apiData.company_description || null,
            hourlyRate: 0, // Giả định nếu API không trả
            currency: 'USD', // Giả định nếu API không trả
            rating: 0, // Giả định nếu API không trả
        } as Employer
    }

    return baseUserData
}

export const updateUserProfile = async <
    T extends Partial<UserInfo | Freelancer | Employer>,
>(
    userData: ProfileFormData,
): Promise<T> => {
    try {
        const token = localStorage.getItem('access_token')
        const formData = new FormData()

        if (userData.fullName) formData.append('full_name', userData.fullName)
        if (userData.email) formData.append('email', userData.email)
        if (userData.phoneNumber)
            formData.append('phone_number', userData.phoneNumber)
        if (userData.birthDate)
            formData.append('birth_date', userData.birthDate)
        if (userData.bio) formData.append('bio', userData.bio)
        if (userData.avatar instanceof File)
            formData.append('avatar', userData.avatar)
        if (userData.location) formData.append('location', userData.location)
        if (userData.website) formData.append('website', userData.website)
        if (userData.education) formData.append('education', userData.education)
        if (userData.experience !== undefined && userData.experience !== null)
            formData.append('experience', String(userData.experience))
        if (userData.cvUrl) formData.append('cv_url', userData.cvUrl)
        if (userData.skills) {
            userData.skills.forEach((skill, index) => {
                formData.append(`skills[${index}][id]`, skill._id || '')
                formData.append(`skills[${index}][name]`, skill.name || '')
            })
        }
        if (userData.hourlyRate !== undefined && userData.hourlyRate !== null)
            formData.append('hourly_rate', String(userData.hourlyRate))
        if (userData.currency) formData.append('currency', userData.currency)
        if (userData.rating !== undefined && userData.rating !== null)
            formData.append('rating', String(userData.rating))
        if (userData.level !== undefined && userData.level !== null)
            formData.append('level', String(userData.level))
        if (userData.reviews !== undefined && userData.reviews !== null)
            formData.append('reviews', String(userData.reviews))
        if (userData.companyName)
            formData.append('company_name', userData.companyName)
        if (userData.companyDescription)
            formData.append('company_description', userData.companyDescription)

        const response = await axiosInstance.patch(
            '/user/change-info',
            formData,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'multipart/form-data',
                },
            },
        )

        const apiData = response.data.data as ApiUserResponse

        // Ánh xạ dữ liệu từ API sang interface
        const mappedData: Partial<UserInfo | Freelancer | Employer> = {
            id: apiData._id,
            fullName: apiData.full_name,
            email: apiData.email,
            phoneNumber: apiData.phone_number,
            birthDate: apiData.birth_date || null,
            role: apiData.role,
            bio: apiData.bio || null,
            avatar: apiData.avatar?.url || null,
            status: apiData.status,
            createdAt: new Date(apiData.created_at).toLocaleDateString(),
            updatedAt: apiData.updated_at
                ? new Date(apiData.updated_at).toLocaleDateString()
                : null,
            location: apiData.location || '',
            website: apiData.website || '',
        }

        if (apiData.role === 'Freelancer') {
            return {
                ...mappedData,
                education: apiData.education || null,
                experience: apiData.experience
                    ? parseInt(apiData.experience)
                    : 0,
                cvUrl: apiData.cv_url || null,
                skills: apiData.skills || [],
                hourlyRate: 0, // Giả định nếu API không trả
                currency: 'USD', // Giả định nếu API không trả
                rating: 0, // Giả định nếu API không trả
                level: 0, // Giả định nếu API không trả
                reviews: 0, // Giả định nếu API không trả
            } as T
        } else if (apiData.role === 'Employer') {
            return {
                ...mappedData,
                companyName: apiData.company_name || null,
                companyDescription: apiData.company_description || null,
                hourlyRate: 0, // Giả định nếu API không trả
                currency: 'USD', // Giả định nếu API không trả
                rating: 0, // Giả định nếu API không trả
            } as T
        }

        return mappedData as T
    } catch (error) {
        handleApiError(error, 'Update user information failed')
        throw error
    }
}

/**
 * Lấy thông tin người dùng theo ID
 */
export const getUserById = async (userId: string): Promise<any> => {
    const response = await axiosInstance.get(`/users/${userId}`)
    return response.data
}

// ✅ API đăng ký
export const changePassword = async (data: UserPasswordRequestDTO) => {
    try {
        console.log(data)

        const response = await axiosInstance.patch(
            `/user/change-password`,
            data,
        )
        return response.data
    } catch (error) {
        handleApiError(error, 'Registration failed')
    }
}
