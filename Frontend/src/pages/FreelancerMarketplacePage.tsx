import SingleFreelancerCard from '@/components/cards/SingleFreelancerCard'
import CustomPagination from '@/components/CustomPagination'
import FilterSidebar from '@/components/sidebars/FilterSidebar'
import { Freelancer } from '@/interfaces'
import { useState } from 'react'
import { Container, Row, Col, Breadcrumb } from 'react-bootstrap'

const FreelancerMarketplacePage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const totalResults = 397
    const resultsPerPage = 10

    // Sample data of freelancers
    const freelancers: Freelancer[] = [
        {
            id: 1,
            name: 'riyadalomgir77',
            country: 'Bangladesh',
            countryCode: 'bd',
            skills: 'LABEL | PACKAGING | 3D Mockups | LOGO | BRANDING',
            categories:
                'Covers & Packaging, Adobe Photoshop, Logo Design, Illustration, Graphic Design',
            description:
                "Welcome! I'm AIOMGIR, an accomplished graphic designer hailing from vibrant Bangladesh...",
            hourlyRate: 20,
            currency: 'USD',
            rating: 5.0,
            level: 5.7,
            reviews: 37,
            avatar: '/api/placeholder/60/60',
        },
        {
            id: 2,
            name: 'DYehia2020',
            country: 'Egypt',
            countryCode: 'eg',
            skills: 'CV, PDF, WORD, EXCEL, FORMS, CHARTS, GRAPHICS',
            categories:
                'Excel, Data Entry, PDF, Data Processing, Graphic Design',
            description:
                'If you are searching for Top Quality service, you are on the right profile...',
            hourlyRate: 15,
            currency: 'USD',
            rating: 5.0,
            level: 4.4,
            reviews: 10,
            avatar: '/api/placeholder/60/60',
        },
        {
            id: 3,
            name: 'Farzanayesmin23',
            country: 'Bangladesh',
            countryCode: 'bd',
            skills: 'Professional Graphic Designer',
            categories:
                'Graphic Design, Logo Design, Photoshop, Brochure Design, Adobe Photoshop',
            description:
                "Hello Dear Buyer, I'm Farzana Yesmin. I'm a full time professional graphics designer...",
            hourlyRate: 30,
            currency: 'USD',
            rating: 4.9,
            level: 2.6,
            reviews: 3,
            avatar: '/api/placeholder/60/60',
        },
        {
            id: 4,
            name: 'abduldesigner322',
            country: 'United Kingdom',
            countryCode: 'gb',
            skills: 'Professional Designer',
            categories: 'Graphic Design, Logo Design, Photoshop, UI/UX Design',
            description:
                "I'm a professional designer with over 7 years of experience...",
            hourlyRate: 25,
            currency: 'USD',
            rating: 4.8,
            level: 4.2,
            reviews: 45,
            avatar: '/api/placeholder/60/60',
        },
    ]

    return (
        <Container className="pt-5 container">
            {/* Breadcrumb */}
            <Breadcrumb>
                <Breadcrumb.Item href="#">Freelancers</Breadcrumb.Item>
                <Breadcrumb.Item active>Adobe Photoshop</Breadcrumb.Item>
            </Breadcrumb>

            <Row>
                {/* Left Sidebar */}
                <Col md={4}>
                    <FilterSidebar />
                </Col>

                {/* Main Content */}
                <Col md={8}>
                    <Row className="gy-4">
                        {freelancers.map((freelancer) => (
                            <Col md={12} key={freelancer.id}>
                                <SingleFreelancerCard freelancer={freelancer} />
                            </Col>
                        ))}
                    </Row>

                    {/* Pagination */}
                    <div className="d-flex justify-content-between align-items-center mt-4">
                        <CustomPagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalResults={totalResults}
                            resultsPerPage={resultsPerPage}
                        />
                    </div>
                </Col>
            </Row>
        </Container>
    )
}

export default FreelancerMarketplacePage
