import React, { useEffect, useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { FaMapMarkerAlt, FaCalendarAlt, FaClock, FaUser, FaInfoCircle, FaTools } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig";

const slotMap = {
  1: "8H - 9H", 2: "9H - 10H", 3: "10H - 11H", 4: "11H - 12H",
  5: "12H - 13H", 6: "13H - 14H", 7: "14H - 15H", 8: "15H - 16H",
  9: "16H - 17H", 10: "17H - 18H", 11: "18H - 19H", 12: "19H - 20H"
};

const weekdayMap = ["CN", "T2", "T3", "T4", "T5", "T6", "T7"];
const jobTypeMap = { 1: "Một lần duy nhất", 2: "Định kỳ" };
const statusColorMap = {
  1: "secondary", 2: "info", 3: "success", 4: "dark", 5: "warning", 6: "danger"
};
const jobStatusMap = {
  1: "Chờ", 2: "Xác nhận", 3: "Chấp nhận", 4: "Hoàn thành", 5: "Hết hạn", 6: "Hủy"
};

export default function JobOfferedDetailModal({
  jobID,
  familyID,
  onClose,
  onAccept,
  onDeny
}) {
  const [job, setJob] = useState(null);
  const [familyAcc, setFamilyAcc] = useState(null);
  const [serviceNames, setServiceNames] = useState({});
  const [loading, setLoading] = useState(false);

  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobRes = await fetch(`${API_BASE_URL}/Job/GetJobDetailByID?id=${jobID}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const jobData = await jobRes.json();
        setJob(jobData);

        if (Array.isArray(jobData.serviceIDs)) {
          const services = await Promise.all(
            jobData.serviceIDs.map(id =>
              fetch(`${API_BASE_URL}/Service/GetServiceByID?id=${id}`, {
                headers: { Authorization: `Bearer ${authToken}` }
              })
                .then(res => res.ok ? res.json() : Promise.reject(res.status))
                .then(data => ({ id, name: data.serviceName }))
                .catch(() => ({ id, name: `Dịch vụ không rõ (ID: ${id})` }))
            )
          );
          const nameMap = {};
          services.forEach(({ id, name }) => { nameMap[id] = name });
          setServiceNames(nameMap);
        }

        const famRes = await fetch(`${API_BASE_URL}/Families/GetFamilyByID?id=${familyID}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const famData = await famRes.json();

        const accRes = await fetch(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${famData.accountID}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const accData = await accRes.json();
        setFamilyAcc(accData);
      } catch (err) {
        console.error("Lỗi khi tải chi tiết:", err);
      }
    };

    fetchData();
  }, [jobID, familyID, authToken]);

  return (
    <Modal show onHide={onClose} size="md" centered>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6">Chi tiết công việc & gia đình</Modal.Title>
      </Modal.Header>
      <Modal.Body className="small">
        {job && (
          <div className="mb-3">
            <div className="fw-bold text-warning d-flex justify-content-between align-items-center">
              🧹 {job.jobName}
              <span>
                <Badge bg={statusColorMap[job.status]} className="me-1">{jobStatusMap[job.status]}</Badge>
                <Badge bg="secondary">{jobTypeMap[job.jobType]}</Badge>
              </span>
            </div>
            <div className="mt-2">
              <div><FaMapMarkerAlt className="me-2" />{job.location}</div>
              <div><FaCalendarAlt className="me-2" />{new Date(job.startDate).toLocaleDateString()} → {new Date(job.endDate).toLocaleDateString()}</div>
              <div><FaClock className="me-2" />{job.dayofWeek.map((d, i) => (
                <span key={i} className="me-2">
                  {weekdayMap[d]}
                </span>
              ))}</div>
              <div className="mt-1"><strong>💰</strong> {job.price.toLocaleString()} VND</div>
              {job.description && <div className="mt-2"><FaInfoCircle className="me-2" />{job.description}</div>}
              {job.slotIDs?.length > 0 && (
                <div className="mt-2"><FaClock className="me-2" />
                  <strong>Ca làm việc:</strong> {job.slotIDs.map(id => slotMap[id]).join(", ")}
                </div>
              )}
              {job.serviceIDs?.length > 0 && (
                <div className="mt-2"><FaTools className="me-2" />
                  <strong>Dịch vụ:</strong> {job.serviceIDs.map(id => serviceNames[id] || `Đang tải (ID: ${id})`).join(", ")}
                </div>
              )}
            </div>
          </div>
        )}

        {familyAcc && (
          <div className="border-top pt-2 mt-2">
            <div className="fw-bold text-info mb-2">👨‍👩‍👧 {familyAcc.name}</div>
            <div className="d-flex gap-3">
              <img
                src={familyAcc.localProfilePicture}
                alt="Ảnh đại diện"
                className="rounded-3 shadow-sm"
                style={{ width: 70, height: 70, objectFit: "cover" }}
              />
              <div>
                <div><FaUser className="me-2" />{familyAcc.nickname}</div>
                <div>📧 {familyAcc.email}</div>
                <div>📞 {familyAcc.phone}</div>
                <div>🏠 {familyAcc.address}</div>
                {familyAcc.introduction && <div className="fst-italic">“{familyAcc.introduction}”</div>}
              </div>
            </div>
          </div>
        )}
      </Modal.Body>

      {job?.status === 2 && (
        <Modal.Footer className="py-2 d-flex justify-content-between align-items-center">
          <div className="text-muted small">Bạn muốn nhận công việc này?</div>
          <div className="d-flex gap-2">
            <Button size="sm" variant="outline-danger" disabled={loading} onClick={onDeny}>
              ❌ Từ chối
            </Button>
            <Button size="sm" variant="warning" disabled={loading} onClick={onAccept}>
              ✅ Chấp nhận
            </Button>
          </div>
        </Modal.Footer>
      )}
    </Modal>
  );
}
