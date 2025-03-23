import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

interface PaginationProps {
    currentPage: number
    setCurrentPage: (page: number) => void // Updated to match the function signature in JobSearchPage
    totalResults: number
    resultsPerPage: number
}

const CustomPagination: React.FC<PaginationProps> = ({
    currentPage,
    setCurrentPage,
    totalResults,
    resultsPerPage,
}) => {
    const totalPages = Math.ceil(totalResults / resultsPerPage)
    const maxPagesToShow = 5 // Maximum number of page buttons to show at once

    // Return null if there's only one page or no results
    if (totalPages <= 1) return null

    const handlePageChange = (page: number) => {
        if (page < 1 || page > totalPages) return
        setCurrentPage(page)
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' })
    }

    // Function to generate the pagination items dynamically
    const getPaginationItems = () => {
        const items: React.ReactNode[] = []

        // Always show first page
        items.push(
            <li key="first" className={currentPage === 1 ? 'active' : ''}>
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault()
                        handlePageChange(1)
                    }}
                >
                    1
                </a>
            </li>,
        )

        // Calculate range of visible pages
        const startPage = Math.max(
            2,
            currentPage - Math.floor(maxPagesToShow / 2),
        )
        const endPage = Math.min(totalPages - 1, startPage + maxPagesToShow - 3)

        // Add ellipsis if needed
        if (startPage > 2) {
            items.push(
                <li key="ellipsis-start">
                    <span>...</span>
                </li>,
            )
        }

        // Add middle pages
        for (let i = startPage; i <= endPage; i++) {
            items.push(
                <li key={i} className={currentPage === i ? 'active' : ''}>
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(i)
                        }}
                    >
                        {i}
                    </a>
                </li>,
            )
        }

        // Add ellipsis before last page if needed
        if (endPage < totalPages - 1) {
            items.push(
                <li key="ellipsis-end">
                    <span>...</span>
                </li>,
            )
        }

        // Always show last page if total pages > 1
        if (totalPages > 1) {
            items.push(
                <li
                    key="last"
                    className={currentPage === totalPages ? 'active' : ''}
                >
                    <a
                        href="#"
                        onClick={(e) => {
                            e.preventDefault()
                            handlePageChange(totalPages)
                        }}
                    >
                        {totalPages}
                    </a>
                </li>,
            )
        }

        return items
    }

    return (
        <Container className="pagination center justify-content-center">
            <Row>
                <Col xs={12}>
                    <ul className="pagination-list ">
                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(currentPage - 1)
                                }}
                                className={currentPage === 1 ? 'disabled' : ''}
                                aria-label="Previous"
                            >
                                <i className="lni lni-arrow-left"></i>
                            </a>
                        </li>

                        {getPaginationItems()}

                        <li>
                            <a
                                href="#"
                                onClick={(e) => {
                                    e.preventDefault()
                                    handlePageChange(currentPage + 1)
                                }}
                                className={
                                    currentPage === totalPages ? 'disabled' : ''
                                }
                                aria-label="Next"
                            >
                                <i className="lni lni-arrow-right"></i>
                            </a>
                        </li>
                    </ul>
                </Col>
            </Row>
        </Container>
    )
}

export default CustomPagination
