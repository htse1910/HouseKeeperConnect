import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

// Slot and day maps
const slotMap = {
  1: "8H - 9H",
  2: "10H - 11H",
  3: "12H - 13H",
  4: "14H - 15H",
  5: "16H - 17H",
  6: "18H - 19H",
  7: "20H - 21H",
};

const dayOfWeekMap = {
  0: "Chủ Nhật",
  1: "Thứ Hai",
  2: "Thứ Ba",
  3: "Thứ Tư",
  4: "Thứ Năm",
  5: "Thứ Sáu",
  6: "Thứ Bảy",
};

const serviceDetailsMap = {
  1: "Dọn dẹp theo giờ", 2: "Dọn dẹp định kỳ", 3: "Tổng vệ sinh nhà cửa", 4: "Dọn dẹp sau sự kiện/tết",
  5: "Giữ trẻ theo giờ", 6: "Giữ trẻ tại nhà nguyên ngày", 7: "Chăm sóc người cao tuổi tại nhà",
  8: "Nấu ăn theo bữa", 9: "Nấu ăn theo tuần/tháng", 10: "Mua sắm thực phẩm & lên thực đơn",
  11: "Giặt ủi theo kg", 12: "Ủi quần áo theo bộ", 13: "Giặt hấp cao cấp", 14: "Chăm sóc cây cảnh",
  15: "Tưới cây, cắt tỉa hàng tuần", 16: "Tắm & cắt tỉa lông thú cưng", 17: "Sửa chữa điện nước",
  18: "Sơn sửa nội thất nhỏ", 19: "Thợ sửa chữa theo giờ", 20: "Giúp việc theo yêu cầu (dịch vụ VIP)",
  21: "Dịch vụ giúp việc theo tháng", 22: "Hỗ trợ vận chuyển đồ đạc nhẹ",
};

function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [familyName, setFamilyName] = useState("Không rõ");
  const [familyAccountID, setFamilyAccountID] = useState(null);
  const jobTypeMap = {
    1: "Full-time",
    2: "Part-time",
  };

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    fetch(`${API_BASE_URL}/Job/GetJobDetailByID?id=${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJob(data);
        setLoading(false);

        // Fetch family name using familyID -> accountID -> name
        if (data.familyID) {
          fetch(`${API_BASE_URL}/Families/GetFamilyByID?id=${data.familyID}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${authToken}` },
          })
            .then((res) => res.json())
            .then((family) => {
              if (family?.accountID) {
                setFamilyAccountID(family.accountID);
                fetch(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${family.accountID}`, {
                  method: "GET",
                  headers: { Authorization: `Bearer ${authToken}` },
                })
                  .then((res) => res.json())
                  .then((account) => {
                    setFamilyName(account?.name || "Không rõ");
                  });
              }
            })
            .catch((err) => console.warn("Lỗi khi lấy tên gia đình:", err));
        }
      })

  }, [id]);

  const handleApply = async () => {
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    if (!accountID || !authToken || !job?.jobID) {
      toast.warn("⚠️ Thiếu thông tin để ứng tuyển.");
      return;
    }

    setApplying(true);

    try {
      const response = await fetch(
        `${API_BASE_URL}/Application/AddApplication?accountID=${accountID}&jobID=${job.jobID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        toast.success("🎉 Ứng tuyển thành công!");
      } else {
        toast.error("❌ Ứng tuyển thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("🚫 Có lỗi xảy ra khi ứng tuyển.");
    } finally {
      setApplying(false);
    }
  };

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
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="row">
        {/* Left Column */}
        <div className="col-lg-8">
          {/* Hero Section */}
          <div className="card shadow-sm border-0 mb-4 p-4 bg-light">
            <h2 className="fw-bold mb-3">{job.jobName}</h2>
            <div className="mb-2 text-muted">
              <FaUser className="me-2" />
              Gia đình: <strong>{familyName}</strong>
              <FaMapMarkerAlt className="ms-4 me-2" />
              {job.location}
            </div>
            <h4 className="fw-bold text-warning mb-3">
              {job.price ? `${job.price.toLocaleString()} VND` : "Chưa cập nhật"}
            </h4>
            <p className="text-muted">
              <FaClock className="me-2" />
              Từ <strong>{job.startDate?.split("T")[0]}</strong> đến <strong>{job.endDate?.split("T")[0]}</strong>
            </p>
          </div>

          {/* Job Details Section */}
          <div className="card shadow-sm border-0 mb-4 p-4">
            <h5 className="fw-bold mb-3">📝 Chi tiết công việc</h5>
            <ul className="list-unstyled mb-2">
              <li className="mb-2">
                <strong>Dịch vụ:</strong>
                <ul className="mb-0 ps-4">
                  {job.serviceIDs?.map((id) => (
                    <li key={id}>{serviceDetailsMap[id] ?? `Dịch vụ không rõ (ID: ${id})`}</li>
                  ))}
                </ul>
              </li>

              <li className="mb-2">
                <strong>Lịch làm việc:</strong>
                <ul className="mb-0 ps-4">
                  {job.dayofWeek?.map((day) => (
                    <li key={day}>{dayOfWeekMap[day]}</li>
                  ))}
                </ul>
              </li>

              <li className="mb-2">
                <strong>Slot làm việc:</strong>
                <ul className="mb-0 ps-4">
                  {job.slotIDs?.map((slot) => (
                    <li key={slot}>{slotMap[slot]}</li>
                  ))}
                </ul>
              </li>

              <li className="mb-2">
                <strong>Hình thức làm việc:</strong> {jobTypeMap[job.jobType] || "Không rõ"}
              </li>

              <li>
                <strong>Mô Tả:</strong> {job.description || "Không có"}
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="d-flex gap-3">
            <button
              className="btn btn-warning text-white w-50 fw-semibold"
              onClick={handleApply}
              disabled={applying}
            >
              {applying ? "Đang ứng tuyển..." : "Ứng tuyển ngay"}
            </button>
            <button
              className="btn btn-outline-secondary w-50"
              onClick={() => {
                if (familyAccountID) {
                  window.location.href = `/messages?search=${encodeURIComponent(familyName)}`;
                }
              }}
              disabled={!familyAccountID}
            >
              Nhắn tin cho Gia đình
            </button>
          </div>
        </div>

        {/* Right Column - Sidebar */}
        <div className="col-lg-4">
          <div className="card shadow-sm border-0 p-4 bg-white">
            <h5 className="fw-bold mb-3">📌 Thông tin thêm</h5>
            <p className="mb-1 text-muted">Chưa có dữ liệu đánh giá hoặc liên hệ.</p>
            <hr />
            <p className="small text-muted">Thông tin sẽ được cập nhật khi gia đình hoàn tất hồ sơ.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetailsPage;
