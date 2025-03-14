import React from 'react'

const AdminDashboard: React.FC = () => {
    return (
        <div
            className="admin-dashboard"
            style={{
                padding: '40px',
                background: '#f4f6f9',
                minHeight: '100vh',
                marginLeft: '260px', // Để lại không gian cho sidebar
            }}
        >
            <div
                style={{
                    background: '#ffffff',
                    padding: '30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    maxWidth: '1200px',
                    margin: '0 auto',
                }}
            >
                <h1
                    style={{
                        fontSize: '28px',
                        fontWeight: 700,
                        color: '#2c3e50',
                        marginBottom: '20px',
                        borderBottom: '2px solid #3498db',
                        paddingBottom: '10px',
                    }}
                >
                    Admin Dashboard
                </h1>
                <p
                    style={{
                        fontSize: '16px',
                        color: '#7f8c8d',
                        marginBottom: '30px',
                    }}
                >
                    Chào mừng đến với trang quản trị! Đây là nơi bạn có thể quản
                    lý người dùng, công việc và các cài đặt hệ thống.
                </p>

                {/* Quick Stats */}
                <div
                    style={{
                        display: 'grid',
                        gridTemplateColumns:
                            'repeat(auto-fit, minmax(250px, 1fr))',
                        gap: '20px',
                        marginBottom: '30px',
                    }}
                >
                    <div
                        style={{
                            background:
                                'linear-gradient(135deg, #3498db, #2980b9)',
                            padding: '20px',
                            borderRadius: '10px',
                            color: '#fff',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
                            Tổng số người dùng
                        </h3>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            1,245
                        </p>
                    </div>
                    <div
                        style={{
                            background:
                                'linear-gradient(135deg, #2ecc71, #27ae60)',
                            padding: '20px',
                            borderRadius: '10px',
                            color: '#fff',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
                            Tổng số công việc
                        </h3>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            342
                        </p>
                    </div>
                    <div
                        style={{
                            background:
                                'linear-gradient(135deg, #e74c3c, #c0392b)',
                            padding: '20px',
                            borderRadius: '10px',
                            color: '#fff',
                            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                            transition: 'transform 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)'
                        }}
                    >
                        <h3 style={{ fontSize: '18px', marginBottom: '10px' }}>
                            Yêu cầu đang chờ
                        </h3>
                        <p
                            style={{
                                fontSize: '24px',
                                fontWeight: 700,
                                margin: 0,
                            }}
                        >
                            18
                        </p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div
                    style={{
                        display: 'flex',
                        gap: '15px',
                    }}
                >
                    <button
                        style={{
                            padding: '12px 25px',
                            background: '#3498db',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#2980b9'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#3498db'
                        }}
                    >
                        Thêm người dùng
                    </button>
                    <button
                        style={{
                            padding: '12px 25px',
                            background: '#2ecc71',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '14px',
                            fontWeight: 500,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#27ae60'
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#2ecc71'
                        }}
                    >
                        Thêm công việc
                    </button>
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
