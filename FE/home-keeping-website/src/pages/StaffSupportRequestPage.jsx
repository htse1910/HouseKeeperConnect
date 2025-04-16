import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig";
import { Button, Modal, Form, Spinner, Badge } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUPPORT_TYPES = {
  1: "Tài khoản",
  2: "Công việc",
  3: "Xác minh CMND",
  4: "Giao dịch",
};

const StaffSupportRequestPage = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/SupportRequest/GetSupportRequestPending?pageNumber=1&pageSize=100`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      toast.error("Lỗi khi tải danh sách yêu cầu.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const openModal = (request) => {
    setSelectedRequest(request);
    setReviewNote("");
    setModalShow(true);
  };

  const handleVerify = async () => {
    if (!reviewNote.trim()) {
      toast.warn("Vui lòng nhập nội dung xác nhận.");
      return;
    }

    setSubmitting(true);

    const params = new URLSearchParams({
      RequestID: selectedRequest.requestID,
      AccountID: accountID,
      Content: reviewNote,
    });

    try {
      const res = await fetch(`${API_BASE_URL}/SupportRequest/VerifySupportRequest?${params}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });

      if (res.ok) {
        toast.success("Yêu cầu đã được xác nhận.");
        setModalShow(false);
        fetchRequests(); // Refresh list
      } else {
        toast.error("Xác nhận thất bại.");
      }
    } catch (err) {
      toast.error("Lỗi máy chủ.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container py-4">
      <h3 className="mb-4">Yêu cầu hỗ trợ đang chờ xử lý</h3>
      {loading ? (
        <Spinner animation="border" />
      ) : requests.length === 0 ? (
        <p className="text-muted">Không có yêu cầu đang chờ.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered align-middle">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Người gửi</th>
                <th>Loại</th>
                <th>Nội dung</th>
                <th>Hình ảnh</th>
                <th>Thời gian</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, i) => (
                <tr key={req.requestID}>
                  <td>{i + 1}</td>
                  <td>{req.requestedBy}</td>
                  <td><Badge bg="info">{SUPPORT_TYPES[req.type]}</Badge></td>
                  <td>{req.content}</td>
                  <td>
                    {req.picture ? (
                      <a href={req.picture} target="_blank" rel="noreferrer">
                        Xem ảnh
                      </a>
                    ) : (
                      "Không có"
                    )}
                  </td>
                  <td>{new Date(req.createdDate).toLocaleString("vi-VN")}</td>
                  <td>
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => openModal(req)}
                    >
                      Xác nhận
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Review Modal */}
      <Modal show={modalShow} onHide={() => setModalShow(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận yêu cầu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Ghi chú xác nhận</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={reviewNote}
              onChange={(e) => setReviewNote(e.target.value)}
              placeholder="Nhập nội dung xác nhận hỗ trợ..."
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setModalShow(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleVerify}
            disabled={submitting}
          >
            {submitting ? "Đang xác nhận..." : "Xác nhận"}
          </Button>
        </Modal.Footer>
      </Modal>

      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
};

export default StaffSupportRequestPage;
