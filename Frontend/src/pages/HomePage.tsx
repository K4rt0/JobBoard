import SingleFreelancerCard from '@/components/cards/SingleFreelancerCard'
import SingleJobCard from '@/components/cards/SingleJobCard'
import JobSearchBar from '@/components/JobSearchBar'
import { Category, Job, JobFilters, PaginationInfo } from '@/interfaces'
import axiosInstance from '@/services/axiosInstance'
import { getCategories } from '@/services/categoryService'
import { getJobs, getJobsPagination } from '@/services/jobSearchService'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [categories, setCategories] = useState<Category[]>([]) // Thêm state cho categories
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()

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

    // Fetch jobs
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await getJobs()
                const jobs = response.data.slice(0, 6)
                setJobs(jobs)
            } catch (err) {
                setError('Failed to fetch jobs. Please try again later.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        // Fetch categories
        const fetchCategories = async () => {
            try {
                const response = await getCategories() // Điều chỉnh URL API theo cấu hình của bạn
                setCategories(response.slice(0, 8)) // Lấy tối đa 8 categories
            } catch (err) {
                console.error('Failed to fetch categories:', err)
            }
        }

        fetchJobs()
        fetchCategories()
    }, [])

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

    const handleToJobSearch = () => {
        navigate('/jobs')
    }

    // Xử lý khi click vào category
    const handleCategoryClick = (categoryId: string) => {
        const newFilters = {
            ...filters,
            category_id: categoryId,
            page: 1,
        }
        navigate('/jobs', { state: { filters: newFilters } })
    }

    return (
        <>
            <section className="hero-area">
                {/* <!-- Single Slider --> */}
                <div className="hero-inner">
                    <div className="container">
                        <div className="row ">
                            <div className="col-lg-6 co-12">
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
                                            life easier, we are
                                            <br /> introducing Jobcamp template.
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
                                                <ul>
                                                    <li>
                                                        <a href="index.html#">
                                                            Administrative
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html#">
                                                            Android
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html#">
                                                            app
                                                        </a>
                                                    </li>
                                                    <li>
                                                        <a href="index.html#">
                                                            ASP.NET
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-lg-6 co-12">
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
                                        {/* <!-- Video Animation --> */}
                                        <div className="promo-video">
                                            <div className="waves-block">
                                                <div className="waves wave-1"></div>
                                                <div className="waves wave-2"></div>
                                                <div className="waves wave-3"></div>
                                            </div>
                                        </div>
                                        {/* <!--/ End Video Animation --> */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* <!--/ End Single Slider --> */}
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
                                            <i className="lni lni-cog"></i>{' '}
                                            {/* Có thể thay icon động theo category */}
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
                                .filter((job) => job) // Thay thế điều kiện lọc phù hợp, ví dụ: job.active === true
                                .map((job) => (
                                    <div
                                        className="col-lg-6 col-12"
                                        key={job._id}
                                    >
                                        <SingleJobCard job={job} />
                                    </div>
                                ))}
                        </div>

                        {/* <!-- Pagination --> */}
                        <div className="d-flex justify-content-center py-4">
                            <div className="button">
                                <Button
                                    onClick={handleToJobSearch}
                                    className="btn-sm"
                                >
                                    Show more
                                </Button>
                            </div>
                        </div>
                        {/* <!--/ End Pagination --> */}
                    </div>
                </div>
            </section>
        </>
    )
}

export default Home
