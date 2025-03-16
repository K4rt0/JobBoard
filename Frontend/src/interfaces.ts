export interface UserRequestDTO {
    full_name: string
    email: string
    password: string
}

export interface UserAuth {
    id: string
    full_name?: string
    avatar_url?: string
    email?: string
    role?: string
    access_token: string
    refresh_token: string
}
// Define the shape of the user data
export interface UserInfoData {
    fullName: string
    email: string
    phoneNumber: string
    role: string
    bio: string
    skills: string[]
    experience: number
    education: string | null
    cvUrl: string | null
    status: string
    createdAt: string
    location?: string // Optional, as API doesn't provide this yet
    website?: string // Optional
    socialLinks?: Record<string, string> // For social media links
}

// Type definitions
export interface Freelancer {
    id: number
    name: string
    country: string
    countryCode: string
    skills: string
    categories: string
    description: string
    hourlyRate: number
    currency: string
    rating: number
    level: number
    reviews: number
    avatar: string
}

// Define the form data type
export interface JobFormData {
    title: string
    category: string
    jobType: string
    deadline?: string
    salary?: string
    description: string
    companyName: string
    industry?: string

    companyDescription?: string
    logo?: FileList
    recruiterName: string
    recruiterEmail: string
    termsAgreed: boolean
}
export interface Job {
    id: number
    title: string
    company: string
    location: string
    salary: string
    type: string
    posted: string
}
