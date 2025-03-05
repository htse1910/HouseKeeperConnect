import React from 'react';
import { useParams } from 'react-router-dom';
import { FaMapMarkerAlt, FaUser, FaClock, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

function JobDetailsPage() {
  const { id } = useParams();

  // Example job data (this should come from an API in real cases)
  const job = {
    title: 'Dọn dẹp nhà cửa',
    employer: 'Gia đình Nguyễn Văn A',
    location: 'Quận 1, TP. Hồ Chí Minh',
    salary: '150,000 VND/giờ',
    posted: 'Đăng 3 ngày trước',
    workScope: 'Dọn dẹp nhà cửa, giặt đồ, lau cửa kính.',
    schedule: 'Thứ Hai - Thứ Sáu, 9:00 sáng - 5:00 chiều',
    requirements: 'Không dị ứng với thú cưng',
  };

  const similarJobs = [
    {
      id: 4,
      title: 'Dọn dẹp căn hộ',
      location: 'Quận 6, TP. Hồ Chí Minh',
      salary: '120,000 VND/giờ',
    },
    {
      id: 5,
      title: 'Giúp việc theo giờ',
      location: 'Quận 1, TP. Hồ Chí Minh',
      salary: '140,000 VND/giờ',
    },
  ];

  const reviews = [
    {
      user: 'Nguyễn Văn B',
      rating: 5,
      comment: 'Gia đình thân thiện, thanh toán đúng hạn.',
    },
  ];

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left Column - Job Information */}
        <div className="col-md-8">
          {/* Job Summary */}
          <div className="card p-4 mb-3 shadow-sm border-0">
            <h3 className="fw-bold">{job.title}</h3>
            <p className="text-muted">
              <FaUser className="me-2" /> {job.employer} <FaMapMarkerAlt className="ms-3 me-2" /> {job.location}
            </p>
            <h4 className="text-warning fw-bold">{job.salary}</h4>
            <p className="text-muted"><FaClock className="me-2" /> {job.posted}</p>
          </div>

          {/* Job Details */}
          <div className="card p-4 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Chi tiết công việc</h5>
            <p><strong>Phạm vi công việc:</strong> {job.workScope}</p>
            <p><strong>Lịch làm việc:</strong> {job.schedule}</p>
            <p><strong>Yêu cầu đặc biệt:</strong> {job.requirements}</p>
          </div>

          {/* Application Buttons */}
          <div className="d-flex">
            <button className="btn text-white w-50 me-2" style={{ backgroundColor: '#ff9900' }}>Ứng tuyển ngay</button>
            <button className="btn btn-outline-secondary w-50">Nhắn tin cho Gia đình</button>
          </div>
        </div>

        {/* Right Column - Similar Jobs & Reviews */}
        <div className="col-md-4">
          {/* Similar Jobs */}
          <div className="card p-3 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Công việc tương tự</h5>
            {similarJobs.map((job) => (
              <div key={job.id} className="border-bottom pb-2 mb-2">
                <h6 className="mb-0">{job.title}</h6>
                <p className="text-muted mb-1">{job.location}</p>
                <h6 className="text-warning fw-bold">{job.salary}</h6>
                <Link to={`/job/${job.id}`} className="text-decoration-none text-primary">Xem chi tiết</Link>
              </div>
            ))}
          </div>

          {/* Family Review */}
          <div className="card p-3 shadow-sm border-0">
            <h5 className="fw-bold">Đánh giá về gia đình</h5>
            {reviews.map((review, index) => (
              <div key={index}>
                <div className="d-flex align-items-center">
                  <FaStar className="text-warning me-1" />
                  <FaStar className="text-warning me-1" />
                  <FaStar className="text-warning me-1" />
                  <FaStar className="text-warning me-1" />
                  <FaStar className="text-warning" />
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
