import React from "react";
import { FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaStar, FaUserCircle } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

function HousekeeperDetailsPage() {
  const { id } = useParams();

  // Mock Data
  const housekeeper = {
    id,
    name: "Trần Văn B",
    location: "Quận 3, TP. HCM",
    rating: 4.0,
    skills: ["Dọn dẹp", "Giặt ủi"],
    salary: "150,000 VND/giờ",
    posted: "3 ngày trước",
  };

  const jobDetails = {
    title: "Dọn dẹp nhà cửa",
    location: "Quận 1, TP. Hồ Chí Minh",
    salary: "150,000 VND/giờ",
    posted: "3 ngày trước",
    scope: "Dọn dẹp nhà cửa, giặt đồ, lau cửa kính",
    schedule: "Thứ Hai - Thứ Sáu, 9:00 sáng - 5:00 chiều",
    special: "Không đi cùng với thú cưng",
  };

  const reviews = [
    {
      user: "Nguyễn Văn A",
      rating: 5,
      comment: "Người giúp việc rất chuyên nghiệp và tận tâm.",
    },
  ];

  const similarJobs = [
    {
      title: "Dọn dẹp và nấu ăn",
      salary: "140,000 VND/giờ",
    },
  ];

  return (
    <div className="container mt-4">
      {/* Job Header */}
      <div className="card shadow-sm p-4 mb-3">
        <h3 className="fw-bold">{jobDetails.title}</h3>
        <p className="text-muted">
          <FaMapMarkerAlt className="text-danger me-2" />
          {jobDetails.location} &nbsp; | &nbsp;
          <FaMoneyBillWave className="text-success me-2" />
          {jobDetails.salary} &nbsp; | &nbsp;
          <FaClock className="text-muted me-2" />
          Đăng {jobDetails.posted}
        </p>
      </div>

      <div className="row">
        {/* Job Details Section */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4 mb-3">
            <h5 className="fw-bold">Chi tiết công việc</h5>
            <p><strong>Phạm vi công việc:</strong> {jobDetails.scope}</p>
            <p><strong>Lịch làm việc:</strong> {jobDetails.schedule}</p>
            <p><strong>Yêu cầu đặc biệt:</strong> {jobDetails.special}</p>
          </div>

          {/* Reviews Section */}
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Đánh giá</h5>
            {reviews.map((review, index) => (
              <div key={index} className="d-flex align-items-center mb-3">
                <FaUserCircle size={40} className="text-muted me-3" />
                <div>
                  <h6 className="fw-bold">{review.user}</h6>
                  <div className="d-flex align-items-center">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < review.rating ? "text-warning" : "text-muted"} />
                    ))}
                  </div>
                  <p className="mb-0">{review.comment}</p>
                </div>
              </div>
            ))}
            <button className="btn btn-warning mt-2">Thêm đánh giá</button>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="col-md-4">
          {/* Candidate Section */}
          <div className="card shadow-sm p-4 mb-3">
            <h5 className="fw-bold">Ứng viên (3)</h5>
            <div className="d-flex align-items-center mb-3">
              <FaUserCircle size={50} className="text-muted me-3" />
              <div>
                <h6 className="fw-bold">{housekeeper.name}</h6>
                <p className="text-muted">{housekeeper.location}</p>
                <div className="d-flex align-items-center">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className={i < housekeeper.rating ? "text-warning" : "text-muted"} />
                  ))}
                  <span className="ms-2 text-muted">({housekeeper.rating})</span>
                </div>
                <div className="d-flex gap-2 my-2">
                  {housekeeper.skills.map((skill, index) => (
                    <span key={index} className="badge bg-light text-dark px-3 py-1">{skill}</span>
                  ))}
                </div>
                <div className="d-flex gap-2">
                  <button className="btn btn-warning w-50">Thuê ngay</button>
                  <button className="btn btn-outline-warning w-50">Nhắn tin</button>
                </div>
              </div>
            </div>
          </div>

          {/* Similar Jobs Section */}
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Công việc tương tự</h5>
            {similarJobs.map((job, index) => (
              <div key={index} className="d-flex justify-content-between align-items-center">
                <p className="mb-0">{job.title}</p>
                <p className="fw-bold text-warning mb-0">{job.salary}</p>
              </div>
            ))}
            <Link to="#" className="text-warning fw-bold mt-2 d-block">Xem chi tiết</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HousekeeperDetailsPage;
