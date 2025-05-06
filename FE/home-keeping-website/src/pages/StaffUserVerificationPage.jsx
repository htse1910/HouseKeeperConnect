import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { FaEnvelope, FaPhone, FaMapMarkerAlt, FaUniversity, FaUser, FaCheck, FaTimes, FaIdCard } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const StaffUserVerificationPage = () => {
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [emptyMessage, setEmptyMessage] = useState("");
  const [selectedHousekeeper, setSelectedHousekeeper] = useState(null);
  const [note, setNote] = useState("");
  const [realName, setRealName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [dob, setDob] = useState("");

  useEffect(() => {
    reloadPendingList();
  }, []);

  useEffect(() => {
    if (selectedHousekeeper) {
      setRealName(selectedHousekeeper.realName || "");
      setIdNumber(selectedHousekeeper.idNumber || "");
      setDob(selectedHousekeeper.dateOfBirth || "");
    }
  }, [selectedHousekeeper]);

  const reloadPendingList = async () => {
    setLoading(true);
    const token = localStorage.getItem("authToken");

    try {
      const res = await axios.get(`${API_BASE_URL}/HouseKeeper/ListHousekeeperIDPending`, {
        params: { pageNumber: 1, pageSize: 100 },
        headers: { Authorization: `Bearer ${token}` }
      });

      const pendingList = res.data;

      const detailedList = await Promise.all(
        pendingList.map(async (hk) => {
          try {
            const detailRes = await axios.get(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByID`, {
              params: { id: hk.housekeeperID },
              headers: { Authorization: `Bearer ${token}` }
            });
            return { ...hk, ...detailRes.data };
          } catch {
            return hk;
          }
        })
      );

      setHousekeepers(detailedList);
      setEmptyMessage(detailedList.length === 0 ? "Không có hồ sơ đang chờ xác minh." : "");
    } catch (err) {
      console.error("Error loading housekeepers:", err);
      setError("Chưa có hồ sơ cần duyệt");
    } finally {
      setLoading(false);
    }
  };

  const getVerificationStatusName = (status) => {
    switch (status) {
      case 1: return "Chờ duyệt";
      case 2: return "Đã xác minh";
      default: return "Không rõ";
    }
  };

  const handleApprove = async (taskId) => {
    const token = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    try {
      const res = await axios.put(`${API_BASE_URL}/VerificationTasks/Approve`, null, {
        params: {
          taskId,
          accountID,
          IDNumber: idNumber,
          RealName: realName,
          DateOfBirth: dob,
          Notes: note || ""
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(typeof res.data === "string" ? res.data : res.data?.message || "✅ Hồ sơ đã được duyệt!");
      setSelectedHousekeeper(null);
      reloadPendingList();
    } catch (err) {
      console.error(err);
      const msg = typeof err.response?.data === "string"
        ? err.response.data
        : err.response?.data?.message || "❌ Lỗi khi duyệt hồ sơ.";
      toast.error(msg);
    }
  };

  const handleReject = async (taskId) => {
    const token = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    try {
      const res = await axios.put(`${API_BASE_URL}/VerificationTasks/Reject`, null, {
        params: {
          taskId,
          accountID,
          IDNumber: idNumber,
          RealName: "",
          DateOfBirth: "",
          Notes: ""
        },
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success(typeof res.data === "string" ? res.data : res.data?.message || "✅ Hồ sơ đã bị từ chối.");
      setSelectedHousekeeper(null);
      reloadPendingList();
    } catch (err) {
      console.error(err);
      const msg = typeof err.response?.data === "string"
        ? err.response.data
        : err.response?.data?.message || "❌ Lỗi khi từ chối hồ sơ.";
      toast.error(msg);
    }
  };

  return (
    <div className="container my-4">
      <h3 className="fw-bold mb-4 d-flex align-items-center">
        <FaIdCard className="me-2" /> Xác minh hồ sơ người giúp việc
      </h3>

      {loading ? (
        <div className="alert alert-info">Đang tải dữ liệu...</div>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : emptyMessage ? (
        <div className="alert alert-warning">{emptyMessage}</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover table-sm text-nowrap align-middle">
            <thead className="table-light text-center">
              <tr>
                <th>Ảnh</th>
                <th>Thông tin</th>
                <th>Liên hệ</th>
                <th>Ngân hàng / Địa chỉ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {housekeepers.map((hk, index) => (
                <tr key={index}>
                  <td className="text-center">
                    <img
                      src={hk.localProfilePicture || hk.googleProfilePicture}
                      alt="Avatar"
                      className="rounded-circle"
                      style={{ width: "45px", height: "45px", objectFit: "cover" }}
                    />
                  </td>
                  <td>
                    <div className="fw-semibold"><FaUser className="me-1" />{hk.name}</div>
                    <div className="text-muted small">
                      {hk.gender === 1 ? "Nam" : hk.gender === 2 ? "Nữ" : "Không xác nhận dc"}
                    </div>
                  </td>
                  <td>
                    <div className="small"><FaEnvelope className="me-1 text-muted" />{hk.email}</div>
                    <div className="small"><FaPhone className="me-1 text-muted" />{hk.phone}</div>
                  </td>
                  <td>
                    <div className="small"><FaUniversity className="me-1 text-muted" />{hk.bankAccountNumber}</div>
                    <div className="small"><FaMapMarkerAlt className="me-1 text-muted" />{hk.address}</div>
                  </td>
                  <td className="text-center">
                    <span className={`badge bg-${hk.status === 1 ? "warning text-dark" : "success"}`}>
                      {getVerificationStatusName(hk.status)}
                    </span>
                  </td>
                  <td className="text-center">
                    <button
                      className="btn btn-sm btn-outline-primary"
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
      )}

      {selectedHousekeeper && (
        <div className="modal show fade d-block" tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content border-0 shadow-sm">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Xác minh CCCD - {selectedHousekeeper.name}</h5>
                <button type="button" className="btn-close" onClick={() => setSelectedHousekeeper(null)}></button>
              </div>
              <div className="modal-body">
                <div className="row text-center mb-3">
                  <div className="col">
                    <p className="fw-semibold">Mặt trước</p>
                    <img src={selectedHousekeeper.frontPhoto} alt="Front" className="img-fluid rounded border" />
                  </div>
                  <div className="col">
                    <p className="fw-semibold">Mặt sau</p>
                    <img src={selectedHousekeeper.backPhoto} alt="Back" className="img-fluid rounded border" />
                  </div>
                  <div className="col">
                    <p className="fw-semibold">Cầm tay</p>
                    <img src={selectedHousekeeper.facePhoto} alt="Face" className="img-fluid rounded border" />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="realName" className="form-label fw-semibold">Họ tên</label>
                  <input
                    type="text"
                    className="form-control"
                    id="realName"
                    value={realName}
                    onChange={(e) => setRealName(e.target.value)}
                    placeholder="Nhập họ tên..."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="idNumber" className="form-label fw-semibold">Số CCCD</label>
                  <input
                    type="number"
                    className="form-control"
                    id="idNumber"
                    value={idNumber}
                    onChange={(e) => setIdNumber(e.target.value)}
                    placeholder="Nhập số CCCD..."
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="dob" className="form-label fw-semibold">Ngày sinh</label>
                  <input
                    type="date"
                    className="form-control"
                    id="dob"
                    value={dob}
                    onChange={(e) => setDob(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="note" className="form-label fw-semibold">Ghi chú</label>
                  <textarea
                    className="form-control"
                    id="note"
                    rows="2"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Ghi chú thêm cho xác minh..."
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button className="btn btn-outline-secondary" onClick={() => setSelectedHousekeeper(null)}>
                  Đóng
                </button>
                <button className="btn btn-outline-danger" onClick={() => handleReject(selectedHousekeeper.taskID)}>
                  <FaTimes className="me-1" /> Từ chối
                </button>
                <button className="btn btn-success" onClick={() => handleApprove(selectedHousekeeper.taskID)}>
                  <FaCheck className="me-1" /> Duyệt
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ToastContainer position="top-right" autoClose={3000} hideProgressBar closeOnClick pauseOnHover />
    </div>
  );
};

export default StaffUserVerificationPage;
