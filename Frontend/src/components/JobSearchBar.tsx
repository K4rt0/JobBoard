// ✅ Đã gộp code của bạn và bổ sung đầy đủ hỗ trợ quận/huyện + multi-select tỉnh
import React, { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { getProjectSuggestions } from '@/services/jobSearchService'
import { JobSuggestion } from '@/interfaces'

interface JobSearchBarProps {
    searchQuery: { position: string; location: string }
    onSearch: (query: { position: string; location: string }) => void
}

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
    const [selectedLocations, setSelectedLocations] = useState<string[]>([])
    const [searchProvince, setSearchProvince] = useState('')
    const [districtsByProvince, setDistrictsByProvince] = useState<
        Record<string, any[]>
    >({})
    const [selectedDistricts, setSelectedDistricts] = useState<
        Record<string, string[]>
    >({})

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

    const handleSuggestionClick = (projectId: string) => {
        setActiveField(null)
        navigate(`/jobs/${projectId}`)
    }

    const toggleLocation = async (province: string, code: number) => {
        const updated = selectedLocations.includes(province)
            ? selectedLocations.filter((p) => p !== province)
            : [...selectedLocations, province]

        setSelectedLocations(updated)

        if (!districtsByProvince[province]) {
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

        if (!updated.includes(province)) {
            const newSelected = { ...selectedDistricts }
            delete newSelected[province]
            setSelectedDistricts(newSelected)
        }

        updateLocationString(updated, selectedDistricts)
    }

    const toggleDistrict = (province: string, districtName: string) => {
        const updated = selectedDistricts[province] || []
        const isSelected = updated.includes(districtName)
        const newDistricts = isSelected
            ? updated.filter((d) => d !== districtName)
            : [...updated, districtName]

        const newSelectedDistricts = {
            ...selectedDistricts,
            [province]: newDistricts,
        }
        setSelectedDistricts(newSelectedDistricts)
        updateLocationString(selectedLocations, newSelectedDistricts)
    }

    const updateLocationString = (
        provinces: string[],
        districtsMap: Record<string, string[]>,
    ) => {
        const formatted = provinces
            .map((province) => {
                const districts = districtsMap[province] || []
                return districts.length
                    ? `${province}:${districts.join(',')}`
                    : province
            })
            .join('|')
        setFormValues((prev) => ({ ...prev, location: formatted }))
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
        <div
            className="job-search-wrap-two mt-50 wow fadeInUp card mb-5 shadow-lg border-0 rounded-3 mt-3"
            data-wow-delay=".7s"
            ref={searchBarRef}
            style={{ position: 'relative' }}
        >
            <div className="job-search-form">
                <form onSubmit={handleSubmit}>
                    <div className="single-field-item keyword">
                        <label htmlFor="keyword">What</label>
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
                    </div>

                    <div
                        className="single-field-item location"
                        ref={locationRef}
                        style={{ position: 'relative' }}
                    >
                        <label htmlFor="location">Where</label>
                        <input
                            id="location"
                            name="location"
                            type="text"
                            className="form-control input-field-location"
                            placeholder="Select locations"
                            value={formValues.location}
                            readOnly
                            onClick={() => setActiveField('location')}
                        />
                    </div>

                    <div className="submit-btn">
                        <button className="btn btn-primary" type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </div>

            {activeField === 'position' && suggestions.length > 0 && (
                <div
                    ref={suggestionRef}
                    className="position-absolute w-100 mt-2 bg-white border rounded-3 shadow-lg p-2"
                    style={{
                        zIndex: 999,
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}
                >
                    {suggestions.slice(0, 5).map((item) => (
                        <div
                            key={item._id}
                            className="p-2 px-3 rounded-2 hover-bg-light cursor-pointer"
                            onClick={() => handleSuggestionClick(item._id)}
                            style={{ transition: 'background 0.2s ease' }}
                        >
                            <div className="fw-semibold text-dark">
                                {item.title}
                            </div>
                            <div className="text-muted small">
                                {item.salary.min} - {item.salary.max} USD
                            </div>
                            <div className="text-secondary small">
                                {item.contact?.full_name || 'Unknown company'}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeField === 'location' && (
                <div
                    className="position-absolute w-100 mt-2 bg-white border rounded-3 shadow-lg p-3"
                    style={{
                        zIndex: 999,
                        maxHeight: '300px',
                        overflowY: 'auto',
                    }}
                >
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
                                        checked={selectedLocations.includes(
                                            province.name,
                                        )}
                                        onChange={() =>
                                            toggleLocation(
                                                province.name,
                                                province.code,
                                            )
                                        }
                                        id={`province-${province.code}`}
                                    />
                                    <label
                                        className="form-check-label ms-2"
                                        htmlFor={`province-${province.code}`}
                                    >
                                        {province.name}
                                    </label>
                                </div>
                                {selectedLocations.includes(province.name) &&
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
                                                            selectedDistricts[
                                                                province.name
                                                            ]?.includes(
                                                                district.name,
                                                            ) || false
                                                        }
                                                        onChange={() =>
                                                            toggleDistrict(
                                                                province.name,
                                                                district.name,
                                                            )
                                                        }
                                                        id={`district-${province.code}-${district.code}`}
                                                    />
                                                    <label
                                                        className="form-check-label ms-2"
                                                        htmlFor={`district-${province.code}-${district.code}`}
                                                    >
                                                        {district.name}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default JobSearchBar
