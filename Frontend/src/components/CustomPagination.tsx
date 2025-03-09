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
                <Pagination.Item
                    key={1}
                    active={currentPage === 1}
                    onClick={() => setCurrentPage(1)}
                >
                    1
                </Pagination.Item>,
            )
            if (startPage > 2) {
                items.push(<Pagination.Ellipsis key="ellipsis-start" />)
            }
        }

        // Add pages in the calculated range
        for (let page = startPage; page <= endPage; page++) {
            items.push(
                <Pagination.Item
                    key={page}
                    active={currentPage === page}
                    onClick={() => setCurrentPage(page)}
                >
                    {page}
                </Pagination.Item>,
            )
        }

        // Add ellipsis if there's a gap before the last page
        if (endPage < totalPages - 1) {
            items.push(<Pagination.Ellipsis key="ellipsis-end" />)
        }

        // Always show the last page if not already included
        if (endPage < totalPages) {
            items.push(
                <Pagination.Item
                    key={totalPages}
                    active={currentPage === totalPages}
                    onClick={() => setCurrentPage(totalPages)}
                >
                    {totalPages}
                </Pagination.Item>,
            )
        }

        return items
    }

    // Calculate the range of results being shown
    const startResult = (currentPage - 1) * resultsPerPage + 1
    const endResult = Math.min(currentPage * resultsPerPage, totalResults)

    return (
        <Container>
            {/* Pagination Row (Sửa lỗi hiển thị theo hàng ngang) */}
            <Row className="justify-content-center">
                <Col xs="auto">
                    <Pagination className="d-flex flex-wrap justify-content-center">
                        <Pagination.Prev
                            onClick={() =>
                                setCurrentPage((prev) => Math.max(1, prev - 1))
                            }
                            disabled={currentPage === 1}
                        />
                        {getPaginationItems()}
                        <Pagination.Next
                            onClick={() =>
                                setCurrentPage((prev) =>
                                    Math.min(totalPages, prev + 1),
                                )
                            }
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
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
