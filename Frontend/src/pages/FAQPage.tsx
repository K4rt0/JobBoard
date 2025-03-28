import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'

interface FAQItem {
    question: string
    answer: string[]
}
const faqData: FAQItem[] = [
    {
        question: 'How do I create an account on Job Grids?',
        answer: [
            'To create an account, click on the "Register Your Account" button on the homepage. Fill in your details such as name, email, and password, then submit the form. You’ll receive a confirmation email to activate your account.',
            'Make sure to verify your email to access all features, including job applications and profile management.',
        ],
    },
    {
        question: 'How can I search for jobs on Job Grids?',
        answer: [
            'Use the search bar on the homepage to find jobs. Enter keywords like "Android developer" or "marketing" in the "What" field, and specify a location in the "Where" field. Click "Search" to see relevant job listings.',
        ],
    },
    {
        question: 'How do I apply for a job on Job Grids?',
        answer: [
            'After finding a job you’re interested in, click on the job listing to view details. Then, click the "Apply Now" button. You’ll need to upload your resume and may be asked to fill in additional information before submitting your application.',
        ],
    },
    {
        question: 'Is there a fee to use Job Grids for job seekers?',
        answer: [
            'No, Job Grids is completely free for job seekers. You can search for jobs, apply, and manage your profile at no cost. Employers may have paid plans to post jobs, but this does not affect job seekers.',
        ],
    },
    {
        question: 'Can I upload my resume to Job Grids?',
        answer: [
            'Yes! After logging in, go to your profile section and click on "Upload Your Resume." You can upload a PDF or Word document, which will be visible to employers when you apply for jobs.',
        ],
    },
    {
        question:
            'What should I do if I encounter issues while using Job Grids?',
        answer: [
            'If you face any issues, you can contact our support team by emailing support@jobgrids.com or using the "Contact Us" form in the footer of the website.',
            'We also have a Help Center with guides on common topics like job applications and profile setup.',
        ],
    },
]

const FAQPage: React.FC = () => {
    return (
        <>
            {/* Thêm keyframes cho fadeInUp */}
            <style>
                {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translate3d(0, 40px, 0);
            }
            to {
              opacity: 1;
              transform: translate3d(0, 0, 0);
            }
          }
        `}
            </style>
            <div className="pt-5">
                <div className="pt-5 mt-2"></div>
            </div>
            {/* Breadcrumbs Section */}
            <div
                style={{
                    backgroundColor: '#2563EB',
                    color: '#fff',
                    padding: '4rem 0',
                    textAlign: 'center',
                }}
            >
                <Container>
                    <Row>
                        <Col xs={12}>
                            <div>
                                <h1
                                    style={{
                                        fontSize: '2.5rem',
                                        fontWeight: 'bold',
                                        marginBottom: '10px',
                                    }}
                                >
                                    Frequently Asked Questions
                                </h1>
                                <p
                                    style={{
                                        fontSize: '1.1rem',
                                        lineHeight: '1.6',
                                        marginBottom: '20px',
                                    }}
                                >
                                    Business plan draws on a wide range of
                                    knowledge from different business
                                    <br />
                                    disciplines. Business draws on a wide range
                                    of different business.
                                </p>
                            </div>
                            <ul
                                style={{
                                    listStyle: 'none',
                                    padding: 0,
                                    display: 'flex',
                                    justifyContent: 'center',
                                    gap: '10px',
                                    fontSize: '1rem',
                                }}
                            >
                                <li>
                                    <a
                                        href="/"
                                        style={{
                                            color: '#fff',
                                            textDecoration: 'none',
                                            opacity: 0.8,
                                        }}
                                    >
                                        Home
                                    </a>
                                </li>
                                <li style={{ opacity: 0.6 }}>&gt; Faq</li>
                            </ul>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* FAQ Section */}
            <section style={{ padding: '60px 0' }}>
                <Container>
                    <Row>
                        <Col xs={12} lg={6}>
                            {faqData.slice(0, 3).map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex mb-4"
                                    style={{
                                        alignItems: 'flex-start',
                                        animation: 'fadeInUp 0.5s ease-in-out',
                                        animationDelay: `${0.2 + index * 0.2}s`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            backgroundColor: '#2563EB',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            marginRight: '20px',
                                            flexShrink: 0,
                                        }}
                                    >
                                        ?
                                    </div>
                                    <div>
                                        <h4
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            {item.question}
                                        </h4>
                                        {item.answer.map((paragraph, idx) => (
                                            <p
                                                key={idx}
                                                style={{
                                                    fontSize: '1rem',
                                                    color: '#6B7280',
                                                    marginBottom: '10px',
                                                    lineHeight: '1.6',
                                                }}
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Col>
                        <Col xs={12} lg={6}>
                            {faqData.slice(3, 6).map((item, index) => (
                                <div
                                    key={index}
                                    className="d-flex mb-4"
                                    style={{
                                        alignItems: 'flex-start',
                                        animation: 'fadeInUp 0.5s ease-in-out',
                                        animationDelay: `${0.2 + index * 0.2}s`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    <div
                                        style={{
                                            width: '50px',
                                            height: '50px',
                                            backgroundColor: '#2563EB',
                                            color: '#fff',
                                            borderRadius: '50%',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.5rem',
                                            fontWeight: 'bold',
                                            marginRight: '20px',
                                            flexShrink: 0,
                                        }}
                                    >
                                        ?
                                    </div>
                                    <div>
                                        <h4
                                            style={{
                                                fontSize: '1.25rem',
                                                fontWeight: 'bold',
                                                color: '#000',
                                                marginBottom: '10px',
                                            }}
                                        >
                                            {item.question}
                                        </h4>
                                        {item.answer.map((paragraph, idx) => (
                                            <p
                                                key={idx}
                                                style={{
                                                    fontSize: '1rem',
                                                    color: '#6B7280',
                                                    marginBottom: '10px',
                                                    lineHeight: '1.6',
                                                }}
                                            >
                                                {paragraph}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </Col>
                    </Row>
                </Container>
            </section>
        </>
    )
}

export default FAQPage
