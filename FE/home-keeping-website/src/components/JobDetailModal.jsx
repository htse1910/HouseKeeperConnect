import React, { useEffect, useState } from "react";
import { serviceMap } from "../utils/serviceMap";

const JobDetailModal = ({ jobID, applicationStatus, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);
  const authToken = localStorage.getItem("authToken");
  const housekeeperID = localStorage.getItem("housekeeperID");

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          }
        });
        const data = await res.json();
        setJob(data);
        console.log("✅ Job loaded:", data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết công việc:", err);
      } finally {
        setLoading(false);
      }
    };

    if (jobID) {
      console.log("🔍 Fetching jobID:", jobID);
      fetchJobDetail();
    }
  }, [jobID]);

  const handleBooking = async () => {
    if (!housekeeperID || !jobID) {
      alert("Thiếu thông tin người giúp việc hoặc công việc.");
      return;
    }

    setIsBooking(true);
    try {
      const res = await fetch(
        `http://localhost:5280/api/Booking/AddBooking?JobID=${jobID}&HousekeeperID=${housekeeperID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const message = await res.text();
      alert(message);
      onClose();
    } catch (err) {
      alert("Có lỗi xảy ra khi đặt công việc.");
      console.error("❌ Booking error:", err);
    } finally {
      setIsBooking(false);
    }
  };

  if (!jobID) return null;

  const isEligibleToBook = applicationStatus === 2 && job?.status === 3;
  console.log("📦 applicationStatus:", applicationStatus);
  console.log("📦 job.status:", job?.status);
  console.log("📦 isEligibleToBook:", isEligibleToBook);

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content p-4">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Chi tiết công việc</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {loading ? (
              <p>Đang tải...</p>
            ) : job ? (
              <>
                <h5>{job.jobName}</h5>
                <p><strong>Địa điểm:</strong> {job.location}</p>
                <p><strong>Mô tả:</strong> {job.description || "Không có"}</p>
                <p><strong>Thời gian:</strong> {new Date(job.startDate).toLocaleDateString()} → {new Date(job.endDate).toLocaleDateString()}</p>
                <p><strong>Giá:</strong> {job.price.toLocaleString()} VND</p>
                <p><strong>Dịch vụ:</strong> {job.serviceIDs.map(id => serviceMap[id] || `#${id}`).join(", ")}</p>
                <p><strong>Lịch làm việc:</strong> {job.dayofWeek?.map(d => ["CN", "T2", "T3", "T4", "T5", "T6", "T7"][d]).join(", ")}</p>

                {isEligibleToBook && (
                  <div className="mt-4">
                    <button
                      className="btn btn-warning"
                      onClick={handleBooking}
                      disabled={isBooking}
                    >
                      {isBooking ? "Đang đặt..." : "Đặt công việc này"}
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p>Không thể tải thông tin công việc.</p>
            )}
          </div>

          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Đóng</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
