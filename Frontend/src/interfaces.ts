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
