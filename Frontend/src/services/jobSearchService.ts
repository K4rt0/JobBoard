import axios from 'axios'
import {
    ApiResponse,
    Job,
    JobApiResponse,
    JobFilters,
    ProjectApiResponse,
    PaginationInfo,
    Skill,
} from '@/interfaces'
import { getSkillById } from './skillService'

const BASE_URL = `${process.env.REACT_APP_BASE_API_URL}`

export async function getJobsPagination(
    page = 1,
    limit = 6,
    filters: JobFilters = {},
): Promise<{ data: Job[]; pagination: PaginationInfo }> {
    try {
        const params = new URLSearchParams()
        params.append('page', (filters.page || page).toString())
        params.append('limit', (filters.limit || limit).toString())
        if (filters.search) params.append('search', filters.search)
        if (filters.location) params.append('location', filters.location)
        if (filters.job_type && Array.isArray(filters.job_type)) {
            filters.job_type.forEach((jobType) => {
                params.append('job_type[]', jobType)
            })
        } else if (filters.job_type) {
            params.append('job_type[]', filters.job_type)
        }
        if (filters.experience) {
            params.append('experience', filters.experience.toString())
        }
        if (filters.salary_min) {
            params.append('salary_min', filters.salary_min.toString())
        }
        if (filters.salary_max) {
            params.append('salary_max', filters.salary_max.toString())
        }
        if (filters.category_id) {
            params.append('category_id', filters.category_id)
        }
        const response = await axios.get<ProjectApiResponse>(
            `${BASE_URL}/project/get-all-pagination`,
            { params },
        )
        const jobsData = Array.isArray(response.data.data.projects)
            ? response.data.data.projects
            : []
        return {
            data: jobsData,
            pagination: response.data.data.pagination,
        }
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

export async function getJobByProjectId(projectId: string): Promise<Job> {
    try {
        const response = await axios.get<{
            message: string
            data: JobApiResponse
        }>(`${BASE_URL}/project/${projectId}`)
        const apiProject = response.data.data as JobApiResponse

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

        return {
            ...apiProject,
            skills,
        }
    } catch (error) {
        console.error(`Error fetching job with project ID ${projectId}:`, error)
        throw error
    }
}

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

export async function getProjectSuggestions(
    search: string,
): Promise<{ _id: string; title: string }[]> {
    try {
        const response = await axios.get<{
            message: string
            data: { _id: string; title: string }[]
        }>(`${BASE_URL}/project/suggestions`, { params: { search } })
        return response.data.data
    } catch (error) {
        console.error('Error fetching project suggestions:', error)
        throw error
    }
}
