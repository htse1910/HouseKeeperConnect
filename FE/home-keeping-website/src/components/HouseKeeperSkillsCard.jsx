import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner, OverlayTrigger, Tooltip } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const HouseKeeperSkillsCard = () => {
  const [skillMappings, setSkillMappings] = useState([]);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillID, setSelectedSkillID] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchAllSkills = () => {
    return fetch(`http://localhost:5280/api/HouseKeeperSkills/HousekeeperSkillList?pageNumber=1&pageSize=50`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setAllSkills(data);
        } else {
          console.error("Expected array for allSkills, got:", data);
          setAllSkills([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching all skills:", err);
        setAllSkills([]);
      });
  };

  const fetchSkillMappings = () => {
    return fetch(`http://localhost:5280/api/HousekeeperSkillMapping/GetSkillsByAccountID?accountId=${accountID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Skill Mappings Response:", data);
        if (Array.isArray(data)) {
          setSkillMappings(data);
        } else {
          console.error("Expected array for skillMappings, got:", data);
          setSkillMappings([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching skill mappings:", err);
        setSkillMappings([]);
      });
  };

  const handleAddSkill = () => {
    if (!selectedSkillID) return;

    setLoading(true);
    fetch(`http://localhost:5280/api/HousekeeperSkillMapping/AddSkill?accountId=${accountID}&skillId=${selectedSkillID}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "*/*",
      },
    })
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

  const handleRemoveSkill = (skillID) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) return;

    fetch(`http://localhost:5280/api/HousekeeperSkillMapping/RemoveSkill?accountId=${accountID}&skillId=${skillID}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${authToken}`,
        Accept: "*/*",
      },
    })
      .then((res) => {
        if (res.ok) {
          toast.success("🗑️ Kỹ năng đã được xóa.");
          setTimeout(() => window.location.reload(), 1500);
        } else {
          toast.error("❌ Xóa kỹ năng thất bại.");
        }
      })
      .catch((err) => {
        console.error("Error removing skill:", err);
        toast.error("❌ Đã xảy ra lỗi khi xóa kỹ năng.");
      });
  };

  const getSkillInfoByID = (id) => allSkills.find((s) => s.houseKeeperSkillID === id);

  const alreadyHasSkill = (skillID) =>
    Array.isArray(skillMappings) && skillMappings.some((map) => map.houseKeeperSkillID === skillID);

  useEffect(() => {
    if (accountID && authToken) {
      Promise.all([fetchSkillMappings(), fetchAllSkills()]);
    }
  }, [accountID, authToken]);

  return (
    <>
      <ToastContainer />
      <div className="card p-4 shadow-sm w-100 h-100">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">Kỹ năng</h5>
          <Button variant="outline-primary" size="sm" onClick={() => setShowModal(true)}>
            Thêm kỹ năng
          </Button>
        </div>

        <ul className="list-unstyled d-flex flex-wrap gap-3">
          {Array.isArray(skillMappings) && skillMappings.length > 0 ? (
            skillMappings.map((map) => {
              const info = getSkillInfoByID(map.houseKeeperSkillID);
              const tooltip = (
                <Tooltip id={`tooltip-skill-${map.housekeeperSkillMappingID}`}>
                  {info?.description || "Không có mô tả"}
                </Tooltip>
              );

              return (
                <OverlayTrigger key={map.housekeeperSkillMappingID} placement="top" overlay={tooltip}>
                  <li className="bg-light border rounded px-3 py-1 d-flex align-items-center gap-2" style={{ cursor: "pointer" }}>
                    <span className="text-warning">✅ {info?.name || "Không rõ"}</span>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleRemoveSkill(map.houseKeeperSkillID)}
                      title="Xóa kỹ năng này"
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

      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Thêm kỹ năng</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Chọn kỹ năng:</Form.Label>
            <Form.Select value={selectedSkillID} onChange={(e) => setSelectedSkillID(e.target.value)}>
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
          <Button variant="primary" onClick={handleAddSkill} disabled={!selectedSkillID || loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Thêm"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default HouseKeeperSkillsCard;
