import React, { useEffect, useState } from "react";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { OverlayTrigger, Tooltip } from "react-bootstrap";

const HouseKeeperSkillsCard = () => {
    const [skillMappings, setSkillMappings] = useState([]);
    const [allSkills, setAllSkills] = useState([]);
    const [selectedSkillID, setSelectedSkillID] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const fetchAllSkills = () => {
        return fetch(`http://localhost:5280/api/HouseKeeperSkills/HousekeeperSkillList?pageNumber=1&pageSize=15`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "text/plain",
            },
        })
            .then((res) => res.json())
            .then((data) => setAllSkills(data || []))
            .catch((err) => console.error("Error fetching all skills:", err));
    };

    const fetchSkillMappings = () => {
        return fetch(`http://localhost:5280/api/HousekeeperSkillMapping/GetSkillsByHousekeeperID?housekeeperId=${accountID}`, {
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "text/plain",
            },
        })
            .then((res) => res.json())
            .then((data) => setSkillMappings(data || []))
            .catch((err) => console.error("Error fetching skill mappings:", err));
    };

    const handleAddSkill = () => {
        if (!selectedSkillID) return;

        setLoading(true);
        fetch(`http://localhost:5280/api/HousekeeperSkillMapping/AddSkill?HousekeeperID=${accountID}&HouseKeeperSkillID=${selectedSkillID}`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "*/*",
            },
        })
            .then((res) => {
                if (res.ok) {
                    Promise.all([fetchSkillMappings(), fetchAllSkills()]).then(() => {
                        setShowModal(false);
                        setSelectedSkillID("");
                    });
                } else {
                    console.error("Failed to add skill.");
                }
            })
            .catch((err) => console.error("Error adding skill:", err))
            .finally(() => setLoading(false));
    };

    const handleRemoveSkill = (skillID) => {
        if (!window.confirm("Bạn có chắc chắn muốn xóa kỹ năng này?")) return;

        fetch(`http://localhost:5280/api/HousekeeperSkillMapping/RemoveSkill?housekeeperId=${accountID}&skillId=${skillID}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${authToken}`,
                Accept: "*/*",
            },
        })
            .then((res) => {
                if (res.ok) {
                    fetchSkillMappings(); // Refresh after remove
                } else {
                    console.error("Failed to remove skill.");
                }
            })
            .catch((err) => console.error("Error removing skill:", err));
    };

    const getSkillInfoByID = (id) => {
        return allSkills.find((s) => s.houseKeeperSkillID === id);
    };

    const alreadyHasSkill = (skillID) => {
        return skillMappings.some((map) => map.houseKeeperSkillID === skillID);
    };

    useEffect(() => {
        if (accountID && authToken) {
            Promise.all([fetchSkillMappings(), fetchAllSkills()]);
        }
    }, [accountID, authToken]);

    const handleShowModal = () => {
        setShowModal(true);
    };

    return (
        <>
            <div className="card p-4 shadow-sm w-100 h-100">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h5 className="fw-bold mb-0">Kỹ năng</h5>
                    <Button variant="outline-primary" size="sm" onClick={handleShowModal}>
                        Thêm kỹ năng
                    </Button>
                </div>

                <ul className="list-unstyled d-flex flex-wrap gap-3">
                    {skillMappings.length > 0 ? (
                        skillMappings.map((map) => {
                            const info = getSkillInfoByID(map.houseKeeperSkillID);
                            const tooltip = (
                                <Tooltip id={`tooltip-skill-${map.houseKeeperSkillMappingID}`}>
                                    {info?.description || "Không có mô tả"}
                                </Tooltip>
                            );

                            return (
                                <OverlayTrigger
                                    key={map.housekeeperSkillMappingID}
                                    placement="top"
                                    overlay={tooltip}
                                    delay={{ show: 300, hide: 150 }}
                                >
                                    <li
                                        className="bg-light border rounded px-3 py-1 d-flex align-items-center gap-2"
                                        style={{ cursor: "pointer" }}
                                    >
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

            {/* Modal with dropdown */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Thêm kỹ năng</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Label>Chọn kỹ năng:</Form.Label>
                        <Form.Select
                            value={selectedSkillID}
                            onChange={(e) => setSelectedSkillID(e.target.value)}
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
                        {loading ? <Spinner animation="border" size="sm" /> : "Thêm"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default HouseKeeperSkillsCard;
