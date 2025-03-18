/** ========== USER INTERFACES ========== **/
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
export interface UserAuth {
    id: string
    full_name?: string
    avatar?: string
    email?: string
    role?: string
    access_token: string
    refresh_token: string
}
export interface Avatar {
    url: string
    delete_hash: string
}

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
    experience?: string | null // API trả về string, cần chuyển sang number khi sử dụng
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

export interface UserInfo {
    id: string
    fullName: string
    email: string
    phoneNumber: string
    birthDate?: string | null
    role: string
    bio?: string | null
    avatar?: string | null // Chỉ lưu URL
    status: string
    createdAt: string
    updatedAt?: string | null
    location?: string
    website?: string
    socials?: SocialLink[]
}

export interface Freelancer extends UserInfo {
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

export interface Employer extends UserInfo {
    companyName?: string | null
    companyDescription?: string | null
    hourlyRate?: number
    currency?: string
    rating?: number
}

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
    education?: string | null
    experience?: number | null
    cvUrl?: string | null
    skills?: Skill[] | null
    hourlyRate?: number | null
    currency?: string | null
    rating?: number | null
    level?: number | null
    reviews?: number | null
    companyName?: string | null
    companyDescription?: string | null
}

export interface SocialLink {
    name: string
    icon: string
    url: string
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
    _id: string
    name: string
    description: string
    slug: string
    createdAt: string
    updatedAt: string
    is_disabled?: boolean
}

/** ========== API RESPONSE FORMATS ========== **/
export interface ApiResponse<T> {
    message: string
    data: T
}

/** ========== SKILL API RESPONSE ========== **/
export type SkillResponse = ApiResponse<Skill>

/** ========== USER API RESPONSE ========== **/
export type UserResponse = ApiResponse<UserInfo>
