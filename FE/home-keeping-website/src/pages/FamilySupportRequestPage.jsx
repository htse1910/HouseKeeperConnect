import React, { useEffect, useState } from "react";
import API_BASE_URL from "../config/apiConfig";
import { useNavigate } from "react-router-dom";
import { Badge, Spinner, Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SUPPORT_TYPES = {
  1: "Tài khoản",
  2: "Công việc",
  3: "Xác minh CMND",
  4: "Giao dịch",
};

const SUPPORT_STATUS = {
  1: { label: "Đang xử lý", variant: "warning" },
  2: { label: "Đã xử lý", variant: "success" },
};

const FamilySupportRequestPage = () => {
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate();

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [staffMap, setStaffMap] = useState({});

  const [showModal, setShowModal] = useState(false);
  const [supportContent, setSupportContent] = useState("");
  const [supportImage, setSupportImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [supportType, setSupportType] = useState(1);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await fetch(
          `${API_BASE_URL}/SupportRequest/GetSupportRequestByAccount?id=${accountID}&pageNumber=1&pageSize=100`,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
            },
          }
        );
        const data = await response.json();
        setRequests(data);

        const uniqueStaffIDs = [...new Set(data.map(req => req.reviewedBy).filter(Boolean))];

        const staffMapTemp = {};
        await Promise.all(
          uniqueStaffIDs.map(async (staffID) => {
            try {
              const res = await fetch(`${API_BASE_URL}/Account/GetAccount?id=${staffID}`, {
                headers: { Authorization: `Bearer ${authToken}` }
              });
              const staffData = await res.json();
              staffMapTemp[staffID] = staffData.name;
            } catch (err) {
              console.warn(`Failed to fetch staff name for ID ${staffID}`, err);
              staffMapTemp[staffID] = "Không rõ";
            }
          })
        );

        setStaffMap(staffMapTemp);
      } catch (err) {
        console.error("Failed to fetch support requests:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [accountID, authToken]);

  const submitSupportRequest = async () => {
    setSending(true);
    const formData = new FormData();
    if (supportImage) {
      formData.append("Picture", supportImage);
    }

    const query = new URLSearchParams({
      RequestedBy: accountID,
      Type: supportType,
      Content: supportContent,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/SupportRequest/AddSupportRequest?${query}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: formData,
      });

      if (response.ok) {
        toast.success("Gửi yêu cầu hỗ trợ thành công!");
        setShowModal(false);
        setSupportContent("");
        setSupportImage(null);
        setSupportType(1);
      } else {
        toast.error("Gửi thất bại. Vui lòng thử lại.");
      }
    } catch (err) {
      console.error("Support request failed", err);
      toast.error("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>Yêu cầu hỗ trợ kỹ thuật của bạn</h3>
        <Button variant="outline-primary" onClick={() => setShowModal(true)}>
          Gửi yêu cầu hỗ trợ mới
        </Button>
      </div>

      {loading ? (
        <Spinner animation="border" />
      ) : requests.length === 0 ? (
        <p>Bạn chưa gửi yêu cầu hỗ trợ nào.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Loại hỗ trợ</th>
                <th>Nội dung</th>
                <th>Hình ảnh</th>
                <th>Trạng thái</th>
                <th>Ngày gửi</th>
                <th>Câu trả lời từ nhân viên</th>
                <th>Nhân viên phản hồi</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req, idx) => (
                <tr key={req.requestID}>
                  <td>{idx + 1}</td>
                  <td>{SUPPORT_TYPES[req.type] || "Khác"}</td>
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
                  <td>
                    <Badge bg={SUPPORT_STATUS[req.status]?.variant || "secondary"}>
                      {SUPPORT_STATUS[req.status]?.label || "Không rõ"}
                    </Badge>
                  </td>
                  <td>{new Date(req.createdDate).toLocaleString("vi-VN")}</td>
                  <td>{req.reviewNote || "Chưa có"}</td>
                  <td>{staffMap[req.reviewedBy] || "Chưa có"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Button className="mt-3" variant="secondary" onClick={() => navigate("/family/dashboard")}>
        ← Quay lại bảng điều khiển
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu hỗ trợ kỹ thuật</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Loại hỗ trợ</Form.Label>
            <Form.Select
              value={supportType}
              onChange={(e) => setSupportType(Number(e.target.value))}
            >
              <option value={1}>Tài khoản</option>
              <option value={2}>Công việc</option>
              <option value={3}>Xác minh CMND</option>
              <option value={4}>Giao dịch</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Nội dung</Form.Label>
            <Form.Control
              as="textarea"
              rows={4}
              value={supportContent}
              onChange={(e) => setSupportContent(e.target.value)}
              placeholder="Mô tả vấn đề bạn đang gặp phải..."
            />
          </Form.Group>

          <Form.Group>
            <Form.Label>Hình ảnh (nếu có)</Form.Label>
            <Form.Control
              type="file"
              accept="image/*"
              onChange={(e) => setSupportImage(e.target.files[0])}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
          <Button
            variant="primary"
            onClick={submitSupportRequest}
            disabled={sending || !supportContent}
          >
            {sending ? "Đang gửi..." : "Gửi yêu cầu"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FamilySupportRequestPage;