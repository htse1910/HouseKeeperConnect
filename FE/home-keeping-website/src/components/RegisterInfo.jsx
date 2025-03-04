import React from 'react';
import FamilyImage from '../components/images/family.png';
import { FaCheckCircle, FaShieldAlt, FaHeadset } from 'react-icons/fa';

function RegisterInfo({ role }) {
  return (
    <div
      className="p-4 shadow rounded text-center d-flex flex-column justify-content-center"
      style={{ width: '100%', maxWidth: '400px', backgroundColor: '#fff', height: '100%' }}
    >
      {role === 'Family' ? (
        <>
          <img
            src={FamilyImage}
            alt="Family Illustration"
            className="img-fluid mb-3"
            style={{ borderRadius: '10px', maxHeight: '200px', objectFit: 'contain' }}
          />
          <h4 className="fw-bold">Tạo tài khoản để tìm Người giúp việc phù hợp với gia đình bạn</h4>
          <p className="text-muted">
            Chúng tôi sẽ giúp bạn tìm được người giúp việc phù hợp nhất với nhu cầu của gia đình bạn.
          </p>
        </>
      ) : (
        <>
          <div className="d-flex align-items-center mb-3">
            <FaShieldAlt className="me-2 text-warning" size={24} />
            <div>
              <h5 className="mb-1 fw-bold">Xác minh danh tính</h5>
              <p className="text-muted mb-0">
                Xác minh CCCD là bắt buộc để đảm bảo sự an toàn và tính minh bạch trên nền tảng.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center mb-3">
            <FaCheckCircle className="me-2 text-warning" size={24} />
            <div>
              <h5 className="mb-1 fw-bold">Uy tín và chất lượng</h5>
              <p className="text-muted mb-0">
                Chúng tôi cam kết mang đến trải nghiệm dịch vụ tốt nhất cho khách hàng.
              </p>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <FaHeadset className="me-2 text-warning" size={24} />
            <div>
              <h5 className="mb-1 fw-bold">Hỗ trợ 24/7</h5>
              <p className="text-muted mb-0">
                Đội ngũ hỗ trợ luôn sẵn sàng giúp đỡ bạn mọi lúc mọi nơi.
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default RegisterInfo;
