import React from "react";
import { FaStar, FaPhone, FaEnvelope, FaClock, FaMapMarkerAlt, FaEdit } from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";
import ProfileCard from "../components/ProfileCard";
import ContactInfo from "../components/ContactInfo";

const HousekeeperProfilePage = () => {
  return (
    <div className="container mt-4">
      {/* Profile Header */}
      <ProfileCard/>

      {/* Introduction */}
      <div className="card p-4 shadow-sm mt-3">
        <h5 className="fw-bold">Giới thiệu</h5>
        <p>Tôi là người giúp việc có 5 năm kinh nghiệm, chuyên vệ dọn dẹp nhà cửa và chăm sóc trẻ em. Tôi làm việc tận tâm, chu đáo và có trách nhiệm.</p>
      </div>

      <div className="row mt-3">
        {/* Skills */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold">Kỹ năng</h5>
            <ul className="list-unstyled d-flex flex-wrap gap-3">
              <li className="text-warning">🧹 Dọn dẹp nhà cửa</li>
              <li className="text-warning">👔 Giặt ủi</li>
              <li className="text-warning">🍳 Nấu ăn</li>
              <li className="text-warning">👶 Chăm sóc trẻ em</li>
            </ul>
          </div>
        </div>

        {/* Work Schedule */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold">Lịch làm việc</h5>
            <ul className="list-unstyled">
              <li>Thứ 2 - Thứ 6 <span className="text-success ms-3">8:00 - 17:00</span></li>
              <li>Thứ 7 <span className="text-success ms-3">8:00 - 12:00</span></li>
              <li>Chủ nhật <span className="text-danger ms-3">Nghỉ</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        {/* Contact Information */}
        <ContactInfo/>

        {/* Certificates & Documents */}
        <div className="col-md-6">
          <div className="card p-4 shadow-sm">
            <h5 className="fw-bold">Chứng chỉ & Giấy tờ</h5>
            <ul className="list-unstyled">
              <li>🌟 Chứng chỉ nghiệp vụ giúp việc <a href="#" className="text-primary">Xem</a></li>
              <li>📄 Giấy xác nhận lý lịch <a href="#" className="text-primary">Xem</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <div className="card p-4 shadow-sm mt-3">
        <h5 className="fw-bold">Đánh giá</h5>
        <div className="d-flex align-items-start mt-3">
          <img src="/user1.png" alt="User" className="rounded-circle me-3" width="50" height="50" />
          <div>
            <h6 className="mb-0">Trần Thị B</h6>
            <span className="text-muted small">2 ngày trước</span>
            <div className="d-flex align-items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className="text-warning" />
              ))}
            </div>
            <p className="mt-1">Làm việc rất tốt và có trách nhiệm. Sẽ thuê lại!</p>
          </div>
        </div>

        <div className="d-flex align-items-start mt-3">
          <img src="/user2.png" alt="User" className="rounded-circle me-3" width="50" height="50" />
          <div>
            <h6 className="mb-0">Lê Văn C</h6>
            <span className="text-muted small">1 tuần trước</span>
            <div className="d-flex align-items-center">
              {[...Array(4)].map((_, i) => (
                <FaStar key={i} className="text-warning" />
              ))}
              <FaStar className="text-muted" />
            </div>
            <p className="mt-1">Dọn dẹp sạch sẽ, gọn gàng.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HousekeeperProfilePage;
