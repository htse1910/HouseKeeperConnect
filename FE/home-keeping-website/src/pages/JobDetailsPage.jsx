import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaClock, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";

function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [similarJobs, setSimilarJobs] = useState([]);
  const [reviews, setReviews] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    fetch(`http://localhost:5280/api/Job/GetJobByID?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setJob(data);
        setLoading(false);
      })
      .catch((error) => console.error("Error fetching job details:", error));
  }, [id]);

  if (loading) {
    return <div className="text-center py-5">Đang tải thông tin công việc...</div>;
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left Column - Job Information */}
        <div className="col-md-8">
          <div className="card p-4 mb-3 shadow-sm border-0">
            <h3 className="fw-bold">{job.jobName}</h3>
            <p className="text-muted">
              <FaUser className="me-2" /> {job.account?.name} <FaMapMarkerAlt className="ms-3 me-2" /> Chưa cập nhật
            </p>
            <h4 className="text-warning fw-bold">Lương: Chưa cập nhật</h4>
            <p className="text-muted"><FaClock className="me-2" /> Ngày đăng: {job.account?.createdAt?.split("T")[0]}</p>
          </div>

          {/* Job Details */}
          <div className="card p-4 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Chi tiết công việc</h5>
            <p><strong>Phạm vi công việc:</strong> Chưa cập nhật</p>
            <p><strong>Lịch làm việc:</strong> Chưa cập nhật</p>
            <p><strong>Yêu cầu đặc biệt:</strong> Chưa cập nhật</p>
          </div>

          {/* Application Buttons */}
          <div className="d-flex">
            <button className="btn text-white w-50 me-2" style={{ backgroundColor: "#ff9900" }}>Ứng tuyển ngay</button>
            <button className="btn btn-outline-secondary w-50">Nhắn tin cho Gia đình</button>
          </div>
        </div>

        {/* Right Column - Similar Jobs & Reviews */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0">
            <h5 className="fw-bold">Đánh giá về gia đình</h5>
            {reviews.length === 0 ? <p>Chưa có đánh giá.</p> : reviews.map((review, index) => (
              <div key={index}>
                <div className="d-flex align-items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-warning me-1" />
                  ))}
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
