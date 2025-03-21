import SingleFreelancerCard from '@/components/cards/SingleFreelancerCard'
import SingleJobCard from '@/components/cards/SingleJobCard'
import { Job, JobFilters, PaginationInfo } from '@/interfaces'
import { getJobs, getJobsPagination } from '@/services/jobSearchService'
import { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap'
import { Link, useNavigate } from 'react-router-dom'

const Home = () => {
    const [jobs, setJobs] = useState<Job[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const navigate = useNavigate()
    // Fetch jobs when filters change
    useEffect(() => {
        const fetchJobs = async () => {
            setIsLoading(true)
            setError(null)
            try {
                const response = await getJobs()
                const jobs = response.data.slice(0, 6)
                setJobs(jobs) // Directly assign the array of jobs to state
            } catch (err) {
                setError('Failed to fetch jobs. Please try again later.')
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }

        fetchJobs()
    }, [])

    const handleToJobSearch = () => {
        navigate('/jobs')
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
                                        <div className="job-search-form">
                                            <form action="index.html#">
                                                {/* <!-- Single Field Item Start  --> */}
                                                <div className="single-field-item keyword">
                                                    <label htmlFor="keyword">
                                                        What
                                                    </label>
                                                    <input
                                                        id="keyword"
                                                        placeholder="What jobs you want?"
                                                        name="keyword"
                                                        type="text"
                                                    />
                                                </div>
                                                {/* <!-- Single Field Item End  --> */}
                                                {/* <!-- Single Field Item Start  --> */}
                                                <div className="single-field-item location">
                                                    <label htmlFor="location">
                                                        Where
                                                    </label>
                                                    <input
                                                        id="location"
                                                        className="input-field input-field-location"
                                                        placeholder="Location"
                                                        name="location"
                                                        type="text"
                                                    />
                                                </div>
                                                {/* <!-- Single Field Item End  --> */}
                                                <div className="submit-btn">
                                                    <button
                                                        className="btn"
                                                        type="submit"
                                                    >
                                                        Search
                                                    </button>
                                                </div>
                                            </form>
                                        </div>
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
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".2s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-cog"></i>
                                    </div>
                                    <h3>
                                        Technical
                                        <br /> Support
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".4s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-layers"></i>
                                    </div>
                                    <h3>
                                        Business
                                        <br /> Development
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".6s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-home"></i>
                                    </div>
                                    <h3>
                                        Real Estate
                                        <br /> Business
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".8s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-search"></i>
                                    </div>
                                    <h3>
                                        Share Maeket
                                        <br /> Analysis
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".2s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-investment"></i>
                                    </div>
                                    <h3>
                                        Finance & Banking <br /> Service
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".4s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-cloud-network"></i>
                                    </div>
                                    <h3>
                                        IT & Networing <br /> Sevices
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".6s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-restaurant"></i>
                                    </div>
                                    <h3>
                                        Restaurant <br /> Services
                                    </h3>
                                </a>
                            </div>
                            <div className="col-lg-3 col-md-6 col-12">
                                <a
                                    href="browse-jobs.html"
                                    className="single-cat wow fadeInUp"
                                    data-wow-delay=".8s"
                                >
                                    <div className="icon">
                                        <i className="lni lni-fireworks"></i>
                                    </div>
                                    <h3>
                                        Defence & Fire <br /> Service
                                    </h3>
                                </a>
                            </div>
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
