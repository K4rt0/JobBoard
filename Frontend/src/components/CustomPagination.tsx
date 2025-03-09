import React from 'react'
import { Pagination, Container, Row, Col } from 'react-bootstrap'

interface PaginationProps {
    currentPage: number
    setCurrentPage: React.Dispatch<React.SetStateAction<number>>
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

    // Function to generate the pagination items dynamically
    const getPaginationItems = () => {
        const items: React.ReactNode[] = []
        const halfMaxPages = Math.floor(maxPagesToShow / 2)
        let startPage = Math.max(1, currentPage - halfMaxPages)
        const endPage = Math.min(totalPages, startPage + maxPagesToShow - 1)

        // Adjust startPage if near the end
        if (endPage === totalPages) {
            startPage = Math.max(1, endPage - maxPagesToShow + 1)
        }

        // Always show the first page
        if (startPage > 1) {
            items.push(
                <li key={1} className={currentPage === 1 ? 'active' : ''}>
                    <a href="#" onClick={() => setCurrentPage(1)}>
                        1
                    </a>
                </li>,
            )
            if (startPage > 2) {
                items.push(
                    <li key="ellipsis-start">
                        <span>...</span>
                    </li>,
                )
            }
        }

        // Add pages in the calculated range
        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <li key={page} className={currentPage === page ? 'active' : ''}>
                    <a href="#" onClick={() => setCurrentPage(page)}>
                        {page}
                    </a>
                </li>,
            )
        }

        // Add ellipsis if there's a gap before the last page
        if (endPage < totalPages - 1) {
            items.push(
                <li key="ellipsis-end">
                    <span>...</span>
                </li>,
            )
        }

        // Always show the last page if not already included
        if (endPage < totalPages) {
            items.push(
                <li
                    key={totalPages}
                    className={currentPage === totalPages ? 'active' : ''}
                >
                    <a href="#" onClick={() => setCurrentPage(totalPages)}>
                        {totalPages}
                    </a>
                </li>,
            )
        }

        return items
    }

    // Calculate the range of results being shown
    const startResult = (currentPage - 1) * resultsPerPage + 1
    const endResult = Math.min(currentPage * resultsPerPage, totalResults)

    return (
        <Container className="pagination center">
            <Row>
                <Col xs={12}>
                    <ul className="pagination-list">
                        <li>
                            <a
                                href="#"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.max(1, prev - 1),
                                    )
                                }
                                className={currentPage === 1 ? 'disabled' : ''}
                            >
                                <i className="lni lni-arrow-left"></i>
                            </a>
                        </li>
                        {getPaginationItems()}
                        <li>
                            <a
                                href="#"
                                onClick={() =>
                                    setCurrentPage((prev) =>
                                        Math.min(totalPages, prev + 1),
                                    )
                                }
                                className={
                                    currentPage === totalPages ? 'disabled' : ''
                                }
                            >
                                <i className="lni lni-arrow-right"></i>
                            </a>
                        </li>
                    </ul>
                </Col>
            </Row>

            {/* Results Summary */}
            <Row className="justify-content-center mt-2">
                <Col xs="auto" className="text-muted small">
                    Showing {startResult} - {endResult} of {totalResults}{' '}
                    results
                </Col>
            </Row>
        </Container>
    )
}

export default CustomPagination
