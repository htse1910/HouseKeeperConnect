import React, { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaClock, FaRocket, FaLifeRing } from "react-icons/fa";
import { Link } from "react-router-dom";
import { Modal, Button, Form } from "react-bootstrap";
import "../assets/styles/HousekeeperWelcomeCard.css";
import API_BASE_URL from "../config/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

const HousekeeperWelcomeCard = () => {
  const [fullName, setFullName] = useState("...");
  const [jobsPending, setJobsPending] = useState(0);
  const [jobsAccepted, setJobsAccepted] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [supportContent, setSupportContent] = useState("");
  const [supportImage, setSupportImage] = useState(null);
  const [sending, setSending] = useState(false);
  const [supportType, setSupportType] = useState(1);
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const navigate = useNavigate(); // inside your component
  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(data => setFullName(data.name || "Người dùng"))
      .catch(console.error);

    fetch(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then(res => res.json())
      .then(async data => {
        localStorage.setItem("housekeeperID", data.housekeeperID);
        localStorage.setItem("verifyID", data.verifyID);

        const resApp = await fetch(
          `${API_BASE_URL}/Application/GetApplicationsByAccountID?uid=${data.housekeeperID}&pageNumber=1&pageSize=1000`,
          { headers: { Authorization: `Bearer ${authToken}` } }
        );

        const apps = await resApp.json();
        setJobsPending(apps.filter(app => app.status === 1).length);
        setJobsAccepted(apps.filter(app => app.status === 2).length);
      })
      .catch(console.error);
  }, [accountID, authToken]);

  const submitSupportRequest = async () => {
    setSending(true);

    // Build the multipart/form-data only for the image
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
    <>
      <ToastContainer position="bottom-right" autoClose={3000} />

      <div className="card shadow-sm border-0 p-4">
        {/* Welcome Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <div>
            <h4 className="fw-bold mb-1">👋 Chào mừng trở lại, {fullName}!</h4>
            <p className="text-muted mb-0">Hãy khám phá các cơ hội công việc dành cho bạn.</p>
          </div>
          <Link to="/my-jobs" className="btn btn-outline-secondary rounded-pill">
            Quản lý đơn ứng tuyển của tôi
          </Link>
        </div>

        {/* Stats */}
        <div className="row g-3 mt-2">
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm h-100">
              <div className="text-muted small mb-1">Đang chờ duyệt</div>
              <div className="d-flex align-items-center">
                <span className="fs-4 fw-bold">{jobsPending}</span>
                <FaClock className="ms-auto text-info fs-5" />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm h-100">
              <div className="text-muted small mb-1">Đã nhận việc</div>
              <div className="d-flex align-items-center">
                <span className="fs-4 fw-bold">{jobsAccepted}</span>
                <FaCheckCircle className="ms-auto text-success fs-5" />
              </div>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-3 border rounded shadow-sm h-100 d-flex justify-content-between align-items-center">
              <div>
                <div className="text-muted small mb-1">Công việc chờ bạn</div>
                <span className="fs-5 fw-bold">2M+</span>
              </div>
              <Link to="/jobs" className="btn btn-warning text-white fw-semibold rounded-pill px-3">
                <FaRocket className="me-1" />
                Tìm việc
              </Link>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="outline-primary" className="rounded-pill" onClick={() => setShowModal(true)}>
            <FaLifeRing className="me-1" />
            Hỗ trợ kỹ thuật
          </Button>
          <Link to="/housekeeper/bookings" className="btn btn-primary rounded-pill px-4 fw-semibold">
            Quản lý công việc
          </Link>
        </div>
      </div>

      {/* Support Modal */}
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
            variant="outline-info"
            onClick={() => {
              setShowModal(false);
              navigate("/housekeeper/support-requests");
            }}
          >
            Xem các yêu cầu đã gửi
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
    </>
  );
};

export default HousekeeperWelcomeCard;
