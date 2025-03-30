import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import styled from 'styled-components'
import { getProjectSuggestions } from '@/services/jobSearchService'
import { JobSuggestion } from '@/interfaces'

interface JobSearchBarProps {
    searchQuery: { position: string; location: string }
    onSearch: (query: { position: string; location: string }) => void
}

// Styled components
const SuggestionItem = styled.div`
    padding: 0.5rem 1rem;
    border-radius: 0.25rem;
    cursor: pointer;
    &:hover {
        background-color: #f8f9fa;
    }
`

const ProvinceLabel = styled.label`
    cursor: pointer;
    margin-left: 0.5rem;
    &:hover {
        color: #007bff;
    }
`

const DistrictLabel = styled.label`
    cursor: pointer;
    margin-left: 0.5rem;
    &:hover {
        color: #007bff;
    }
`

const DropdownContainer = styled.div`
    position: absolute;
    width: 100%;
    margin-top: 0.5rem;
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 0.25rem;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    padding: 0.75rem;
    z-index: 9999;
    max-height: 300px;
    overflow-y: auto;
    top: 100%;
    left: 0;
`

const SearchBarWrapper = styled.div`
    overflow: visible;
    position: relative;
    z-index: 1;
`

const ClearButton = styled.button`
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    border: none;
    background: none;
    color: #666;
    font-size: 16px;
    cursor: pointer;
    padding: 0;
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
        color: #000;
    }
`

const InputWrapper = styled.div`
    position: relative;
    width: 100%;
`

const JobSearchBar: React.FC<JobSearchBarProps> = ({
    searchQuery,
    onSearch,
}) => {
    const [formValues, setFormValues] = useState({
        position: searchQuery.position,
        location: searchQuery.location,
    })
    const [suggestions, setSuggestions] = useState<JobSuggestion[]>([])
    const [activeField, setActiveField] = useState<
        'position' | 'location' | null
    >(null)
    const [provinces, setProvinces] = useState<any[]>([])
    const [selectedProvince, setSelectedProvince] = useState<string | null>(
        null,
    )
    const [searchProvince, setSearchProvince] = useState('')
    const [districtsByProvince, setDistrictsByProvince] = useState<
        Record<string, any[]>
    >({})
    const [selectedDistrict, setSelectedDistrict] = useState<string | null>(
        null,
    )

    const suggestionRef = useRef<HTMLDivElement>(null)
    const inputRef = useRef<HTMLInputElement>(null)
    const searchBarRef = useRef<HTMLDivElement>(null)
    const locationRef = useRef<HTMLDivElement>(null)
    const navigate = useNavigate()

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormValues({ ...formValues, [name]: value })
        if (name === 'position') fetchSuggestions(value)
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(formValues)
        setActiveField(null)
    }

    const fetchSuggestions = async (keyword: string) => {
        if (!keyword.trim()) return setSuggestions([])
        try {
            const data = await getProjectSuggestions(keyword)
            setSuggestions(data)
        } catch (error) {
            console.error('Error fetching suggestions:', error)
        }
    }

    const handleSuggestionClick = (title: string) => {
        setFormValues((prev) => ({ ...prev, position: title }))
        setActiveField(null)
    }

    const toggleProvince = async (province: string, code: number) => {
        if (selectedProvince === province) {
            setSelectedProvince(null)
            setSelectedDistrict(null)
            setFormValues((prev) => ({ ...prev, location: '' }))
        } else {
            setSelectedProvince(province)
            setSelectedDistrict(null)
            setFormValues((prev) => ({ ...prev, location: province }))
            try {
                const res = await axios.get(
                    `https://provinces.open-api.vn/api/p/${code}?depth=2`,
                )
                setDistrictsByProvince((prev) => ({
                    ...prev,
                    [province]: res.data.districts || [],
                }))
            } catch (err) {
                console.error(`Error loading districts for ${province}`, err)
            }
        }
    }

    const toggleDistrict = (districtName: string) => {
        setSelectedDistrict(districtName)
        setFormValues((prev) => ({ ...prev, location: districtName }))
        setActiveField(null)
    }

    const clearPosition = () => {
        setFormValues((prev) => ({ ...prev, position: '' }))
        setSuggestions([])
    }

    const clearLocation = () => {
        setFormValues((prev) => ({ ...prev, location: '' }))
        setSelectedProvince(null)
        setSelectedDistrict(null)
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as Node
            if (
                activeField === 'position' &&
                suggestionRef.current &&
                !suggestionRef.current.contains(target) &&
                inputRef.current &&
                !inputRef.current.contains(target)
            ) {
                setActiveField(null)
            }
            if (
                activeField === 'location' &&
                locationRef.current &&
                !locationRef.current.contains(target) &&
                searchBarRef.current &&
                !searchBarRef.current.contains(target)
            ) {
                setActiveField(null)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () =>
            document.removeEventListener('mousedown', handleClickOutside)
    }, [activeField])

    useEffect(() => {
        const loadProvinces = async () => {
            try {
                const response = await axios.get(
                    'https://provinces.open-api.vn/api/?depth=1',
                )
                setProvinces(response.data)
            } catch (err) {
                console.error('Failed to fetch provinces:', err)
            }
        }
        loadProvinces()
    }, [])

    const filteredProvinces = provinces.filter((p) =>
        p.name.toLowerCase().includes(searchProvince.toLowerCase()),
    )

    return (
        <SearchBarWrapper
            className="job-search-wrap-two mt-50 wow fadeInUp card mb-5 shadow-lg border-0 rounded-3 mt-3"
            data-wow-delay=".7s"
            ref={searchBarRef}
        >
            <div className="job-search-form">
                <form onSubmit={handleSubmit}>
                    <div className="single-field-item keyword">
                        <label htmlFor="keyword">What</label>
                        <InputWrapper>
                            <input
                                id="keyword"
                                name="position"
                                type="text"
                                placeholder="What jobs you want?"
                                value={formValues.position}
                                onChange={handleSearchChange}
                                ref={inputRef}
                                onFocus={() => setActiveField('position')}
                                autoComplete="off"
                                className="form-control"
                            />
                            {formValues.position && (
                                <ClearButton
                                    type="button"
                                    onClick={clearPosition}
                                    aria-label="Clear position"
                                >
                                    ×
                                </ClearButton>
                            )}
                        </InputWrapper>
                    </div>

                    <div
                        className="single-field-item location"
                        ref={locationRef}
                        style={{ position: 'relative' }}
                    >
                        <label htmlFor="location">Where</label>
                        <InputWrapper>
                            <input
                                id="location"
                                name="location"
                                type="text"
                                className="form-control input-field-location"
                                placeholder="Select a location"
                                value={formValues.location}
                                readOnly
                                onClick={() => setActiveField('location')}
                            />
                            {formValues.location && (
                                <ClearButton
                                    type="button"
                                    onClick={clearLocation}
                                    aria-label="Clear location"
                                >
                                    ×
                                </ClearButton>
                            )}
                        </InputWrapper>
                    </div>

                    <div className="submit-btn">
                        <button className="btn btn-primary" type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {activeField === 'position' && suggestions.length > 0 && (
                <DropdownContainer ref={suggestionRef}>
                    {suggestions.slice(0, 5).map((item) => (
                        <SuggestionItem
                            key={item._id}
                            onClick={() => handleSuggestionClick(item.title)}
                        >
                            <div className="fw-semibold">{item.title}</div>
                        </SuggestionItem>
                    ))}
                </DropdownContainer>
            )}

            {activeField === 'location' && (
                <DropdownContainer>
                    <input
                        type="text"
                        placeholder="Tìm Tỉnh/Thành phố"
                        className="form-control mb-3"
                        value={searchProvince}
                        onChange={(e) => setSearchProvince(e.target.value)}
                    />
                    <div className="d-grid gap-2">
                        {filteredProvinces.map((province) => (
                            <div key={province.code}>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={
                                            selectedProvince === province.name
                                        }
                                        onChange={() =>
                                            toggleProvince(
                                                province.name,
                                                province.code,
                                            )
                                        }
                                        id={`province-${province.code}`}
                                    />
                                    <ProvinceLabel
                                        htmlFor={`province-${province.code}`}
                                    >
                                        {province.name}
                                    </ProvinceLabel>
                                </div>
                                {selectedProvince === province.name &&
                                    districtsByProvince[province.name] && (
                                        <div className="ms-4 mb-2">
                                            {districtsByProvince[
                                                province.name
                                            ].map((district) => (
                                                <div
                                                    key={district.code}
                                                    className="form-check"
                                                >
                                                    <input
                                                        className="form-check-input"
                                                        type="checkbox"
                                                        checked={
                                                            selectedDistrict ===
                                                            district.name
                                                        }
                                                        onChange={() =>
                                                            toggleDistrict(
                                                                district.name,
                                                            )
                                                        }
                                                        id={`district-${province.code}-${district.code}`}
                                                    />
                                                    <DistrictLabel
                                                        htmlFor={`district-${province.code}-${district.code}`}
                                                    >
                                                        {district.name}
                                                    </DistrictLabel>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </DropdownContainer>
            )}
        </SearchBarWrapper>
    )
}

export default JobSearchBar
