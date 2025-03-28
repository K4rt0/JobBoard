import React, { useEffect, useState } from 'react'
import SingleFreelancerCard from '@/components/cards/SingleFreelancerCard'
import SingleJobCard from '@/components/cards/SingleJobCard'
import CustomPagination from '@/components/CustomPagination'
import JobSearchBar from '@/components/JobSearchBar'
import { Category, Job, JobFilters, PaginationInfo } from '@/interfaces'
import { fetchCategories, getAllCategories } from '@/services/categoryService'
import { getJobs, getJobsPagination } from '@/services/jobSearchService'
import { Link, useNavigate } from 'react-router-dom'
import { Heart } from 'react-bootstrap-icons'
import MiniJobCard from '@/components/cards/MiniJobCard'

const Home = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [suggestedJobs, setSuggestedJobs] = useState<Job[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

    const locations = [
        { value: '', label: 'Random' },
        { value: 'Hà Nội', label: 'Hà Nội' },
        { value: 'Thành phố Hồ Chí Minh', label: 'Thành phố Hồ Chí Minh' },
        { value: 'Nha Trang', label: 'Nha Trang' },
        { value: 'Cần Thơ', label: 'Cần Thơ' },
    ]

    const [suggestionFilters, setSuggestionFilters] = useState<JobFilters>({
        search: '',
        location: '',
        job_type: [],
        category_id: '',
        experience: '',
        salary_min: '',
        salary_max: '',
        page: 1,
        limit: 8,
    })
    const [totalSuggestionResults, setTotalSuggestionResults] =
        useState<number>(0)

    const [filters, setFilters] = useState<JobFilters>({
        search: '',
        location: '',
        job_type: [],
        category_id: '',
        experience: '',
        salary_min: '',
        salary_max: '',
        page: 1,
        limit: 8,
    })

    // Fetch data on mount and when suggestionFilters change
    useEffect(() => {
        const fetchInitialData = async () => {
            setIsLoading(true)
            setError(null)
            try {
                // Fetch recent jobs
                const jobsResponse = await getJobs()
                setJobs(jobsResponse.data.slice(0, 6))

                // Fetch categories
                const categoriesResponse = await getAllCategories()
                setCategories(categoriesResponse.slice(0, 8))

                // Fetch suggested jobs
                const suggestedResponse = await getJobsPagination(
                    suggestionFilters.page,
                    suggestionFilters.limit,
                    suggestionFilters,
                )
                setSuggestedJobs(suggestedResponse.data)
                setTotalSuggestionResults(suggestedResponse.pagination.total)
            } catch (err) {
                setError('Failed to load data. Please try again later.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchInitialData()
    }, [suggestionFilters])

    // Handlers
    const handleSearch = (searchQuery: {
        position: string
        location: string
    }) => {
        const newFilters = {
            ...filters,
            search: searchQuery.position,
            location: searchQuery.location,
            page: 1,
        }
        navigate('/jobs', { state: { filters: newFilters } })
    }

    const handleToJobSearch = () => navigate('/jobs')

    const handleCategoryClick = (categoryId: string) => {
        const newFilters = { ...filters, category_id: categoryId, page: 1 }
        navigate('/jobs', { state: { filters: newFilters } })
    }

    const handleKeywordClick = (keyword: string) => {
        const newFilters = { ...filters, search: keyword, page: 1 }
        navigate('/jobs', { state: { filters: newFilters } })
    }

    const handleLocationChange = (location: string) => {
        setSuggestionFilters((prev) => ({ ...prev, location, page: 1 }))
    }

    const handleSuggestionPageChange = (page: number) => {
        setSuggestionFilters((prev) => ({ ...prev, page }))
    }

    return (
        <>
            <section className="hero-area">
                <div className="hero-inner">
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-6 col-12">
                                <div className="inner-content">
                                    <div className="hero-text">
                                        <h1
                                            className="wow fadeInUp"
                                            data-wow-delay=".3s"
                                        >
                                            Find Your Career <br />
                                            to Make a Better Life
                                        </h1>
                                        <p
                                            className="wow fadeInUp"
                                            data-wow-delay=".5s"
                                        >
                                            Creating a beautiful job website is
                                            not easy <br /> always. To make your
                                            life easier, we are <br />{' '}
                                            introducing Jobcamp template.
                                        </p>
                                    </div>
                                    <div
                                        className="job-search-wrap-two mt-50 wow fadeInUp"
                                        data-wow-delay=".7s"
                                    >
                                        <JobSearchBar
                                            searchQuery={{
                                                position: filters.search || '',
                                                location:
                                                    filters.location || '',
                                            }}
                                            onSearch={handleSearch}
                                        />
                                        <div className="trending-keywords mt-30">
                                            <div className="keywords style-two">
                                                <span className="title">
                                                    Popular Keywords:
                                                </span>
                                                <ul className="mb-0">
                                                    <li>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleKeywordClick(
                                                                    'Administrative',
                                                                )
                                                            }}
                                                        >
                                                            Administrative
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleKeywordClick(
                                                                    'Android',
                                                                )
                                                            }}
                                                        >
                                                            Android
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleKeywordClick(
                                                                    'app',
                                                                )
                                                            }}
                                                        >
                                                            app
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a
                                                            href="#"
                                                            onClick={(e) => {
                                                                e.preventDefault()
                                                                handleKeywordClick(
                                                                    'ASP.NET',
                                                                )
                                                            }}
                                                        >
                                                            ASP.NET
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 col-12">
                                <div
                                    className="hero-video-head wow fadeInRight"
                                    data-wow-delay=".5s"
                                >
                                    <div className="video-inner">
                                        <img
                                            src="assets/images/hero/hero-image.png"
                                            alt="#"
                                        />
                                        <a
                                            href="https://www.youtube.com/watch?v=cz4z8CyvDas"
                                            className="glightbox hero-video"
                                        >
                                            <i className="lni lni-play"></i>
                                        </a>
                                        <div className="promo-video">
                                            <div className="waves-block">
                                                <div className="waves wave-1"></div>
                                                <div className="waves wave-2"></div>
                                                <div className="waves wave-3"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="apply-process section">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-4 col-md-4 col-12">
                            <div className="process-item">
                                <i className="lni lni-user"></i>
                                <h4>Register Your Account</h4>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">
                            <div className="process-item">
                                <i className="lni lni-book"></i>
                                <h4>Upload Your Resume</h4>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                            </div>
                        </div>
                        <div className="col-lg-4 col-md-4 col-12">
                            <div className="process-item">
                                <i className="lni lni-briefcase"></i>
                                <h4>Apply for Dream Job</h4>
                                <p>
                                    Lorem Ipsum is simply dummy text of the
                                    printing and typesetting industry.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Suggestions Section */}
            <section className="section find-job">
                <div className="container">
                    <div className="d-flex row justify-content-between align-items-center mb-4">
                        <div className="section-title">
                            <span
                                className="wow fadeInDown"
                                data-wow-delay=".2s"
                            >
                                Excellent Works
                            </span>
                            <h2 className="wow fadeInUp" data-wow-delay=".4s">
                                Recommended Jobs For You
                            </h2>
                        </div>
                    </div>

                    {/* Location Buttons */}
                    <div className="d-flex flex-wrap justify-content-center gap-2 mb-5">
                        {locations.map((loc) => (
                            <button
                                key={loc.value}
                                onClick={() => handleLocationChange(loc.value)}
                                className={`btn rounded-pill px-4 py-2 fw-medium ${
                                    suggestionFilters.location === loc.value
                                        ? 'btn-primary text-white'
                                        : 'btn-outline-secondary text-dark hover-bg-primary hover-text-white'
                                }`}
                            >
                                {loc.label}
                            </button>
                        ))}
                    </div>

                    {/* Suggested Jobs */}
                    {isLoading ? (
                        <div className="text-center py-5">
                            <div
                                className="spinner-border text-primary"
                                role="status"
                            >
                                <span className="visually-hidden">
                                    Loading...
                                </span>
                            </div>
                            <p className="text-muted mt-2">Loading jobs...</p>
                        </div>
                    ) : error ? (
                        <div className="text-center py-5 text-danger">
                            <i className="lni lni-warning fs-1"></i>
                            <p className="mt-2">{error}</p>
                        </div>
                    ) : suggestedJobs.length === 0 ? (
                        <div className="text-center py-5 text-muted">
                            <i className="lni lni-emoji-sad fs-1"></i>
                            <p className="mt-2">
                                No jobs found for this location.
                            </p>
                        </div>
                    ) : (
                        <div className="row row-cols-1 row-cols-md-2 row-cols-lg-4 g-4 justify-content-start">
                            {suggestedJobs.map((job) => (
                                <div key={job._id} className="col">
                                    <MiniJobCard job={job} />
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {!isLoading && !error && suggestedJobs.length > 0 && (
                        <div className="d-flex justify-content-center mt-5">
                            <CustomPagination
                                currentPage={suggestionFilters.page ?? 1}
                                setCurrentPage={handleSuggestionPageChange}
                                totalResults={totalSuggestionResults}
                                resultsPerPage={suggestionFilters.limit ?? 8}
                            />
                        </div>
                    )}
                </div>
            </section>
            <section className="job-category section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-title">
                                <span
                                    className="wow fadeInDown"
                                    data-wow-delay=".2s"
                                >
                                    Job Category
                                </span>
                                <h2
                                    className="wow fadeInUp"
                                    data-wow-delay=".4s"
                                >
                                    Choose Your Desire Category
                                </h2>
                                <p
                                    className="wow fadeInUp"
                                    data-wow-delay=".6s"
                                >
                                    There are many variations of passages of
                                    Lorem Ipsum available, but the majority have
                                    suffered alteration in some form.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="cat-head">
                        <div className="row">
                            {categories.map((category, index) => (
                                <div
                                    className="col-lg-3 col-md-6 col-12"
                                    key={category._id}
                                >
                                    <div
                                        className="single-cat wow fadeInUp"
                                        data-wow-delay={`.${2 + index * 2}s`}
                                        onClick={() =>
                                            handleCategoryClick(category._id)
                                        }
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="icon">
                                            <i className="lni lni-cog"></i>
                                        </div>
                                        <h3>
                                            {category.name.split(' ').length >
                                            1 ? (
                                                <>
                                                    {
                                                        category.name.split(
                                                            ' ',
                                                        )[0]
                                                    }{' '}
                                                    <br />
                                                    {category.name
                                                        .split(' ')
                                                        .slice(1)
                                                        .join(' ')}
                                                </>
                                            ) : (
                                                category.name
                                            )}
                                        </h3>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section className="find-job section">
                <div className="container">
                    <div className="row">
                        <div className="col-12">
                            <div className="section-title">
                                <span
                                    className="wow fadeInDown"
                                    data-wow-delay=".2s"
                                >
                                    Hot Jobs
                                </span>
                                <h2
                                    className="wow fadeInUp"
                                    data-wow-delay=".4s"
                                >
                                    Browse Recent Jobs
                                </h2>
                                <p
                                    className="wow fadeInUp"
                                    data-wow-delay=".6s"
                                >
                                    There are many variations of passages of
                                    Lorem Ipsum available, but the majority have
                                    suffered alteration in some form.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="single-head">
                        <div className="row">
                            {jobs
                                .filter((job) => job)
                                .map((job) => (
                                    <div
                                        className="col-lg-6 col-12"
                                        key={job._id}
                                    >
                                        <SingleJobCard job={job} />
                                    </div>
                                ))}
                        </div>

                        <div className="d-flex justify-content-center py-4">
                            <div className="button">
                                <button
                                    onClick={handleToJobSearch}
                                    className="btn btn-sm"
                                >
                                    Show more
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
