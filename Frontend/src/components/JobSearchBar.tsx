import React, { useState } from 'react'

interface JobSearchBarProps {
    searchQuery: { position: string; location: string }
    onSearch: (query: { position: string; location: string }) => void
}

const JobSearchBar: React.FC<JobSearchBarProps> = ({
    searchQuery,
    onSearch,
}) => {
    // Local state to manage form inputs
    const [formValues, setFormValues] = useState({
        position: searchQuery.position,
        location: searchQuery.location,
    })

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormValues({ ...formValues, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSearch(formValues)
    }

    return (
        <div
            className="job-search-wrap-two mt-50 wow fadeInUp card mb-5 shadow-lg border-0 rounded-3 mt-3"
            data-wow-delay=".7s"
        >
            <div className="job-search-form">
                <form onSubmit={handleSubmit}>
                    {/* Single Field Item Start - What/Position */}
                    <div className="single-field-item keyword">
                        <label htmlFor="keyword">What</label>
                        <input
                            id="keyword"
                            placeholder="What jobs you want?"
                            name="position"
                            type="text"
                            value={formValues.position}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {/* Single Field Item End */}

                    {/* Single Field Item Start - Where/Location */}
                    <div className="single-field-item location">
                        <label htmlFor="location">Where</label>
                        <input
                            id="location"
                            className="input-field input-field-location"
                            placeholder="Location"
                            name="location"
                            type="text"
                            value={formValues.location}
                            onChange={handleSearchChange}
                        />
                    </div>
                    {/* Single Field Item End */}

                    {/* Submit Button */}
                    <div className="submit-btn">
                        <button className="btn" type="submit">
                            Search
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JobSearchBar
