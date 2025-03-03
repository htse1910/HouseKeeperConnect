import React from 'react';
import { FaPhone, FaEnvelope, FaStar, FaUserEdit } from 'react-icons/fa';

function ProfilePage() {
  const user = {
    name: 'Nguyễn Thu Hà',
    gender: 'Nữ',
    location: 'Quận 1, Thành phố Hồ Chí Minh',
    rating: 4.0,
    reviewsCount: 10,
    avatar: 'https://via.placeholder.com/100', // Replace with actual profile picture
    introduction: 'Tôi là người giúp việc có 5 năm kinh nghiệm, chuyên về dọn dẹp nhà cửa và chăm sóc trẻ em. Tôi làm việc tận tâm, chu đáo và có trách nhiệm.',
    skills: ['Dọn dẹp nhà cửa', 'Nấu ăn', 'Giặt ủi', 'Chăm sóc trẻ em'],
    certificates: [
      { name: 'Chứng chỉ nghiệp vụ giúp việc', link: '#' },
      { name: 'Giấy xác nhận lý lịch', link: '#' },
    ],
    schedule: {
      weekdays: '8:00 - 17:00',
      saturday: '8:00 - 12:00',
      sunday: 'Nghỉ',
    },
    contact: {
      phone: '0123-xxx-xxx',
      email: 'example@email.com',
    },
    reviews: [
      {
        name: 'Trần Thị B',
        rating: 5,
        time: '2 ngày trước',
        comment: 'Làm việc rất tốt và có trách nhiệm. Sẽ thuê lại!',
      },
      {
        name: 'Lê Văn C',
        rating: 4,
        time: '1 tuần trước',
        comment: 'Dọn dẹp sạch sẽ, gọn gàng.',
      },
    ],
  };

  return (
    <div className="container py-4">
      {/* Profile Header */}
      <div className="card p-4 mb-3 shadow-sm border-0">
        <div className="d-flex align-items-center">
          <img src={user.avatar} alt="Profile" className="rounded-circle me-3" width="80" height="80" />
          <div>
            <h4 className="fw-bold">{user.name}</h4>
            <div className="d-flex align-items-center">
              <div className="me-2">
                {Array.from({ length: 5 }, (_, i) => (
                  <FaStar key={i} className={i < user.rating ? 'text-warning' : 'text-muted'} />
                ))}
              </div>
              <span className="fw-bold">({user.rating})</span>
            </div>
            <p className="mb-0"><strong>Giới tính:</strong> {user.gender}</p>
            <p className="mb-0"><strong>Khu vực làm việc:</strong> {user.location}</p>
          </div>
          <FaUserEdit className="ms-auto text-warning" style={{ cursor: 'pointer' }} />
        </div>
      </div>

      <div className="row">
        {/* Introduction */}
        <div className="col-md-8">
          <div className="card p-3 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Giới thiệu</h5>
            <p>{user.introduction}</p>
          </div>
        </div>

        {/* Work Schedule */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0 my-3">  {/* Added margin (my-3) */}
            <h5 className="fw-bold">Lịch làm việc</h5>
            <p className="mb-1"><strong>Thứ 2 - Thứ 6:</strong> <span className="text-success">{user.schedule.weekdays}</span></p>
            <p className="mb-1"><strong>Thứ 7:</strong> <span className="text-success">{user.schedule.saturday}</span></p>
            <p className="mb-0"><strong>Chủ nhật:</strong> <span className="text-danger">{user.schedule.sunday}</span></p>
          </div>
        </div>

        {/* Skills */}
        <div className="col-md-8">
          <div className="card p-3 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Kỹ năng</h5>
            <div className="d-flex flex-wrap">
              {user.skills.map((skill, index) => (
                <span key={index} className="badge bg-light text-dark me-2 mb-2 p-2">{skill}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0 my-3">  {/* Added margin (my-3) */}
            <h5 className="fw-bold">Thông tin liên hệ</h5>
            <p className="mb-1"><FaPhone className="text-warning me-2" /> {user.contact.phone}</p>
            <p className="mb-0"><FaEnvelope className="text-warning me-2" /> {user.contact.email}</p>
          </div>
        </div>

        {/* Certificates */}
        <div className="col-md-8">
          <div className="card p-3 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Chứng chỉ & Giấy tờ</h5>
            {user.certificates.map((cert, index) => (
              <div key={index} className="d-flex justify-content-between border-bottom pb-2 mb-2">
                <span>{cert.name}</span>
                <a href={cert.link} className="text-decoration-none text-primary">Xem</a>
              </div>
            ))}
          </div>
        </div>

        {/* Reviews */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0 my-3">  {/* Added margin (my-3) */}
            <h5 className="fw-bold">Đánh giá</h5>
            {user.reviews.map((review, index) => (
              <div key={index} className="mb-3">
                <div className="d-flex align-items-center">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FaStar key={i} className={i < review.rating ? 'text-warning' : 'text-muted'} />
                  ))}
                </div>
                <p className="mb-1 fw-bold">{review.name} <span className="text-muted">- {review.time}</span></p>
                <p className="mb-0">{review.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;
