import React, { useState } from 'react'
import styled from 'styled-components'

// Styled Components (CSS-in-JS để định dạng giao diện)
const PageContainer = styled.div`
  margin-left: 280px; // Để tránh bị che bởi sidebar
  padding: 30px;
  min-height: 100vh;
  background: #f8fafc;
  background-image: linear-gradient(to bottom right, #f8fafc, #eef2ff);
  font-family: 'Inter', sans-serif;

  @media (max-width: 768px) {
    margin-left: 0;
    padding: 20px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
`

const Title = styled.h1`
  font-size: 28px;
  color: #1f2937;
  font-weight: 700;
  position: relative;

  &:after {
    content: '';
    position: absolute;
    bottom: -8px;
    left: 0;
    width: 60px;
    height: 3px;
    background: #2042e3;
    border-radius: 3px;
  }
`

const AddButton = styled.button`
  padding: 12px 24px;
  background: #2042e3;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 12px rgba(32, 66, 227, 0.15);
  transition: all 0.3s ease;

  &:hover {
    background: #1a33b9;
    box-shadow: 0 6px 16px rgba(32, 66, 227, 0.25);
  }

  svg {
    width: 18px;
    height: 18px;
  }
`

const JobsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 30px;
`

const JobCard = styled.div`
  background: #ffffff;
  padding: 20px;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  gap: 10px;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.08);
  }
`

const JobTitle = styled.h3`
  font-size: 16px;
  color: #1f2937;
  font-weight: 600;
  margin: 0;
`

const JobDetail = styled.p`
  font-size: 14px;
  color: #6b7280;
  margin: 0;
`

const ActionButtons = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`

const IconButton = styled.button`
  background: none;
  border: none;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;

  &:hover {
    color: #2042e3;
    background: #f5f7ff;
  }
`

const NoJobs = styled.div`
  text-align: center;
  padding: 60px 20px;
  background: #ffffff;
  border-radius: 14px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  grid-column: 1 / -1;
`

const EmptyIllustration = styled.div`
  width: 150px;
  height: 150px;
  margin: 0 auto 20px;
  background-color: #eef2ff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2042e3;
  font-size: 60px;
`

const EmptyText = styled.p`
  font-size: 16px;
  color: #6b7280;
  margin-bottom: 25px;
`

const ModalOverlay = styled.div<{ isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(3px);
  z-index: 1000;
  display: ${({ isOpen }) => (isOpen ? 'flex' : 'none')};
  align-items: center;
  justify-content: center;
`

const Modal = styled.div`
  background: #ffffff;
  padding: 30px;
  border-radius: 16px;
  width: 450px;
  max-width: 90%;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  z-index: 1001;
`

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 25px;
`

const ModalTitle = styled.h2`
  font-size: 20px;
  color: #1f2937;
  font-weight: 600;
  margin: 0;
`

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 22px;
  color: #6b7280;
  cursor: pointer;
  transition: color 0.3s ease;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    color: #1a33b9;
    background: #f5f7ff;
  }
`

const InputGroup = styled.div`
  margin-bottom: 25px;
`

const InputLabel = styled.label`
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: #4b5563;
`

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f9fafb;

  &:focus {
    outline: none;
    border-color: #2042e3;
    box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
    background: #ffffff;
  }
`

const TextArea = styled.textarea`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #e5e7eb;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background: #f9fafb;
  resize: vertical;
  min-height: 100px;

  &:focus {
    outline: none;
    border-color: #2042e3;
    box-shadow: 0 0 0 3px rgba(32, 66, 227, 0.15);
    background: #ffffff;
  }
`

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
`

const CancelButton = styled.button`
  padding: 12px 20px;
  background: #f3f4f6;
  color: #4b5563;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.3s ease;

  &:hover {
    background: #e5e7eb;
  }
`

const SaveButton = styled.button`
  padding: 12px 24px;
  background: #2042e3;
  color: #ffffff;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(32, 66, 227, 0.15);

  &:hover {
    background: #1a33b9;
    box-shadow: 0 6px 16px rgba(32, 66, 227, 0.25);
  }
`

// Icons (SVG để hiển thị icon cho các nút và placeholder)
const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M12 4v16m8-8H4"
    />
  </svg>
)

const EditIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="18"
    height="18"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
    />
  </svg>
)

const DeleteIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="18"
    height="18"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
    />
  </svg>
)

const EmptyIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
    width="70"
    height="70"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
    />
  </svg>
)

// Main Component: Trang quản lý việc làm (JobsPage)
const JobsPage: React.FC = () => {
  // State để lưu danh sách việc làm (jobs)
  // Hiện tại lưu trong state (mất khi reload), cần tích hợp API để lấy từ backend
  // Cấu trúc: { id: number, title: string, description: string, location: string }
  const [jobs, setJobs] = useState<
    { id: number; title: string; description: string; location: string }[]
  >([])

  // State để lưu dữ liệu việc làm mới hoặc việc làm đang chỉnh sửa
  // Cấu trúc: { title: string, description: string, location: string }
  const [newJob, setNewJob] = useState<{
    title: string
    description: string
    location: string
  }>({
    title: '',
    description: '',
    location: '',
  })

  // State để kiểm soát hiển thị modal
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  // State để lưu ID của việc làm đang chỉnh sửa (null nếu là thêm mới)
  const [editingId, setEditingId] = useState<number | null>(null)

  // Hàm mở modal để thêm hoặc chỉnh sửa việc làm
  // Nếu có job truyền vào thì là chỉnh sửa, không thì là thêm mới
  const handleOpenModal = (job?: {
    id: number
    title: string
    description: string
    location: string
  }) => {
    if (job) {
      // Chế độ chỉnh sửa: điền thông tin việc làm vào form
      setNewJob({
        title: job.title,
        description: job.description,
        location: job.location,
      })
      setEditingId(job.id)
    } else {
      // Chế độ thêm mới: reset form
      setNewJob({ title: '', description: '', location: '' })
      setEditingId(null)
    }
    setIsModalOpen(true)
  }

  // Hàm đóng modal và reset form
  const handleCloseModal = () => {
    setIsModalOpen(false)
    // Đợi 300ms để reset form (tránh người dùng nhìn thấy form reset ngay lập tức)
    setTimeout(() => {
      setNewJob({ title: '', description: '', location: '' })
      setEditingId(null)
    }, 300)
  }

  // Hàm lưu việc làm (thêm mới hoặc cập nhật)
  // Backend cần cung cấp API để:
  // 1. Thêm việc làm mới (POST /jobs)
  // 2. Cập nhật việc làm (PUT /jobs/:id)
  const handleSaveJob = () => {
    // Kiểm tra các trường bắt buộc không được để trống
    if (
      newJob.title.trim() === '' ||
      newJob.description.trim() === '' ||
      newJob.location.trim() === ''
    )
      return

    if (editingId) {
      // Chế độ chỉnh sửa: cập nhật việc làm trong danh sách
      // Gọi API: PUT /jobs/:id với body { title, description, location }
      setJobs(
        jobs.map((job) =>
          job.id === editingId
            ? {
                ...job,
                title: newJob.title.trim(),
                description: newJob.description.trim(),
                location: newJob.location.trim(),
              }
            : job
        )
      )
    } else {
      // Chế độ thêm mới: thêm việc làm vào đầu danh sách
      // Gọi API: POST /jobs với body { title, description, location }
      const job = {
        id: Date.now(), // Tạm thời dùng Date.now() để tạo ID, backend nên trả về ID thực
        title: newJob.title.trim(),
        description: newJob.description.trim(),
        location: newJob.location.trim(),
      }
      setJobs([job, ...jobs]) // Thêm vào đầu danh sách
    }

    // Đóng modal sau khi lưu
    handleCloseModal()
  }

  // Hàm xóa việc làm
  // Backend cần cung cấp API: DELETE /jobs/:id
  const handleDeleteJob = (id: number) => {
    // Gọi API: DELETE /jobs/:id
    setJobs(jobs.filter((job) => job.id !== id))
  }

  // Hàm xử lý khi người dùng nhấn Enter để lưu việc làm
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSaveJob()
    }
  }

  return (
    <PageContainer>
      {/* Header: Tiêu đề và nút thêm việc làm */}
      <Header>
        <Title>Job Management</Title>
        <AddButton onClick={() => handleOpenModal()}>
          <PlusIcon /> Add New Job
        </AddButton>
      </Header>

      {/* Danh sách việc làm */}
      <JobsContainer>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <JobCard key={job.id}>
              <JobTitle>{job.title}</JobTitle>
              <JobDetail>{job.description}</JobDetail>
              <JobDetail>Location: {job.location}</JobDetail>
              <ActionButtons>
                {/* Nút chỉnh sửa việc làm */}
                <IconButton onClick={() => handleOpenModal(job)}>
                  <EditIcon />
                </IconButton>
                {/* Nút xóa việc làm */}
                <IconButton onClick={() => handleDeleteJob(job.id)}>
                  <DeleteIcon />
                </IconButton>
              </ActionButtons>
            </JobCard>
          ))
        ) : (
          // Hiển thị placeholder khi không có việc làm
          <NoJobs>
            <EmptyIllustration>
              <EmptyIcon />
            </EmptyIllustration>
            <ModalTitle>No Jobs Added Yet</ModalTitle>
            <EmptyText>Start adding jobs to build your job board</EmptyText>
            <AddButton onClick={() => handleOpenModal()}>
              <PlusIcon /> Add Your First Job
            </AddButton>
          </NoJobs>
        )}
      </JobsContainer>

      {/* Modal để thêm hoặc chỉnh sửa việc làm */}
      <ModalOverlay isOpen={isModalOpen} onClick={handleCloseModal}>
        <Modal onClick={(e) => e.stopPropagation()}>
          <ModalHeader>
            <ModalTitle>{editingId ? 'Edit Job' : 'Add New Job'}</ModalTitle>
            <CloseButton onClick={handleCloseModal}>×</CloseButton>
          </ModalHeader>

          {/* Form nhập tiêu đề việc làm */}
          <InputGroup>
            <InputLabel>Job Title</InputLabel>
            <Input
              type="text"
              value={newJob.title}
              onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
              onKeyPress={handleKeyPress}
              placeholder="Enter job title"
              autoFocus
            />
          </InputGroup>

          {/* Form nhập mô tả việc làm */}
          <InputGroup>
            <InputLabel>Description</InputLabel>
            <TextArea
              value={newJob.description}
              onChange={(e) =>
                setNewJob({ ...newJob, description: e.target.value })
              }
              placeholder="Enter job description"
            />
          </InputGroup>

          {/* Form nhập địa điểm */}
          <InputGroup>
            <InputLabel>Location</InputLabel>
            <Input
              type="text"
              value={newJob.location}
              onChange={(e) =>
                setNewJob({ ...newJob, location: e.target.value })
              }
              placeholder="Enter job location"
            />
          </InputGroup>

          {/* Nút hành động trong modal */}
          <ModalActions>
            <CancelButton onClick={handleCloseModal}>Cancel</CancelButton>
            <SaveButton onClick={handleSaveJob}>
              {editingId ? 'Update' : 'Save'}
            </SaveButton>
          </ModalActions>
        </Modal>
      </ModalOverlay>
    </PageContainer>
  )
}

export default JobsPage
