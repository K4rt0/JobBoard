import React, { ReactNode } from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

interface FormModalProps {
    show: boolean
    onHide: () => void
    onSubmit: () => void
    title: string
    icon: string
    children: ReactNode
}

const FormModal: React.FC<FormModalProps> = ({
    show,
    onHide,
    onSubmit,
    title,
    icon,
    children,
}) => {
    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton className="border-bottom-0 pb-0">
                <Modal.Title className="text-primary">
                    <i className={`${icon} me-2`}></i>
                    {title}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="pt-0">
                <div className="px-3">
                    <Form className="py-3">{children}</Form>
                </div>
            </Modal.Body>
            <Modal.Footer className="border-top-0 pt-0">
                <Button
                    variant="light"
                    onClick={onHide}
                    className="fw-bold px-4 py-2"
                >
                    <i className="lni lni-close me-1"></i>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={onSubmit}
                    className="fw-bold px-4 py-2"
                >
                    <i className="lni lni-checkmark me-1"></i>
                    Save Changes
                </Button>
            </Modal.Footer>
        </Modal>
    )
}

export default FormModal
