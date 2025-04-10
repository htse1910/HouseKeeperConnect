import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";

const StaffUserVerificationPage = () => {
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [selectedHousekeeper, setSelectedHousekeeper] = useState(null);
  const [note, setNote] = useState("");

  useEffect(() => {
    reloadPendingList();
  }, []);

  const reloadPendingList = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.get("http://localhost:5280/api/HouseKeeper/ListHousekeeperIDPending", {
        params: { pageNumber: 1, pageSize: 100 },
        headers: { Authorization: `Bearer ${token}` }
      });

      setHousekeepers(res.data);
      setEmptyMessage(res.data.length === 0 ? "Không có hồ sơ đang chờ xác minh." : "");
    } catch (err) {
      console.error("Error loading housekeepers:", err);
      setError("Không thể tải danh sách.");
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusName = (status) => {
    switch (status) {
      case 1: return "Pending";
      case 2: return "Verified";
      default: return "Unknown";
    }
  };

  const handleApprove = async (taskId) => {
    const token = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    try {
      await axios.put(`http://localhost:5280/api/VerificationTasks/Approve`, null, {
        params: {
          taskId,
          accountID,
          notes: note
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      toast.success("✅ Hồ sơ đã được duyệt!");
      setSelectedHousekeeper(null);
      reloadPendingList();
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi duyệt hồ sơ.");
    }
  };

  const handleReject = async (taskId) => {
    const token = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    try {
      await axios.put(`http://localhost:5280/api/VerificationTasks/Reject`, null, {
        params: {
          taskId,
          accountID,
          notes: note
        },
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });

      toast.success("✅ Hồ sơ đã bị từ chối.");
      setSelectedHousekeeper(null);
      reloadPendingList();
    } catch (err) {
      console.error(err);
      toast.error("❌ Lỗi khi từ chối hồ sơ.");
    }
  };

  return (
    <div className="container my-4">
      <h3 className="fw-bold mb-4">📋 Danh sách hồ sơ cần xác minh</h3>

      {loading ? (
        <div className="alert alert-info">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : emptyMessage ? (
        <div className="alert alert-warning">{emptyMessage}</div>
      ) : (
        <div className="card shadow-sm">
          <div className="card-body">
            <div className="table-responsive">
              <table className="table table-bordered table-hover align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Tên</th>
                    <th>Nickname</th>
                    <th>Giới tính</th>
                    <th>Trạng thái</th>
                    <th>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {housekeepers.map((hk, index) => (
                    <tr key={index}>
                      <td>{hk.name}</td>
                      <td>{hk.nickname}</td>
                      <td>{hk.gender === 1 ? "Nam" : hk.gender === 2 ? "Nữ" : "Khác"}</td>
                      <td>
                        <span className={`badge bg-${hk.status === 1 ? "warning" : "success"}`}>{getVerificationStatusName(hk.status)}</span>
                      </td>
                      <td>
                        <button
                          className="btn btn-primary btn-sm"
                          onClick={() => setSelectedHousekeeper(hk)}
                        >
                          Xem CCCD
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {selectedHousekeeper && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Xác minh CCCD</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedHousekeeper(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row mb-3">
                  <div className="col-md-4 text-center">
                    <p className="fw-semibold">Mặt trước</p>
                    <img src={selectedHousekeeper.frontPhoto} alt="Front" className="img-fluid rounded" />
                  </div>
                  <div className="col-md-4 text-center">
                    <p className="fw-semibold">Mặt sau</p>
                    <img src={selectedHousekeeper.backPhoto} alt="Back" className="img-fluid rounded" />
                  </div>
                  <div className="col-md-4 text-center">
                    <p className="fw-semibold">Cầm tay</p>
                    <img src={selectedHousekeeper.facePhoto} alt="Face" className="img-fluid rounded" />
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="note" className="form-label fw-semibold">Ghi chú</label>
                  <textarea
                    className="form-control"
                    id="note"
                    rows="3"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú cho xác minh nếu cần..."
                  ></textarea>
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setSelectedHousekeeper(null)}>
                  Đóng
                </button>
                <button className="btn btn-danger" onClick={() => handleReject(selectedHousekeeper.taskID)}>
                  Từ chối
                </button>
                <button className="btn btn-success" onClick={() => handleApprove(selectedHousekeeper.taskID)}>
                  Duyệt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable />
    </div>
  );
};

export default StaffUserVerificationPage;
