import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { FaMapMarkerAlt, FaUser, FaClock } from "react-icons/fa";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const slotMap = {
  1: "8H - 9H",
  2: "9H - 10H",
  3: "10H - 11H",
  4: "11H - 12H",
  5: "12H - 13H",
  6: "13H - 14H",
  7: "14H - 15H",
  8: "15H - 16H",
  9: "16H - 17H",
  10: "17H - 18H",
  11: "18H - 19H",
  12: "19H - 20H",
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

function JobDetailsPage() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);
  const [familyName, setFamilyName] = useState("Không rõ");
  const [familyAccountID, setFamilyAccountID] = useState(null);
  const [serviceDetails, setServiceDetails] = useState({});
  const jobTypeMap = {
    1: "Một lần duy nhất",
    2: "Định kỳ",
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

        if (Array.isArray(data.serviceIDs)) {
          Promise.all(
            data.serviceIDs.map((sid) =>
              fetch(`${API_BASE_URL}/Service/GetServiceByID?id=${sid}`, {
                headers: {
                  Authorization: `Bearer ${authToken}`,
                  "Content-Type": "application/json"
                }
              })
                .then((res) => res.ok ? res.json() : Promise.reject(`Failed to fetch service ID ${sid}`))
                .then((service) => ({ id: sid, name: service.serviceName }))
                .catch(() => ({ id: sid, name: `Dịch vụ không rõ (ID: ${sid})` }))
            )
          ).then((services) => {
            const map = {};
            services.forEach(({ id, name }) => {
              map[id] = name;
            });
            setServiceDetails(map);
          });
        }

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
      });
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

      const message = await response.text();

      if (response.ok) {
        toast.success(message || "🎉 Ứng tuyển thành công!");
      } else {
        toast.error(message || "❌ Ứng tuyển thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Error applying for job:", error);
      toast.error("🚫 Có lỗi xảy ra khi ứng tuyển.");
    } finally {
      setApplying(false);
    }
  };

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
        <div className="col-lg-8">
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

          <div className="card shadow-sm border-0 mb-4 p-4">
            <h5 className="fw-bold mb-3">📝 Chi tiết công việc</h5>
            <ul className="list-unstyled mb-2">
              <li className="mb-2">
                <strong>Dịch vụ:</strong>
                <ul className="mb-0 ps-4">
                  {job.serviceIDs?.map((id) => (
                    <li key={id}>{serviceDetails[id] || `Đang tải dịch vụ (ID: ${id})`}</li>
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
