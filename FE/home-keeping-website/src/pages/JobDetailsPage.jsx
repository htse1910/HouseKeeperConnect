import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";

// Time slots map
const slotMap = {
  1: "8H - 9H",
  2: "10H - 11H",
  3: "12H - 13H",
  4: "14H - 15H",
  5: "16H - 17H",
  6: "18H - 19H",
  7: "20H - 21H",
};

// Day of week map
const dayOfWeekMap = {
  0: "Chủ Nhật",
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
};

// Only service names
const serviceDetailsMap = {
  1: "Lau nhà",
  3: "Quét nhà",
};

function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    fetch(`http://localhost:5280/api/Job/GetJobDetailByID?id=${id}`, {
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
      .catch((error) => {
        console.error("Error fetching job details:", error);
        setLoading(false);
      });
  }, [id]);

  const formatDays = (days) => days?.map((d) => dayOfWeekMap[d]).join(", ") || "Không rõ";
  const formatSlots = (slots) => slots?.map((s) => slotMap[s]).join(", ") || "Không rõ";
  const formatServices = (ids) =>
    ids?.map((id) => serviceDetailsMap[id] ?? `Dịch vụ không rõ (ID: ${id})`).join(", ") || "Không rõ";

  if (loading) {
    return <div className="text-center py-5">Đang tải thông tin công việc...</div>;
  }

  if (!job) {
    return <div className="text-center text-danger py-5">Không tìm thấy thông tin công việc.</div>;
  }

  return (
    <div className="container py-4">
      <div className="row">
        {/* Left Column */}
        <div className="col-md-8">
          <div className="card p-4 mb-3 shadow-sm border-0">
            <h3 className="fw-bold">{job.jobName}</h3>
            <p className="text-muted">
              <FaUser className="me-2" /> Gia đình ID: {job.familyID}
              <FaMapMarkerAlt className="ms-3 me-2" /> {job.location}
            </p>
            <h4 className="text-warning fw-bold">
              Lương: {job.price ? `${job.price.toLocaleString()} VND` : "Chưa cập nhật"}
            </h4>
            <p className="text-muted">
              <FaClock className="me-2" /> Từ {job.startDate?.split("T")[0]} đến {job.endDate?.split("T")[0]}
            </p>
          </div>

          {/* Job Details */}
          <div className="card p-4 mb-3 shadow-sm border-0">
            <h5 className="fw-bold">Chi tiết công việc</h5>
            <p><strong>Dịch vụ:</strong> {formatServices(job.serviceIDs)}</p>
            <p><strong>Lịch làm việc:</strong> {formatDays(job.dayofWeek)} — {formatSlots(job.slotIDs)}</p>
            <p><strong>Yêu cầu đặc biệt:</strong> {job.description || "Không có"}</p>
          </div>

          <div className="d-flex">
            <button className="btn text-white w-50 me-2" style={{ backgroundColor: "#ff9900" }}>
              Ứng tuyển ngay
            </button>
            <button className="btn btn-outline-secondary w-50" disabled>
              Nhắn tin cho Gia đình
            </button>
          </div>
        </div>

        {/* Right Column */}
        <div className="col-md-4">
          <div className="card p-3 shadow-sm border-0">
            <h5 className="fw-bold">Thông tin thêm</h5>
            <p>Chưa có dữ liệu đánh giá hoặc liên hệ.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
