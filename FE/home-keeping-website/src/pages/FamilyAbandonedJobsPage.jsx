import React, { useEffect, useState } from "react";
import { Spinner, Card, Modal, Button } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { useTranslation } from "react-i18next";
import { FaUserCircle } from "react-icons/fa";
import { useSearchParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const slotMap = {
  1: "8H - 9H", 2: "9H - 10H", 3: "10H - 11H", 4: "11H - 12H",
  5: "12H - 13H", 6: "13H - 14H", 7: "14H - 15H", 8: "15H - 16H",
  9: "16H - 17H", 10: "17H - 18H", 11: "18H - 19H", 12: "19H - 20H",
};

const dayOfWeekMap = {
  0: "Chủ Nhật", 1: "Thứ Hai", 2: "Thứ Ba", 3: "Thứ Tư",
  4: "Thứ Năm", 5: "Thứ Sáu", 6: "Thứ Bảy",
};

function FamilyAbandonedJobsPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const jobID = searchParams.get("jobID");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${authToken}` };

  const [selectedJob, setSelectedJob] = useState(null);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [suggestedHousekeepers, setSuggestedHousekeepers] = useState([]);
  const [showHKModal, setShowHKModal] = useState(false);
  const [activeHousekeeper, setActiveHousekeeper] = useState(null);

  const handleInvite = async (housekeeperID) => {
    try {
      await axios.put(
        `${API_BASE_URL}/Job/OfferJob?jobId=${jobID}&housekeeperId=${housekeeperID}`,
        {},
        { headers }
      );
      toast.success("✅ Đã gửi lời mời thành công!");
    } catch (err) {
      console.error("Invite failed", err);
      toast.error("❌ Gửi lời mời thất bại.");
    }
  };

  const handleViewDetails = async (housekeeperID) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByID?id=${housekeeperID}`, { headers });
      setActiveHousekeeper(res.data);
      setShowHKModal(true);
    } catch (err) {
      console.error("Failed to load housekeeper details", err);
      toast.error("Không thể tải thông tin người giúp việc.");
    }
  };

  useEffect(() => {
    const fetchEverything = async () => {
      if (!jobID) return;
      try {
        const jobRes = await axios.get(`${API_BASE_URL}/Job/GetJobDetailByID?id=${jobID}`, { headers });
        setSelectedJob(jobRes.data);

        const serviceNames = await Promise.all(
          (jobRes.data.serviceIDs || []).map(id =>
            axios.get(`${API_BASE_URL}/Service/GetServiceByID?id=${id}`, { headers }).then(r => r.data.serviceName)
          )
        );
        setServices(serviceNames);

        const hkRes = await axios.get(
          `${API_BASE_URL}/Job/SuggestAvailableHousekeepers?jobId=${jobID}`,
          { headers }
        );
        setSuggestedHousekeepers(hkRes.data || []);
      } catch (err) {
        console.error("Error loading job or housekeepers", err);
      } finally {
        setLoading(false);
      }
    };

    fetchEverything();
  }, [jobID]);

  if (loading) return <div className="text-center py-5"><Spinner animation="border" /></div>;

  return (
    <div className="container py-4">
      <ToastContainer position="top-right" autoClose={3000} />
      <h3 className="mb-3">Người giúp việc mới</h3>

      {selectedJob && (
        <>
          <Card className="mb-4">
            <Card.Body>
              <Card.Title>{selectedJob.jobName}</Card.Title>
              <Card.Text><strong>Địa điểm:</strong> {selectedJob.location}</Card.Text>
              <Card.Text><strong>Giá:</strong> {selectedJob.price.toLocaleString()}đ</Card.Text>
              <Card.Text><strong>Mô tả:</strong> {selectedJob.description}</Card.Text>
              <Card.Text><strong>Dịch vụ:</strong> {services.join(", ")}</Card.Text>
              <Card.Text><strong>Ca làm:</strong> {(selectedJob.slotIDs || []).map(s => slotMap[s]).join(", ")}</Card.Text>
              <Card.Text><strong>Ngày làm:</strong> {(selectedJob.dayofWeek || []).map(d => dayOfWeekMap[d]).join(", ")}</Card.Text>
            </Card.Body>
          </Card>

          <h5>Gợi ý người giúp việc</h5>
          {suggestedHousekeepers.length === 0 ? (
            <p>Không tìm thấy người phù hợp.</p>
          ) : (
            suggestedHousekeepers.map(hk => {
              const avatar = hk.googleProfilePicture || hk.localProfilePicture;
              return (
                <Card key={hk.housekeeperID} className="mb-3">
                  <Card.Body className="d-flex align-items-center gap-3">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt="avatar"
                        width={80}
                        height={80}
                        style={{ borderRadius: "50%", objectFit: "cover" }}
                      />
                    ) : (
                      <FaUserCircle size={80} color="#ccc" />
                    )}

                    <div className="flex-grow-1">
                      <h6>{hk.nickname || "Chưa đặt tên"}</h6>
                      <p className="mb-1"><strong>Email:</strong> {hk.email}</p>
                      <p className="mb-1"><strong>Địa chỉ:</strong> {hk.address}</p>
                      <p className="mb-1"><strong>SĐT:</strong> {hk.phone}</p>
                      <p className="mb-1"><strong>Giới tính:</strong> {hk.gender === 1 ? "Nam" : "Nữ"}</p>
                      <p className="mb-1"><strong>Hình thức làm việc:</strong> {hk.workType === 1 ? "Full-time" : "Part-time"}</p>
                      <p className="mb-1"><strong>Đánh giá:</strong> {hk.rating}</p>
                    </div>

                    <div className="d-flex flex-column gap-2">
                      <button className="btn btn-outline-success btn-sm" onClick={() => handleInvite(hk.housekeeperID)}>
                        Mời làm việc
                      </button>
                      <button className="btn btn-outline-primary btn-sm" onClick={() => handleViewDetails(hk.housekeeperID)}>
                        Xem chi tiết
                      </button>
                    </div>
                  </Card.Body>
                </Card>
              );
            })
          )}
        </>
      )}

      <Modal show={showHKModal} onHide={() => setShowHKModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết người giúp việc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {activeHousekeeper ? (
            <>
              <div className="d-flex align-items-center gap-3 mb-3">
                <img
                  src={
                    activeHousekeeper.googleProfilePicture ||
                    activeHousekeeper.localProfilePicture ||
                    "https://via.placeholder.com/80"
                  }
                  alt="avatar"
                  width={80}
                  height={80}
                  style={{ borderRadius: "50%", objectFit: "cover" }}
                />
                <div>
                  <h5>{activeHousekeeper.name}</h5>
                  <p className="mb-1"><strong>Email:</strong> {activeHousekeeper.email}</p>
                  <p className="mb-1"><strong>SĐT:</strong> {activeHousekeeper.phone}</p>
                  <p className="mb-1"><strong>Địa chỉ:</strong> {activeHousekeeper.address}</p>
                </div>
              </div>
              <p><strong>Giới thiệu:</strong> {activeHousekeeper.introduction || "Không có"}</p>
              <p><strong>Số tài khoản:</strong> {activeHousekeeper.bankAccountNumber}</p>
              <p><strong>Ngân hàng:</strong> {activeHousekeeper.bankAccountName}</p>
            </>
          ) : (
            <p>Đang tải...</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowHKModal(false)}>Đóng</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default FamilyAbandonedJobsPage;
