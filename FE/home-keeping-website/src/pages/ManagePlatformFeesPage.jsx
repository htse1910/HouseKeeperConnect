import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Form, Button, Spinner } from "react-bootstrap";

const formatVietnamTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });
};

const ManagePlatformFeesPage = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);
  const [modalPercent, setModalPercent] = useState("");
  const [saving, setSaving] = useState(false);

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

  useEffect(() => {
    fetchFees();
  }, []);

  const handleSave = async () => {
    const percentValue = parseFloat(modalPercent);
    if (isNaN(percentValue)) {
      toast.error("Tỷ lệ không hợp lệ.");
      return;
    }

    setSaving(true);
    try {
      await axios.put(
        `${API_BASE_URL}/PlatformFee/UpdateFee?fID=${selectedFee.feeID}&percent=${percentValue}`,
        null,
        { headers }
      );
      toast.success("Cập nhật thành công!");
      setShowModal(false);
      fetchFees();
    } catch (err) {
      toast.error("Cập nhật thất bại.");
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} />

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
        .btn-warning {
          background-color: #ffc107;
          border: none;
        }
        .btn-warning:hover {
          background-color: #e0a800;
        }
      `}</style>

      <div className="row">
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>

        <div className="col-md-10 py-5">
          <h2 className="fw-bold mb-4 text-primary text-center">Quản Lý Phí Nền Tảng</h2>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <div className="card-custom">
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped align-middle">
                  <thead className="text-center">
                    <tr>
                      <th>ID</th>
                      <th>Loại công việc</th> {/* New Column */}
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
                          {fee.feeID === 1 ? "Ngắn hạn" : fee.feeID === 2 ? "Định kỳ" : "Không rõ"}
                        </td>
                        <td>{(fee.percent * 100).toFixed(1)}%</td>
                        <td>{formatVietnamTime(fee.createdDate)}</td>
                        <td>{formatVietnamTime(fee.updatedDate)}</td>
                        <td>
                          <button
                            className="btn btn-warning btn-sm"
                            onClick={() => {
                              setSelectedFee(fee);
                              setModalPercent((fee.percent * 100).toString());
                              setShowModal(true);
                            }}
                          >
                            <FaEdit className="me-1" /> Sửa
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                  <Modal.Title>Chỉnh sửa phí nền tảng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                  <Form.Group>
                    <Form.Label>Tỷ lệ phần trăm</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="100"
                      step="0.1"
                      value={modalPercent}
                      onChange={(e) => setModalPercent(e.target.value)}
                    />
                  </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={() => setShowModal(false)}>
                    Hủy
                  </Button>
                  <Button variant="success" onClick={handleSave} disabled={saving}>
                    {saving ? <Spinner animation="border" size="sm" className="me-2" /> : ""}
                    Lưu
                  </Button>
                </Modal.Footer>
              </Modal>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManagePlatformFeesPage;
