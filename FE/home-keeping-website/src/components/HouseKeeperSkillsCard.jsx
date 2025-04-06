import React, { useEffect, useState } from "react";
import {
  Modal,
  Button,
  Form,
  Spinner,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import { FaBroom } from "react-icons/fa"; // instead of FaTools
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/HouseKeeperSkillsCard.css";

const HouseKeeperSkillsCard = () => {
  const [skillMappings, setSkillMappings] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillID, setSelectedSkillID] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [skillToDelete, setSkillToDelete] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchAllSkills = () => {
    return fetch(
      `http://localhost:5280/api/HouseKeeperSkills/HousekeeperSkillList?pageNumber=1&pageSize=50`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setAllSkills(data);
        else setAllSkills([]);
      })
      .catch((err) => {
        console.error("Error fetching all skills:", err);
        setAllSkills([]);
      });
  };

  const fetchSkillMappings = () => {
    return fetch(
      `http://localhost:5280/api/HousekeeperSkillMapping/GetSkillsByAccountID?accountId=${accountID}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setSkillMappings(data);
        else setSkillMappings([]);
      })
      .catch((err) => {
        console.error("Error fetching skill mappings:", err);
        setSkillMappings([]);
      });
  };

  const handleAddSkill = () => {
    if (!selectedSkillID) return;

    setLoading(true);
    fetch(
      `http://localhost:5280/api/HousekeeperSkillMapping/AddSkill?accountId=${accountID}&skillId=${selectedSkillID}`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("✅ Đã thêm kỹ năng mới!");
          Promise.all([fetchSkillMappings(), fetchAllSkills()]).then(() => {
            setShowModal(false);
            setSelectedSkillID("");
          });
        } else {
          toast.error("❌ Thêm kỹ năng thất bại.");
        }
      })
      .catch((err) => {
        console.error("Error adding skill:", err);
        toast.error("❌ Đã xảy ra lỗi khi thêm kỹ năng.");
      })
      .finally(() => setLoading(false));
  };

  const confirmRemoveSkill = (skillID) => {
    setSkillToDelete(skillID);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    if (!skillToDelete) return;

    fetch(
      `http://localhost:5280/api/HousekeeperSkillMapping/RemoveSkill?accountId=${accountID}&skillId=${skillToDelete}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${authToken}`,
          Accept: "*/*",
        },
      }
    )
      .then((res) => {
        if (res.ok) {
          toast.success("🗑️ Kỹ năng đã được xóa.");
          Promise.all([fetchSkillMappings(), fetchAllSkills()]);
        } else {
          toast.error("❌ Xóa kỹ năng thất bại.");
        }
      })
      .catch((err) => {
        console.error("Error removing skill:", err);
        toast.error("❌ Đã xảy ra lỗi khi xóa kỹ năng.");
      })
      .finally(() => {
        setSkillToDelete(null);
        setShowConfirmModal(false);
      });
  };

  const getSkillInfoByID = (id) =>
    allSkills.find((s) => s.houseKeeperSkillID === id);
  const alreadyHasSkill = (skillID) =>
    skillMappings.some((map) => map.houseKeeperSkillID === skillID);

  useEffect(() => {
    if (accountID && authToken) {
      Promise.all([fetchSkillMappings(), fetchAllSkills()]);
    }
  }, [accountID, authToken]);

  return (
    <>
      <ToastContainer />
      <div className="card shadow-sm border-0 p-4">
        {/* Header with icon and title */}
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="d-flex align-items-center gap-2">
            <div
              className="bg-warning bg-opacity-25 text-warning d-flex align-items-center justify-content-center rounded-circle border"
              style={{ width: "40px", height: "40px", fontSize: "18px" }}
            >
              <FaBroom />
            </div>
            <h5 className="fw-bold mb-0">Kỹ năng</h5>
          </div>
          <Button
            variant="outline-primary"
            size="sm"
            onClick={() => setShowModal(true)}
          >
            ➕ Thêm kỹ năng
          </Button>
        </div>

        {/* Scrollable skill list in inner card */}
        <div className="card p-3 skill-scroll-area">
          <ul className="list-unstyled d-flex flex-wrap gap-2 mb-0">
            {skillMappings.length > 0 ? (
              skillMappings.map((map) => {
                const info = getSkillInfoByID(map.houseKeeperSkillID);
                const tooltip = (
                  <Tooltip id={`tooltip-skill-${map.housekeeperSkillMappingID}`}>
                    {info?.description || "Không có mô tả"}
                  </Tooltip>
                );

                return (
                  <OverlayTrigger
                    key={map.housekeeperSkillMappingID}
                    placement="top"
                    overlay={tooltip}
                  >
                    <li className="skill-pill">
                      ✅ <span className="text-truncate">{info?.name || "Không rõ"}</span>
                      <button
                        className="btn btn-sm btn-danger delete-btn"
                        onClick={() => confirmRemoveSkill(map.houseKeeperSkillID)}
                      >
                        ❌
                      </button>
                    </li>
                  </OverlayTrigger>
                );
              })
            ) : (
              <li className="text-muted">Không có kỹ năng nào.</li>
            )}
          </ul>
        </div>
      </div>

      {/* Add Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🧠 Thêm kỹ năng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="fw-semibold">Chọn kỹ năng:</Form.Label>
            <Form.Select
              value={selectedSkillID}
              onChange={(e) => setSelectedSkillID(e.target.value)}
              className="mt-2"
            >
              <option value="">-- Chọn kỹ năng --</option>
              {allSkills
                .filter((skill) => !alreadyHasSkill(skill.houseKeeperSkillID))
                .map((skill) => (
                  <option key={skill.houseKeeperSkillID} value={skill.houseKeeperSkillID}>
                    {skill.name}
                  </option>
                ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={handleAddSkill}
            disabled={!selectedSkillID || loading}
          >
            {loading ? <Spinner animation="border" size="sm" /> : "Thêm kỹ năng"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Delete Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa kỹ năng</Modal.Title>
        </Modal.Header>
        <Modal.Body>Bạn có chắc chắn muốn xóa kỹ năng này không?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HouseKeeperSkillsCard;
