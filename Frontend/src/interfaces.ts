export interface UserRequestDTO {
    username: string
    email: string
    password: string
}

export interface User {
    id: string
    username: string
    email: string
    accessToken: string
    refreshToken: string
    avatar?: string
    name: string
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
