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
        <div className="card mb-5 shadow-lg border-0 rounded-3 mt-3">
            <div className="card-body p-4">
                <form onSubmit={handleSubmit}>
                    <div className="row g-3 align-items-center">
                        <div className="col-md-7">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-briefcase"></i>
                                </span>
                                <input
                                    type="text"
                                    name="position"
                                    value={formValues.position}
                                    onChange={handleSearchChange}
                                    className="form-control border-start-0"
                                    placeholder="Job Position (e.g., Software Engineer)"
                                />
                            </div>
                        </div>
                        <div className="col-md-3">
                            <div className="input-group">
                                <span className="input-group-text bg-white border-end-0">
                                    <i className="bi bi-geo-alt"></i>
                                </span>
                                <input
                                    type="text"
                                    name="location"
                                    value={formValues.location}
                                    onChange={handleSearchChange}
                                    className="form-control border-start-0"
                                    placeholder="Location (e.g., New York, NY)"
                                />
                            </div>
                        </div>
                        <div className="col-md-2">
                            <button
                                type="submit"
                                className="btn btn-primary w-100 rounded-pill"
                            >
                                <i className="bi bi-search me-2"></i>
                                Search
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default JobSearchBar
