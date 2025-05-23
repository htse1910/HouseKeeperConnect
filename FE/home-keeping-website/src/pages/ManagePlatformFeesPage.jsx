import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSave, FaEdit } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";

// Utility: Format to Vietnam Time
const formatVietnamTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });
};

const ManagePlatformFeesPage = () => {
  const [fees, setFees] = useState([]);
  const [editFee, setEditFee] = useState(null);
  const [editPercent, setEditPercent] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchFees = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/PlatformFee/PlatformFeeList?pageNumber=1&pageSize=100`, { headers });
      setFees(res.data || []);
    } catch (err) {
      console.error("Failed to fetch fees:", err);
    } finally {
      setLoading(false);
    }
  };

  const saveUpdate = async () => {
    if (!editFee || !editPercent) return;
    try {
      await axios.put(
        `${API_BASE_URL}/PlatformFee/UpdateFee?fID=${editFee.feeID}&percent=${editPercent}`,
        null,
        { headers }
      );
      setEditFee(null);
      setEditPercent("");
      fetchFees();
    } catch (err) {
      console.error("Failed to update fee:", err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <div className="container-fluid">
      <style>{`
        .card-custom {
          border: 2px solid #0d6efd;
          border-radius: 1rem;
          background: #f0f8ff;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.07);
          padding: 24px;
        }
        .table thead th {
          background-color: #e7f1ff;
          color: #0d6efd;
        }
        .table tbody tr:nth-child(odd) td {
          background-color: #f9fcff;
        }
        .table tbody tr:hover td {
          background-color: #e0f0ff;
          transition: background-color 0.3s ease;
        }
        .btn-outline-primary:hover {
          background-color: #0d6efd;
          color: white;
        }
        .btn-warning {
          background-color: #ffc107;
          border: none;
        }
        .btn-warning:hover {
          background-color: #e0a800;
        }
      `}</style>

      <div className="row">
        {/* Sidebar */}
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>

        {/* Main Content */}
        <div className="col-md-10 py-5">
          <h2 className="fw-bold mb-4 text-primary text-center">Quản Lý Phí Nền Tảng</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <div className="card-custom">
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped align-middle">
                  <thead className="text-center">
                    <tr>
                      <th>ID</th>
                      <th>Tỷ lệ phần trăm</th>
                      <th>Ngày tạo</th>
                      <th>Ngày cập nhật</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {fees.map((fee) => (
                      <tr key={fee.feeID} className="text-center">
                        <td>{fee.feeID}</td>
                        <td>
                          {editFee?.feeID === fee.feeID ? (
                            <input
                              type="number"
                              value={editPercent}
                              onChange={(e) => setEditPercent(e.target.value)}
                              className="form-control mx-auto"
                              style={{ maxWidth: "80px" }}
                            />
                          ) : (
                            `${fee.percent * 100}%`
                          )}
                        </td>
                        <td>{formatVietnamTime(fee.createdDate)}</td>
                        <td>{formatVietnamTime(fee.updatedDate)}</td>
                        <td>
                          {editFee?.feeID === fee.feeID ? (
                            <button className="btn btn-primary btn-sm" onClick={saveUpdate}>
                              <FaSave className="me-1" /> Lưu
                            </button>
                          ) : (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => {
                                setEditFee(fee);
                                setEditPercent(fee.percent);
                              }}
                            >
                              <FaEdit className="me-1" /> Sửa
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePlatformFeesPage;