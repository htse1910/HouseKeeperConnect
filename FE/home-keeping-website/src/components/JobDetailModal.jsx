import React, { useEffect, useState } from "react";
import { serviceMap } from "../utils/serviceMap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const slotMap = {
  1: "8H - 9H",
  2: "10H - 11H",
  3: "12H - 13H",
  4: "14H - 15H",
  5: "16H - 17H",
  6: "18H - 19H",
  7: "20H - 21H",
};

const jobTypeMap = {
  1: "Full-time",
  2: "Part-time",
};

const JobDetailModal = ({ jobID, applicationStatus, onClose }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const authToken = localStorage.getItem("authToken");
  const [accountID] = useState(localStorage.getItem("accountID"));

  useEffect(() => {
    const fetchJobDetail = async () => {
      try {
        const res = await fetch(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
        const data = await res.json();
        setJob(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy chi tiết công việc:", err);
        toast.error("Không thể tải dữ liệu công việc.");
      } finally {
        setLoading(false);
      }
    };

    if (jobID) {
      fetchJobDetail();
    }
  }, [jobID]);

  const handleAcceptJob = async () => {
    try {
      const res = await fetch(
        `http://localhost:5280/api/Job/AcceptJob?jobId=${jobID}&accountID=${accountID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const message = await res.text();

      if (res.ok) {
        toast.success(message || "Chấp nhận công việc thành công");
        onClose(); // close after toast success
      } else {
        toast.error(message || "Chấp nhận công việc thất bại");
      }
    } catch (err) {
      console.error("❌ Error accepting job:", err);
      toast.error("Có lỗi khi chấp nhận công việc.");
    }
  };

  return (
    <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: "rgba(0,0,0,0.4)" }}>
      <style>{`
        .modal-dialog {
          max-width: 700px;
        }
        .info-row {
          display: flex;
          padding: 8px 0;
          border-bottom: 1px solid #f1f1f1;
        }
        .info-label {
          flex: 0 0 160px;
          font-weight: 500;
          color: #6c757d;
        }
        .info-value {
          flex: 1;
          font-weight: 600;
        }
        .section-title {
          font-weight: 600;
          font-size: 14px;
          color: #999;
          margin: 16px 0 8px;
          border-bottom: 1px solid #eee;
          padding-bottom: 4px;
        }
      `}</style>

      <div className="modal-dialog modal-dialog-scrollable" role="document">
        <div className="modal-content border-0 rounded-4 shadow-sm p-4">
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="fw-bold text-warning mb-0">Chi tiết công việc</h5>
            <button type="button" className="btn-close" onClick={onClose} aria-label="Đóng"></button>
          </div>

          <div className="modal-body px-1">
            {loading ? (
              <p className="text-muted">Đang tải...</p>
            ) : job ? (
              <>
                <div className="info-row"><div className="info-label">Tên công việc:</div><div className="info-value">{job.jobName}</div></div>
                <div className="info-row"><div className="info-label">Địa điểm:</div><div className="info-value">{job.location}</div></div>
                <div className="info-row"><div className="info-label">Mô tả:</div><div className="info-value">{job.description || "Không có"}</div></div>
                <div className="info-row"><div className="info-label">Thời gian:</div><div className="info-value">{new Date(job.startDate).toLocaleDateString()} → {new Date(job.endDate).toLocaleDateString()}</div></div>
                <div className="info-row"><div className="info-label">Mức lương:</div><div className="info-value">{job.price?.toLocaleString()} VND</div></div>
                <div className="info-row"><div className="info-label">Loại công việc:</div><div className="info-value">{jobTypeMap[job.jobType] || "Không rõ"}</div></div>

                {job.serviceIDs?.length > 0 && (
                  <>
                    <div className="section-title">Dịch vụ bao gồm</div>
                    {job.serviceIDs.map((id, i) => (
                      <div className="info-row" key={i}>
                        <div className="info-label">•</div>
                        <div className="info-value">{serviceMap[id] || `#${id}`}</div>
                      </div>
                    ))}
                  </>
                )}

                {job.dayofWeek?.length > 0 && (
                  <>
                    <div className="section-title">Lịch làm việc</div>
                    {job.dayofWeek.map((d, i) => (
                      <div className="info-row" key={i}>
                        <div className="info-label">•</div>
                        <div className="info-value">
                          {["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][d]}
                        </div>
                      </div>
                    ))}
                  </>
                )}

                {job.slotIDs?.length > 0 && (
                  <>
                    <div className="section-title">Ca làm việc</div>
                    {job.slotIDs.map((s, i) => (
                      <div className="info-row" key={i}>
                        <div className="info-label">•</div>
                        <div className="info-value">{slotMap[s] || `Slot ${s}`}</div>
                      </div>
                    ))}
                  </>
                )}

                {applicationStatus === 2 && (
                  <div className="text-end mt-4">
                    <button className="btn btn-warning fw-semibold rounded-2" onClick={handleAcceptJob}>
                      Chấp nhận công việc
                    </button>
                  </div>
                )}
              </>
            ) : (
              <p className="text-danger">Không thể tải thông tin công việc.</p>
            )}
          </div>

          <div className="modal-footer mt-2 border-0">
            <button className="btn btn-outline-secondary btn-sm" onClick={onClose}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;
