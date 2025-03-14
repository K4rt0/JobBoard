import { Freelancer } from '@/interfaces'
import React from 'react'
import { Card, Button, Badge, ProgressBar } from 'react-bootstrap'

interface FreelancerCardProps {
    freelancer: Freelancer
}

// Updated Freelancer Card Component
const SingleFreelancerCard: React.FC<FreelancerCardProps> = ({
    freelancer,
}) => {
    // Render star rating with better visualization
    const renderStars = (rating: number) => {
        const fullStars = Math.floor(rating)
        const hasHalfStar = rating - fullStars >= 0.5

        return (
            <div className="d-flex align-items-center">
                <span className="text-muted small">({rating.toFixed(1)})</span>
                {[...Array(5)].map((_, i) => (
                    <span key={i} className={`text-warning fs-5 me-1`}>
                        {i < fullStars
                            ? '★'
                            : hasHalfStar && i === fullStars
                              ? '★'
                              : '☆'}
                    </span>
                ))}
            </div>
        )
    }

    return (
        <Card className="shadow-sm border-0 mb-4 p-3">
            <div className="d-flex align-items-center">
                {/* Avatar */}
                <div className="position-relative me-3">
                    <Card.Img
                        src={freelancer.avatar}
                        alt={freelancer.name}
                        className="rounded-circle border"
                        style={{
                            width: '80px',
                            height: '80px',
                            objectFit: 'cover',
                        }}
                    />
                </div>

                {/* Main Content */}
                <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-center">
                        <div>
                            <h5 className="fw-bold mb-1">{freelancer.name}</h5>
                            <div className="d-flex flex-wrap">
                                {freelancer.skills
                                    .split(',')
                                    .map((skill, index) => (
                                        <Badge
                                            key={index}
                                            bg="secondary"
                                            className="me-2 mb-1"
                                        >
                                            {skill.trim()}
                                        </Badge>
                                    ))}
                            </div>
                        </div>

                        {/* Hire Button */}
                        <div className="button">
                            <a href="/" className="btn btn-alt px-2 py-1">
                                <i className="bi bi-person-plus"></i>Hire Me
                            </a>
                        </div>
                    </div>

                    {/* Stats Row */}
                    <div className="d-flex align-items-center mt-1">
                        <div className="me-3">
                            {renderStars(freelancer.rating)}
                        </div>

                        <div className="me-3 d-flex align-items-center mx-2">
                            <i className="bi bi-chat-left-text text-primary me-1"></i>
                            <span className="fw-medium">
                                {freelancer.reviews} Reviews
                            </span>
                        </div>

                        <Badge bg="danger" className="px-3 py-2">
                            <span className="fw-bold fs-5">
                                ${freelancer.hourlyRate}
                            </span>
                            <small className="ms-1">
                                {freelancer.currency}/hr
                            </small>
                        </Badge>
                    </div>

                    {/* Categories */}
                    <div className="mt-2">
                        {freelancer.categories
                            .split(',')
                            .map((category, index) => (
                                <Badge
                                    key={index}
                                    bg="light"
                                    text="dark"
                                    className="me-2 mb-1 px-2 py-1"
                                >
                                    {category.trim()}
                                </Badge>
                            ))}
                    </div>

                    {/* Description */}
                    <p
                        className="text-muted mt-2 text-truncate"
                        style={{ maxWidth: '80%' }}
                    >
                        {freelancer.description}
                    </p>
                </div>
            </div>
        </Card>
    )
}

export default SingleFreelancerCard
