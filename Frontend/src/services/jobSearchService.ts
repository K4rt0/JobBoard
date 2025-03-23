import axios from 'axios'
import {
    ApiResponse,
    Job,
    JobApiResponse,
    JobFilters,
    JobsResponse,
    Skill,
} from '@/interfaces'
import { getSkillById } from './skillService'

const BASE_URL = `${process.env.REACT_APP_BASE_API_URL}`

// Get all jobs with filters
export async function getJobsPagination(
    page = 1,
    limit = 6,
    filters: JobFilters = {},
): Promise<JobsResponse> {
    try {
        // Build query parameters
        const params = new URLSearchParams()
        params.append('page', (filters.page || page).toString())
        params.append('limit', (filters.limit || limit).toString())

        // Add filter parameters if provided
        if (filters.search) params.append('search', filters.search)
        if (filters.location) params.append('location', filters.location)
        if (filters.job_type && Array.isArray(filters.job_type)) {
            filters.job_type.forEach((jobType) => {
                params.append('job_type[]', jobType)
            })
        } else if (filters.job_type) {
            // If it's a single string (not an array)
            params.append('job_type[]', filters.job_type)
        }
        if (filters.experience)
            params.append('experience', filters.experience.toString())
        if (filters.salary_min)
            params.append('salary_min', filters.salary_min.toString())
        if (filters.salary_max)
            params.append('salary_max', filters.salary_max.toString())

        const response = await axios.get<JobsResponse>(
            `${BASE_URL}/project/get-all-pagination`,
            {
                params,
            },
        )
        return response.data
    } catch (error) {
        console.error('Error fetching jobs:', error)
        throw error
    }
}
export async function getJobs(): Promise<ApiResponse<Job[]>> {
    try {
        const response = await axios.get<ApiResponse<Job[]>>(
            `${BASE_URL}/project/get-all`,
        )
        return response.data
    } catch (error) {
        console.error('Error fetching jobs:', error)
        throw error
    }
}
// Get a job by project ID
export async function getJobByProjectId(projectId: string): Promise<Job> {
    try {
        const response = await axios.get<{
            message: string
            data: JobApiResponse
        }>(`${BASE_URL}/project/${projectId}`)
        const apiProject = response.data.data as JobApiResponse
        console.log('apiProject: ' + JSON.stringify(apiProject))

        // Fetch skill details for each skill ID
        const skills = apiProject.skills
            ? await Promise.all(
                  apiProject.skills.map(async (skillId: string) => {
                      try {
                          return await getSkillById(skillId)
                      } catch (err) {
                          console.error(
                              `Failed to fetch skill ${skillId}:`,
                              err,
                          )
                          return {
                              _id: skillId,
                              name: 'Unknown Skill',
                          } as Skill
                      }
                  }),
              )
            : []

        // Map the API response to the Job interface
        return {
            ...apiProject,
            skills: skills, // Use the fetched skill objects
        }
    } catch (error) {
        console.error(`Error fetching job with project ID ${projectId}:`, error)
        throw error
    }
}

// Get a job by slug
export async function getJobBySlug(slug: string): Promise<Job> {
    try {
        const response = await axios.get<{ message: string; data: Job }>(
            `${BASE_URL}/jobs/slug/${slug}`,
        )
        return response.data.data
    } catch (error) {
        console.error(`Error fetching job with slug ${slug}:`, error)
        throw error
    }
}
