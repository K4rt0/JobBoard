import React, { useState, useEffect } from 'react'
import { Badge, Form } from 'react-bootstrap'
import Select, { MultiValue } from 'react-select'
import { getSkillsList } from '@/services/skillService'
import { Freelancer, ProfileFormData, Skill } from '@/interfaces'

// Interface props chung cho các field
export interface FormFieldsProps {
    formData: Freelancer
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
}

// Interface cho Skill field
export interface SkillsFormFieldsProps {
    formData: { skills: Skill[] }
    handleSkillsChange: (skills: Skill[]) => void
}
/** ========== Contact Form Fields ========== **/
export const ContactFormFields: React.FC<{
    formData: ProfileFormData
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
}> = ({ formData, handleInputChange }) => (
    <>
        {[
            {
                label: 'Full Name',
                icon: 'lni lni-user',
                name: 'fullName',
                type: 'text',
                placeholder: 'Enter your full name',
            },
            {
                label: 'Phone',
                icon: 'lni lni-phone',
                name: 'phoneNumber',
                type: 'text',
                placeholder: 'Enter your phone number',
            },
            {
                label: 'Birth Date',
                icon: 'lni lni-calendar',
                name: 'birthDate',
                type: 'date',
                placeholder: 'Enter your birth date (DD/MM/YYYY)',
            },
            {
                label: 'Website',
                icon: 'lni lni-website',
                name: 'website',
                type: 'text',
                placeholder: 'Enter your website URL',
            },
            // {
            //     label: 'Location',
            //     icon: 'lni lni-lcoation',
            //     name: 'location',
            //     type: 'text',
            //     placeholder: 'Enter your location',
            // },
        ].map((field) => (
            <Form.Group key={field.name} className="mb-4 position-relative">
                <Form.Label className="fw-bold">
                    <i className={`${field.icon} me-2`}></i>
                    {field.label}
                </Form.Label>
                <Form.Control
                    type={field.type}
                    name={field.name}
                    value={
                        (formData[field.name as keyof ProfileFormData] as
                            | string
                            | number
                            | undefined) || ''
                    }
                    onChange={handleInputChange}
                    className="py-2 border-1"
                    placeholder={field.placeholder}
                />
            </Form.Group>
        ))}
    </>
)

/** ========== Bio Form Fields ========== **/
export const BioFormFields: React.FC<{
    formData: ProfileFormData
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
}> = ({ formData, handleInputChange }) => (
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

/** ========== Experience Form Fields ========== **/
export const ExperienceFormFields: React.FC<{
    formData: ProfileFormData
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
}> = ({ formData, handleInputChange }) => (
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

/** ========== Education Form Fields ========== **/
export const EducationFormFields: React.FC<{
    formData: ProfileFormData
    handleInputChange: (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => void
}> = ({ formData, handleInputChange }) => (
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

/** ========== Skills Form Fields ========== **/
export const SkillsFormFields: React.FC<SkillsFormFieldsProps> = ({
    formData,
    handleSkillsChange,
}) => {
    const [skillOptions, setSkillOptions] = useState<Skill[]>([])
    const [inputValue, setInputValue] = useState<string>('')
    const maxDropdownItems = 7

    // Fetch skills on component mount
    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await getSkillsList()
                console.log('API Response:', response)

                if (!response || !Array.isArray(response)) {
                    console.error('Invalid API response:', response)
                    return
                }

                const formattedSkills = response.map((skill: Skill) => ({
                    _id: skill._id, // Ensure ID exists
                    name: skill.name.trim(),
                    description: skill.description,
                    slug: skill.slug,
                    createdAt: skill.createdAt,
                    updatedAt: skill.updatedAt,
                }))

                console.log('Formatted skills:', formattedSkills)
                setSkillOptions(formattedSkills)
            } catch (error) {
                console.error('Error fetching skills:', error)
            }
        }

        fetchSkills()
    }, [])

    // Get filtered options for the dropdown
    const getFilteredOptions = () => {
        // First, get all skills that haven't been selected yet
        const selectedIds = formData.skills
            .map((skill) => skill._id)
            .filter(Boolean)
        const availableSkills = skillOptions.filter(
            (skill) => !selectedIds.includes(skill._id),
        )

        // Then filter by search text if there is any
        if (inputValue) {
            return availableSkills
                .filter((skill) =>
                    skill.name.toLowerCase().includes(inputValue.toLowerCase()),
                )
                .slice(0, maxDropdownItems)
        }

        return availableSkills.slice(0, maxDropdownItems)
    }

    // Handle input change
    const handleInputChange = (newValue: string) => {
        setInputValue(newValue)
    }

    // Handle selection change
    const handleChange = (
        selectedOptions: MultiValue<{ value: string; label: string }>,
    ) => {
        console.log('Raw selected options:', selectedOptions)

        // Create an array to hold the complete set of skills
        let updatedSkills: Skill[] = []

        // First, include all currently selected skills
        if (formData.skills && formData.skills.length > 0) {
            updatedSkills = [...formData.skills]
        }

        // Then handle the new selections - only add skills that aren't already included
        selectedOptions.forEach((option) => {
            // Check if this skill is already in our updated list
            const alreadySelected = updatedSkills.some(
                (skill) => skill._id === option.value,
            )

            if (!alreadySelected) {
                // Find the complete skill object
                const skillToAdd = skillOptions.find(
                    (skill) => skill._id === option.value,
                )

                if (skillToAdd) {
                    console.log('Adding skill:', skillToAdd)
                    updatedSkills.push(skillToAdd)
                }
            }
        })

        console.log('Final skills list:', updatedSkills)
        handleSkillsChange(updatedSkills)

        // Reset input value
        setInputValue('')
    }

    // Handle removing a skill
    const handleRemoveSkill = (skillId: string) => {
        const updatedSkills = formData.skills.filter(
            (skill) => skill._id !== skillId,
        )
        handleSkillsChange(updatedSkills)
    }

    return (
        <Form.Group className="mb-2 position-relative">
            <Form.Label className="fw-bold">
                <i className="lni lni-star-filled me-2"></i>Skills
            </Form.Label>

            <Select
                isMulti
                options={getFilteredOptions().map((skill) => ({
                    value: skill._id,
                    label: skill.name,
                }))}
                value={formData.skills.map((skill) => ({
                    value: skill._id || '', // Ensure ID is not undefined
                    label: skill.name,
                }))}
                onChange={handleChange}
                onInputChange={handleInputChange}
                placeholder="Search and select skills..."
                classNamePrefix="react-select"
                maxMenuHeight={200}
                hideSelectedOptions={false} // Không hiển thị tag trên input
                controlShouldRenderValue={false} // Không hiển thị tag trên input
                menuPortalTarget={document.body}
                styles={{
                    menuPortal: (base) => ({ ...base, zIndex: 9999 }),
                    menu: (base) => ({ ...base, zIndex: 9999 }),
                    control: (base) => ({ ...base, zIndex: 1 }),
                }}
            />

            <div className="mt-3">
                {formData.skills?.map((skill) => (
                    <Badge
                        key={skill._id} // Ensure key is not undefined
                        pill
                        bg="primary"
                        className="me-2 mb-2"
                        style={{ cursor: 'pointer' }}
                        onClick={() => handleRemoveSkill(skill._id)}
                    >
                        {skill.name} ✕
                    </Badge>
                ))}
            </div>

            <div className="mt-2 small text-muted">
                🔍 Tìm kiếm kỹ năng bằng cách nhập vào ô phía trên.
                <br />
                ✅ Chọn kỹ năng từ danh sách gợi ý.
                <br />
                ❌ Nhấn vào kỹ năng đã chọn để loại bỏ.
                <br />
                <br />
                <span className="fw-bold">Ví dụ:</span>
                <div className="mt-2">
                    <Badge bg="secondary" className="me-2">
                        JavaScript
                    </Badge>
                    <Badge bg="secondary" className="me-2">
                        React
                    </Badge>
                    <Badge bg="secondary" className="me-2">
                        Node.js
                    </Badge>
                </div>
            </div>
        </Form.Group>
    )
}
