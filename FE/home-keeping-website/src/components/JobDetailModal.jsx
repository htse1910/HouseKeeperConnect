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
  const housekeeperID = localStorage.getItem("housekeeperID");

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
        `http://localhost:5280/api/Job/AcceptJob?jobId=${jobID}&accountID=${housekeeperID}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      const message = await res.text();

      if (res.status === 200) {
        toast.success(message); // Show success message
      } else {
        toast.error(message); // Show error message if any
      }

      onClose(); // Close modal after accepting job
    } catch (err) {
      console.error("❌ Error accepting job:", err);
      toast.error("Có lỗi khi chấp nhận công việc.");
    }
  };

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
                <p><strong>Mức lương:</strong> {job.price?.toLocaleString()} VND</p>
                <p><strong>Loại công việc:</strong> {jobTypeMap[job.jobType] || "Không rõ"}</p>

                <p><strong>Dịch vụ:</strong></p>
                <ul className="ps-4">
                  {job.serviceIDs?.map(id => (
                    <li key={id}>{serviceMap[id] || `#${id}`}</li>
                  ))}
                </ul>

                <p><strong>Lịch làm việc:</strong></p>
                <ul className="ps-4">
                  {job.dayofWeek?.map(d => (
                    <li key={d}>{["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"][d]}</li>
                  ))}
                </ul>

                <p><strong>Slot làm việc:</strong></p>
                <ul className="ps-4">
                  {job.slotIDs?.map(s => (
                    <li key={s}>{slotMap[s] || `Slot ${s}`}</li>
                  ))}
                </ul>

                {applicationStatus === 2 && (
                  <div className="mt-4">
                    <button
                      className="btn btn-warning"
                      onClick={handleAcceptJob}
                    >
                      Chấp nhận công việc
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
      <ToastContainer />
    </div>
  );
};

export default JobDetailModal;
