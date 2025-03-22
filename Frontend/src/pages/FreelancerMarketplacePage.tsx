import React, { useState, useEffect } from 'react'
import SingleFreelancerCard from '@/components/cards/SingleFreelancerCard'
import CustomPagination from '@/components/CustomPagination'
import FilterFreelancerSidebar from '@/components/sidebars/FilterFreelancerSidebar'
import { Freelancer } from '@/interfaces'
import { Container, Row, Col, Breadcrumb, Spinner } from 'react-bootstrap'

const FreelancerMarketplacePage: React.FC = () => {
    const [currentPage, setCurrentPage] = useState<number>(1)
    const [freelancers, setFreelancers] = useState<Freelancer[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    const totalResults = 397
    const resultsPerPage = 10

    // Giả lập API Fetch Freelancer List
    useEffect(() => {
        const fetchFreelancers = async () => {
            setLoading(true)
            try {
                // Fake API Response
                const response = await new Promise<{ data: Freelancer[] }>(
                    (resolve) =>
                        setTimeout(
                            () =>
                                resolve({
                                    data: [
                                        {
                                            id: '1',
                                            fullName: 'riyadalomgir77',
                                            email: 'riyad@example.com',
                                            phoneNumber: '123456789',
                                            location: 'Bangladesh',
                                            website: 'https://riyad.com',
                                            bio: "I'm a top-rated designer...",
                                            skills: [
                                                {
                                                    _id: '1',
                                                    name: 'Logo Design',
                                                    description: '',
                                                    slug: '',
                                                    createdAt:
                                                        new Date().toISOString(),
                                                    updatedAt:
                                                        new Date().toISOString(),
                                                },
                                                {
                                                    _id: '2',
                                                    name: 'Branding',
                                                    description: '',
                                                    slug: '',
                                                    createdAt:
                                                        new Date().toISOString(),
                                                    updatedAt:
                                                        new Date().toISOString(),
                                                },
                                            ],
                                            experience: 5,
                                            education: 'Bachelor in Design',
                                            hourlyRate: 20,
                                            currency: 'USD',
                                            rating: 5.0,
                                            level: 5.7,
                                            reviews: 37,
                                            avatar: '/api/placeholder/60/60',
                                            status: 'Active',
                                            createdAt: new Date().toISOString(),
                                            role: 'Freelancer',
                                        },
                                        {
                                            id: '2',
                                            fullName: 'DYehia2020',
                                            email: 'dyehia@example.com',
                                            phoneNumber: '987654321',
                                            location: 'Egypt',
                                            website: 'https://dyehia.com',
                                            bio: 'Providing quality service...',
                                            skills: [
                                                {
                                                    _id: '3',
                                                    name: 'Excel',
                                                    description: '',
                                                    slug: '',
                                                    createdAt:
                                                        new Date().toISOString(),
                                                    updatedAt:
                                                        new Date().toISOString(),
                                                },
                                                {
                                                    _id: '4',
                                                    name: 'Data Processing',
                                                    description: '',
                                                    slug: '',
                                                    createdAt:
                                                        new Date().toISOString(),
                                                    updatedAt:
                                                        new Date().toISOString(),
                                                },
                                            ],
                                            experience: 7,
                                            education: 'MBA in Data Science',
                                            hourlyRate: 15,
                                            currency: 'USD',
                                            rating: 5.0,
                                            level: 4.4,
                                            reviews: 10,
                                            avatar: '/api/placeholder/60/60',
                                            status: 'Active',
                                            createdAt: new Date().toISOString(),
                                            role: 'Freelancer',
                                        },
                                    ],
                                }),
                            1500,
                        ),
                )
                setFreelancers(response.data)
            } catch (error) {
                console.error('Failed to fetch freelancers:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchFreelancers()
    }, [currentPage]) // Mỗi lần đổi trang thì fetch lại dữ liệu

    return (
        <Container className="pt-5 container" style={{ zIndex: '1' }}>
            {/* Breadcrumb */}
            <Breadcrumb className="pt-5 mt-4">
                <Breadcrumb.Item href="#">Freelancers</Breadcrumb.Item>
                <Breadcrumb.Item active>Adobe Photoshop</Breadcrumb.Item>
            </Breadcrumb>
            <hr />

            <Row>
                {/* Left Sidebar */}
                <Col md={4}>
                    <FilterFreelancerSidebar />
                </Col>

                {/* Main Content */}
                <Col md={8}>
                    {loading ? (
                        <div className="d-flex justify-content-center py-5">
                            <Spinner animation="border" variant="primary" />
                        </div>
                    ) : (
                        <>
                            <Row className="gy-4">
                                {freelancers.length > 0 ? (
                                    freelancers.map((freelancer) => (
                                        <Col md={12} key={freelancer.id}>
                                            <SingleFreelancerCard
                                                freelancer={freelancer}
                                            />
                                        </Col>
                                    ))
                                ) : (
                                    <p className="text-center text-muted">
                                        No freelancers found.
                                    </p>
                                )}
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
                        </>
                    )}
                </Col>
            </Row>
        </Container>
    )
}

export default FreelancerMarketplacePage
