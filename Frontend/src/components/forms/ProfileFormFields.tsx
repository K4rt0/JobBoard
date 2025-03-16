import React, { useState, useEffect } from 'react'
import { Form } from 'react-bootstrap'
import Select from 'react-select'
import { getSkillsList } from '@/services/skillService' // API lấy danh sách kỹ năng

// Interface for form data
interface FormData {
    email?: string
    phoneNumber?: string
    location?: string
    website?: string
    bio?: string
    skills?: string[]
    experience?: number
    education?: string
}

// Props interfaces
interface FormFieldsProps {
    formData: FormData
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
}

interface SkillsFormFieldsProps {
    formData: FormData
    handleSkillsChange: (skills: string[]) => void
}

// Contact Form Fields
export const ContactFormFields: React.FC<FormFieldsProps> = ({
    formData,
    handleInputChange,
}) => (
    <>
        {[
            {
                label: 'Email',
                icon: 'lni lni-envelope',
                name: 'email',
                type: 'email',
                placeholder: 'Enter your email',
            },
            {
                label: 'Phone',
                icon: 'lni lni-phone',
                name: 'phoneNumber',
                type: 'text',
                placeholder: 'Enter your phone number',
            },
            {
                label: 'Location',
                icon: 'lni lni-map-marker',
                name: 'location',
                type: 'text',
                placeholder: 'Enter your location',
            },
            {
                label: 'Website',
                icon: 'lni lni-website',
                name: 'website',
                type: 'text',
                placeholder: 'Enter your website URL',
            },
        ].map((field) => (
            <Form.Group key={field.name} className="mb-4 position-relative">
                <Form.Label className="fw-bold">
                    <i className={`${field.icon} me-2`}></i>
                    {field.label}
                </Form.Label>
                <Form.Control
                    type={field.type}
                    name={field.name}
                    value={formData[field.name as keyof FormData] || ''}
                    onChange={handleInputChange}
                    className="py-2 border-1"
                    placeholder={field.placeholder}
                />
            </Form.Group>
        ))}
    </>
)

// Bio Form Fields
export const BioFormFields: React.FC<FormFieldsProps> = ({
    formData,
    handleInputChange,
}) => (
    <Form.Group className="mb-2 position-relative">
        <Form.Label className="fw-bold">
            <i className="lni lni-text-format me-2"></i>Bio
        </Form.Label>
        <Form.Control
            as="textarea"
            rows={4}
            name="bio"
            value={formData.bio || ''}
            onChange={handleInputChange}
            className="py-2 border-1"
            placeholder="Tell us about yourself"
        />
    </Form.Group>
)

// Skills Form Fields with AutoComplete
export const SkillsFormFields: React.FC<SkillsFormFieldsProps> = ({
    formData,
    handleSkillsChange,
}) => {
    const [skillOptions, setSkillOptions] = useState<
        { value: string; label: string }[]
    >([])

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const skills = await getSkillsList()
                setSkillOptions(
                    skills.map((skill: string) => ({
                        value: skill,
                        label: skill,
                    })),
                )
            } catch (error) {
                console.error('Error fetching skills:', error)
            }
        }

        fetchSkills()
    }, [])

    return (
        <Form.Group className="mb-2 position-relative">
            <Form.Label className="fw-bold">
                <i className="lni lni-star-filled me-2"></i>Skills
                (autocomplete)
            </Form.Label>
            <Select
                isMulti
                options={skillOptions}
                value={
                    formData.skills?.map((skill) => ({
                        value: skill,
                        label: skill,
                    })) || []
                }
                onChange={(selectedOptions) =>
                    handleSkillsChange(
                        selectedOptions.map((option) => option.value),
                    )
                }
                placeholder="Select skills..."
                classNamePrefix="react-select"
            />
            <small className="text-muted">
                Select skills from the list or type to search
            </small>
        </Form.Group>
    )
}

// Experience Form Fields
export const ExperienceFormFields: React.FC<FormFieldsProps> = ({
    formData,
    handleInputChange,
}) => (
    <Form.Group className="mb-2 position-relative">
        <Form.Label className="fw-bold">
            <i className="lni lni-calendar me-2"></i>Experience (years)
        </Form.Label>
        <Form.Control
            type="number"
            name="experience"
            value={formData.experience || 0}
            onChange={handleInputChange}
            className="py-2 border-1"
            min="0"
            placeholder="Enter your years of experience"
        />
    </Form.Group>
)

// Education Form Fields
export const EducationFormFields: React.FC<FormFieldsProps> = ({
    formData,
    handleInputChange,
}) => (
    <Form.Group className="mb-2 position-relative">
        <Form.Label className="fw-bold">
            <i className="lni lni-book me-2"></i>Education
        </Form.Label>
        <Form.Control
            type="text"
            name="education"
            value={formData.education || ''}
            onChange={handleInputChange}
            className="py-2 border-1"
            placeholder="Enter your highest education"
        />
    </Form.Group>
)
