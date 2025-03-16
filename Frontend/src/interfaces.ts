/** ========== USER INTERFACES ========== **/
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

export interface UserInfoData {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    birthDate?: string | null
    role: string
    bio?: string | null
    education?: string | null
    experience: number
    cvUrl?: string | null
    skills: Skill[]
    companyName?: string | null
    companyDescription?: string | null
    status: string
    createdAt: string
    updatedAt?: string | null
    location?: string
    website?: string
    socialLinks?: Record<string, string> // Danh sách mạng xã hội
}

/** ========== FREELANCER INTERFACES ========== **/
export interface Freelancer extends UserInfoData {
    id: string
    hourlyRate?: number
    currency?: string
    rating?: number
    level?: number
    reviews?: number
    avatar?: string
}

/** ========== FREELANCER FORM DATA ========== **/
export interface FreelancerFormData {
    email?: string
    phoneNumber?: string
    location?: string
    website?: string
    bio?: string
    skills: Skill[] // Lưu danh sách skill dưới dạng object
    experience?: number
    education?: string | null
}

/** ========== JOB INTERFACES ========== **/
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
    id: string
    title: string
    company: string
    location: string
    salary: string
    type: string
    posted: string
    description?: string
    companyWebsite?: string
    companyLogo?: string
}

/** ========== SKILL INTERFACES ========== **/
export interface Skill {
    id: string
    name: string
    description: string
    slug: string
    createdAt: string
    updatedAt: string
}

/** ========== API RESPONSE FORMATS ========== **/
export interface ApiResponse<T> {
    message: string
    data: T
}

/** ========== SKILL API RESPONSE ========== **/
export type SkillResponse = ApiResponse<Skill>

/** ========== USER API RESPONSE ========== **/
export type UserResponse = ApiResponse<UserInfoData>
