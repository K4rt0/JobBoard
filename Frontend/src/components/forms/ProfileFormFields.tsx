import React, { useState, useEffect } from 'react'
import { Badge, Button, Form } from 'react-bootstrap'
import Select, { MultiValue } from 'react-select'
import { getSkillsList } from '@/services/skillService'
import { Freelancer, ProfileFormData, Skill, SocialLink } from '@/interfaces'

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

    useEffect(() => {
        const fetchSkills = async () => {
            try {
                const response = await getSkillsList()
                if (!response || !Array.isArray(response)) return

                const formattedSkills = response.map((skill: Skill) => ({
                    _id: skill._id,
                    name: skill.name.trim(),
                    description: skill.description,
                    slug: skill.slug,
                    createdAt: skill.createdAt,
                    updatedAt: skill.updatedAt,
                    is_disabled: skill.is_disabled || false, // Đảm bảo có is_disabled
                }))
                setSkillOptions(formattedSkills)
            } catch (error) {
                console.log(error)
            }
        }
        fetchSkills()
    }, [])

    const getFilteredOptions = () => {
        const selectedIds = formData.skills
            .map((skill) => skill._id)
            .filter(Boolean)
        const availableSkills = skillOptions.filter(
            (skill) => !selectedIds.includes(skill._id) && !skill.is_disabled, // Chỉ lấy skill chưa bị disable
        )
        return inputValue
            ? availableSkills
                  .filter((skill) =>
                      skill.name
                          .toLowerCase()
                          .includes(inputValue.toLowerCase()),
                  )
                  .slice(0, maxDropdownItems)
            : availableSkills.slice(0, maxDropdownItems)
    }

    const handleInputChangeLocal = (newValue: string) => {
        setInputValue(newValue)
    }

    const handleChange = (
        selectedOptions: MultiValue<{ value: string; label: string }>,
    ) => {
        const updatedSkills: Skill[] = selectedOptions
            .map((option) => {
                const skill = skillOptions.find((s) => s._id === option.value)
                return skill
            })
            .filter((skill): skill is Skill => !!skill)

        handleSkillsChange(updatedSkills)
        setInputValue('')
    }

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
                    value: skill._id || '',
                    label: skill.name,
                }))}
                onChange={handleChange}
                onInputChange={handleInputChangeLocal}
                placeholder="Search and select skills..."
                classNamePrefix="react-select"
                maxMenuHeight={200}
                hideSelectedOptions={false}
                controlShouldRenderValue={false}
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
                        key={skill._id}
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
                🔍 Search for skills by typing above.
                <br />
                ✅ Select skills from the suggestions.
                <br />
                ❌ Click a selected skill to remove it.
                <br />
                <br />
                <span className="fw-bold">Example:</span>
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

/** ========== Social Form Fields ========== **/
export const SocialFormFields: React.FC<{
    formData: { socialLinks: SocialLink[] }
    handleSocialLinkChange: (
        index: number,
        field: keyof SocialLink,
        value: string,
    ) => void
}> = ({ formData, handleSocialLinkChange }) => {
    const defaultPlatforms: SocialLink[] = [
        { name: 'Facebook', icon: 'lni-facebook', url: '' },
        { name: 'Twitter', icon: 'lni-twitter', url: '' },
        { name: 'LinkedIn', icon: 'lni-linkedin', url: '' },
        { name: 'Dribbble', icon: 'lni-dribbble', url: '' },
        { name: 'Pinterest', icon: 'lni-pinterest', url: '' },
    ]

    const socialLinks = defaultPlatforms.map((platform, index) => {
        const existingLink = formData.socialLinks[index] || { url: '' }
        return {
            ...platform,
            url: existingLink.url || '',
        }
    })

    return (
        <div className="form-group mb-4">
            <label className="fw-bold mb-2">
                <i className="lni lni-link me-2"></i>Social Links
            </label>
            {socialLinks.map((social, index) => (
                <div
                    key={index}
                    className="d-flex align-items-center mb-3"
                    style={{ maxWidth: '500px' }}
                >
                    <div
                        className="input-group-prepend me-2"
                        style={{ flex: '0 0 40px' }}
                    >
                        <span
                            className="input-group-text d-flex align-items-center justify-content-center"
                            style={{ width: '40px', height: '38px' }}
                        >
                            <i className={`lni ${social.icon}`}></i>
                        </span>
                    </div>

                    <input
                        type="text"
                        className="form-control"
                        placeholder={`Enter ${social.name} URL`}
                        value={social.url}
                        onChange={(e) =>
                            handleSocialLinkChange(index, 'url', e.target.value)
                        }
                        style={{ flex: '1' }}
                    />
                </div>
            ))}
            <small className="text-muted">
                Enter URLs for each platform. Only filled URLs will be saved.
            </small>
        </div>
    )
}
