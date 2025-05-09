import { useState } from 'react'
import {
    Form,
    Button,
    InputGroup,
    Dropdown,
    DropdownButton,
    Card,
    Badge,
} from 'react-bootstrap'

const FilterFreelancerSidebar: React.FC = () => {
    const [searchTerm, setSearchTerm] = useState<string>('')
    const [hourlyRate, setHourlyRate] = useState<[number, number]>([10, 100])
    const [selectedFilters, setSelectedFilters] = useState<string[]>([
        'Adobe Photoshop',
        'Online Users',
    ])
    const [selectedCategories, setSelectedCategories] = useState<string[]>([])
    const [selectedSkills, setSelectedSkills] = useState<string[]>([])

    // Remove filter
    const removeFilter = (filter: string) => {
        setSelectedFilters(selectedFilters.filter((item) => item !== filter))
    }

    // Clear all filters
    const clearAllFilters = () => {
        setSelectedFilters([])
        setSelectedCategories([])
        setSelectedSkills([])
    }

    // Handle category selection
    const handleCategorySelect = (category: string) => {
        setSelectedCategories((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category],
        )
    }

    // Handle skill selection
    const handleSkillSelect = (skill: string) => {
        setSelectedSkills((prev) =>
            prev.includes(skill)
                ? prev.filter((s) => s !== skill)
                : [...prev, skill],
        )
    }

    return (
        <Card
            className="border-0 shadow-sm rounded-3 sticky-top"
            style={{ top: '1rem', maxWidth: '280px', zIndex: 1 }}
        >
            <Card.Body className="p-3">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold text-primary m-0">Find Talent</h5>
                    {selectedFilters.length > 0 && (
                        <Button
                            variant="link"
                            className="text-danger p-0 text-decoration-none fw-medium"
                            onClick={clearAllFilters}
                            size="sm"
                        >
                            Clear All
                        </Button>
                    )}
                </div>

                {/* Selected Filters */}
                {selectedFilters.length > 0 && (
                    <div className="mb-3">
                        <div className="d-flex align-items-center mb-2">
                            <i className="bi bi-funnel-fill text-primary me-1"></i>
                            <span className="text-muted small">
                                Active Filters:
                            </span>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                            {selectedFilters.map((filter, index) => (
                                <Badge
                                    key={index}
                                    bg="light"
                                    text="dark"
                                    className="d-flex align-items-center p-1 rounded-pill border"
                                >
                                    {filter}
                                    <Button
                                        className="btn-close ms-1"
                                        size="sm"
                                        onClick={() => removeFilter(filter)}
                                    ></Button>
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}

                {/* Search Bar */}
                <InputGroup className="mb-3 shadow-sm">
                    <InputGroup.Text className="bg-white border-end-0">
                        <i className="bi bi-search text-muted"></i>
                    </InputGroup.Text>
                    <Form.Control
                        type="text"
                        placeholder="Search freelancers..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="border-start-0"
                        size="sm"
                    />
                    <Button variant="primary" size="sm">
                        Search
                    </Button>
                </InputGroup>

                {/* Categories Section */}
                <Card className="border-0 mb-2">
                    <Card.Header
                        className="bg-gradient rounded-top py-2"
                        style={{
                            background:
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)',
                            transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #7F9CF5, #CBD5E0)')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)')
                        }
                    >
                        <i className="bi bi-grid-3x3-gap-fill me-2 text-dark"></i>
                        <span className="fw-semibold text-dark">
                            Categories
                        </span>
                    </Card.Header>
                    <Card.Body className="p-2 bg-light rounded-bottom">
                        <DropdownButton
                            id="category-dropdown"
                            title="Select category"
                            variant="outline-primary"
                            className="w-100 mb-2"
                            size="sm"
                        >
                            {[
                                'Graphic Design',
                                'Web Development',
                                'UI/UX Design',
                                'Photography',
                                'Video Editing',
                            ].map((category) => (
                                <Dropdown.Item
                                    key={category}
                                    onClick={() =>
                                        handleCategorySelect(category)
                                    }
                                >
                                    <Form.Check
                                        type="checkbox"
                                        label={category}
                                        checked={selectedCategories.includes(
                                            category,
                                        )}
                                        readOnly
                                    />
                                </Dropdown.Item>
                            ))}
                        </DropdownButton>
                    </Card.Body>
                </Card>

                {/* Skills Section */}
                <Card className="border-0 mb-2">
                    <Card.Header
                        className="bg-gradient rounded-top py-2"
                        style={{
                            background:
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)',
                            transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #7F9CF5, #CBD5E0)')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)')
                        }
                    >
                        <i className="bi bi-stars me-2 text-dark"></i>
                        <span className="fw-semibold text-dark">Skills</span>
                    </Card.Header>
                    <Card.Body className="p-2 bg-light rounded-bottom">
                        <InputGroup className="mb-2 shadow-sm">
                            <InputGroup.Text className="bg-white border-end-0">
                                <i className="bi bi-search text-muted"></i>
                            </InputGroup.Text>
                            <Form.Control
                                type="text"
                                placeholder="Search skills..."
                                className="border-start-0"
                                size="sm"
                            />
                        </InputGroup>
                        <div className="d-flex flex-wrap gap-1 mb-2">
                            {[
                                'Photoshop',
                                'Illustrator',
                                'InDesign',
                                'Graphic Design',
                                'Retouching',
                            ].map((skill) => (
                                <Badge
                                    key={skill}
                                    bg={
                                        selectedSkills.includes(skill)
                                            ? 'primary'
                                            : 'light'
                                    }
                                    text={
                                        selectedSkills.includes(skill)
                                            ? 'white'
                                            : 'dark'
                                    }
                                    className="p-1 rounded-pill border"
                                    onClick={() => handleSkillSelect(skill)}
                                    style={{ cursor: 'pointer' }}
                                >
                                    {skill}
                                </Badge>
                            ))}
                        </div>
                        <a
                            href="#"
                            className="text-primary text-decoration-none small"
                        >
                            <i className="bi bi-arrow-right-circle me-1"></i>
                            Browse all
                        </a>
                    </Card.Body>
                </Card>

                {/* Location Section */}
                <Card className="border-0 mb-2">
                    <Card.Header
                        className="bg-gradient rounded-top py-2"
                        style={{
                            background:
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)',
                            transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #7F9CF5, #CBD5E0)')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)')
                        }
                    >
                        <i className="bi bi-geo-alt-fill me-2 text-dark"></i>
                        <span className="fw-semibold text-dark">Location</span>
                    </Card.Header>
                    <Card.Body className="p-2 bg-light rounded-bottom">
                        <Form.Group className="mb-2">
                            <Form.Label className="fw-medium text-muted small">
                                Countries
                            </Form.Label>
                            <InputGroup className="shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="bi bi-globe text-muted"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Search countries..."
                                    className="border-start-0"
                                    size="sm"
                                />
                            </InputGroup>
                        </Form.Group>
                        <Form.Group className="mb-2">
                            <Form.Label className="fw-medium text-muted small">
                                Specific
                            </Form.Label>
                            <InputGroup className="shadow-sm">
                                <InputGroup.Text className="bg-white border-end-0">
                                    <i className="bi bi-pin-map-fill text-muted"></i>
                                </InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="City or region..."
                                    className="border-start-0"
                                    size="sm"
                                />
                                <Button variant="outline-primary" size="sm">
                                    <i className="bi bi-geo-alt"></i>
                                </Button>
                            </InputGroup>
                        </Form.Group>
                    </Card.Body>
                </Card>

                {/* Hourly Rate Section */}
                <Card className="border-0 mb-2">
                    <Card.Header
                        className="bg-gradient rounded-top py-2"
                        style={{
                            background:
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)',
                            transition: 'background 0.3s ease',
                        }}
                        onMouseEnter={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #7F9CF5, #CBD5E0)')
                        }
                        onMouseLeave={(e) =>
                            (e.currentTarget.style.background =
                                'linear-gradient(90deg, #A3BFFA, #E2E8F0)')
                        }
                    >
                        <i className="bi bi-currency-dollar me-2 text-dark"></i>
                        <span className="fw-semibold text-dark">
                            Hourly Rate
                        </span>
                    </Card.Header>
                    <Card.Body className="p-2 bg-light rounded-bottom">
                        <div className="mb-2">
                            <div className="d-flex justify-content-between mb-1">
                                <span className="badge bg-primary p-1">
                                    ${hourlyRate[0]}
                                </span>
                                <span className="badge bg-primary p-1">
                                    ${hourlyRate[1]}
                                </span>
                            </div>
                            <Form.Range
                                min={5}
                                max={200}
                                value={hourlyRate[1]}
                                onChange={(e) =>
                                    setHourlyRate([
                                        hourlyRate[0],
                                        parseInt(e.target.value),
                                    ])
                                }
                                className="mb-1"
                            />
                            <div className="d-flex justify-content-between text-muted xsmall">
                                <span>$5</span>
                                <span>$50</span>
                                <span>$100</span>
                                <span>$150</span>
                                <span>$200+</span>
                            </div>
                        </div>
                    </Card.Body>
                </Card>
            </Card.Body>
        </Card>
    )
}

export default FilterFreelancerSidebar
