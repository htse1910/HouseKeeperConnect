import React from 'react';
import { Link } from 'react-router-dom';

function ConfirmAccountPage() {
  return (
    <div
      className="d-flex flex-column align-items-center justify-content-center vh-100"
      style={{ backgroundColor: '#fff' }}
    >
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h2 className="fw-bold" style={{ color: '#333' }}>Xác thực tài khoản</h2>
      </div>
      <div style={{ width: '100%', maxWidth: '400px', textAlign: 'center', marginBottom: '2rem' }}>
        <p>
          Bạn đã đăng ký tài khoản thành công. Vui lòng kích hoạt tài khoản của bạn theo hướng dẫn vừa được gửi đến email bạn đã đăng ký.
        </p>
        <p style={{ fontStyle: 'italic', color: '#555' }}>
          (Hãy kiểm tra trong thư mục Spam nếu bạn không nhận được thư của chúng tôi)
        </p>
      </div>
      <div>
        <Link
          to="/login"
          className="btn"
          style={{
            backgroundColor: '#FFC27A',
            border: 'none',
            borderRadius: '25px',
            height: '50px',
            width: '100%',
            maxWidth: '400px',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            textAlign: 'center',
          }}
        >
          Đăng nhập
        </Link>
      </div>
    </div>
  );
}

export default ConfirmAccountPage;
