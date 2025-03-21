/** ========== BASE INTERFACES ========== **/
// Common response format
export interface ApiResponse<T> {
    message: string
    data: T
}

// Pagination interface
export interface PaginationInfo {
    page: number
    limit: number
    total: number
    totalPages: number
}

// Paginated response
export interface PaginatedApiResponse<T> {
    message: string
    data: {
        data: T[]
        pagination: PaginationInfo
    }
}

/** ========== USER RELATED INTERFACES ========== **/
// Basic user information shared across user types
export interface BaseUserInfo {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    role: string
    status: string
    location?: string
    website?: string
    birthDate?: string | null
    bio?: string | null
    avatar?: string | null // URL only
    createdAt: string
    updatedAt?: string | null
    socials?: SocialLink[]
}

// Avatar representation
export interface Avatar {
    url: string
    delete_hash: string
}

// Social media link
export interface SocialLink {
    name: string
    icon: string
    url: string
}

// User authentication data
export interface UserAuth {
    id: string
    full_name?: string
    email?: string
    role?: string
    avatar?: string
    access_token: string
    refresh_token: string
}

// Skill object
export interface Skill {
    _id: string
    name: string
    description: string
    slug: string
    createdAt: string
    updatedAt: string
    is_disabled?: boolean
}

// User types
export interface Freelancer extends BaseUserInfo {
    education?: string | null
    experience: number
    cvUrl?: string | null
    skills: Skill[]
    hourlyRate?: number
    currency?: string
    rating?: number
    level?: number
    reviews?: number
}

export interface Employer extends BaseUserInfo {
    companyName?: string | null
    companyDescription?: string | null
    hourlyRate?: number
    currency?: string
    rating?: number
}

// API format of user response
export interface ApiUserResponse {
    _id: string
    full_name: string
    email: string
    phone_number: string
    birth_date?: string | null
    role: string
    avatar?: Avatar | null
    bio?: string | null
    education?: string | null
    experience?: string | null // API returns string, convert to number when used
    cv_url?: string | null
    skills?: Skill[]
    company_name?: string | null
    company_description?: string | null
    location?: string
    website?: string
    status: string
    created_at: number // Timestamp
    updated_at?: number | null
    socials?: SocialLink[]
}

// Form data for profile updates
export interface ProfileFormData {
    fullName?: string | null
    email?: string | null
    phoneNumber?: string | null
    birthDate?: string | null
    role?: string | null
    bio?: string | null
    avatar?: File | string | null
    status?: string | null
    location?: string | null
    website?: string | null
    socials?: SocialLink[] | null

    // Freelancer specific fields
    education?: string | null
    experience?: number | null
    cvUrl?: string | null
    skills?: Skill[] | null
    hourlyRate?: number | null
    currency?: string | null
    rating?: number | null
    level?: number | null
    reviews?: number | null

    // Employer specific fields
    companyName?: string | null
    companyDescription?: string | null
}

// DTOs for user operations
export interface UserPasswordRequestDTO {
    old_password: string
    new_password: string
    retype_new_password: string
}

export interface UserRequestDTO {
    full_name: string
    email: string
    password: string
}

/** ========== JOB RELATED INTERFACES ========== **/
// Salary range
export interface Salary {
    min: number
    max: string
}

// Contact information
export interface Contact {
    full_name: string
    email: string
    phone_number: string
}

// Job type as returned from API
export interface Job {
    _id: string
    title: string
    salary: Salary
    quantity: number
    location: string
    description: string
    category_id: string
    expiry_date: string
    skills: Skill[]
    requirements: string[]
    benefits: string[]
    contact: Contact
    experience: number
    employer_id: string
    slug: string
    gender: string
    job_type: string[]
    status: string
    created_at: number
    updated_at: number
}
export interface JobApiResponse {
    _id: string
    title: string
    salary: {
        min: number
        max: string
    }
    quantity: number
    location: string
    description: string
    category_id: string
    expiry_date: string
    skills: string[]
    requirements: string[]
    benefits: string[]
    contact: {
        full_name: string
        email: string
        phone_number: string
    }
    experience: number
    employer_id: string
    slug: string
    gender: string
    job_type: string[]
    status: string
    applicants: string[]
    created_at: number
    updated_at: number
}

// Job form data
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

// Search and filtering
export interface SearchQuery {
    position: string
    location: string
}

export interface JobFilters {
    search?: string
    location?: string
    job_type?: string[]
    experience?: string | number
    salary_min?: string | number
    salary_max?: string | number
    page?: number
    limit?: number
}

// Type aliases for API responses
export type SkillResponse = ApiResponse<Skill>
export type UserResponse = ApiResponse<BaseUserInfo>
export type JobResponse = ApiResponse<Job>
export type JobsResponse = PaginatedApiResponse<Job>
