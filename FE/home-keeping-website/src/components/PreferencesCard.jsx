import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { Modal, Button, Form } from "react-bootstrap";

const PreferencesCard = ({ familyID, token }) => {
  const [showModal, setShowModal] = useState(false);
  const [preferences, setPreferences] = useState(null);
  const [form, setForm] = useState({
    genderPreference: 0,
    languagePreference: 0,
    locationPreference: 0,
  });

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  const fetchPreferences = async () => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/FamilyPreference/GetFamilyPreferenceByFamilyID?familyId=${familyID}`,
        { headers }
      );
      setPreferences(res.data);
    } catch {
      setPreferences(null); // fallback to "Add new"
    }
  };

  useEffect(() => {
    if (familyID) fetchPreferences();
  }, [familyID]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: parseInt(value) }));
  };

  const handleOpenModal = () => {
    if (preferences) {
      setForm({
        genderPreference: preferences.genderPreference,
        languagePreference: preferences.languagePreference,
        locationPreference: preferences.locationPreference,
      });
    } else {
      setForm({
        genderPreference: 0,
        languagePreference: 0,
        locationPreference: 0,
      });
    }
    setShowModal(true);
  };

  const handleSubmit = async () => {
    const payload = preferences
      ? {
          familyPreferenceID: preferences.familyPreferenceID,
          familyID,
          ...form,
        }
      : {
          familyID,
          ...form,
        };

    const url = preferences
      ? `${API_BASE_URL}/FamilyPreference/UpdateFamilyPreference`
      : `${API_BASE_URL}/FamilyPreference/AddFamilyPreference`;

    const method = preferences ? axios.put : axios.post;

    try {
      await method(url, payload, { headers });
      toast.success(preferences ? "✅ Cập nhật thành công!" : "🎉 Thêm thành công!");
      setShowModal(false);
      fetchPreferences();
    } catch (err) {
      toast.error("❌ Đã xảy ra lỗi khi lưu dữ liệu.");
      console.error(err);
    }
  };

  const handleDelete = async () => {
    if (!preferences) return;
    if (!window.confirm("Bạn có chắc chắn muốn xoá tùy chọn này?")) return;

    try {
      await axios.delete(
        `${API_BASE_URL}/FamilyPreference/DeleteFamilyPreference?id=${preferences.familyPreferenceID}`,
        { headers }
      );
      toast.success("🗑️ Đã xoá tùy chọn.");
      setPreferences(null);
    } catch (err) {
      toast.error("❌ Xoá thất bại.");
      console.error(err);
    }
  };

  const genderMap = { 0: "Bất kỳ", 1: "Nam", 2: "Nữ" };
  const languageMap = { 0: "Bất kỳ", 1: "Tiếng Việt", 2: "Tiếng Anh" };
  const locationMap = {
    0: "Không chọn",
    1: "Quận 1",
    2: "Quận 3",
    3: "Quận 4",
    4: "Quận 5",
    5: "Quận 6",
    6: "Quận 7",
    7: "Quận 8",
    8: "Quận 10",
    9: "Quận 11",
    10: "Quận 12",
    11: "Gò Vấp",
    12: "Bình Thạnh",
    13: "Tân Bình",
    14: "Tân Phú",
  };

  return (
    <div className="card shadow-sm p-4 mt-4 border-0 position-relative" style={{ borderRadius: "1rem" }}>
      <ToastContainer />
      <h5 className="fw-bold mb-3" style={{ fontSize: "1.25rem" }}>⚙️ Tùy chọn gia đình</h5>

      {preferences && (
        <button
          className="btn btn-sm btn-outline-danger position-absolute"
          style={{ top: "1rem", right: "1rem" }}
          onClick={handleDelete}
          title="Xoá tùy chọn"
        >
          🗑️
        </button>
      )}

      {preferences ? (
        <>
          <p><strong>👤 Giới tính ưu tiên:</strong> {genderMap[preferences.genderPreference]}</p>
          <p><strong>🗣️ Ngôn ngữ ưu tiên:</strong> {languageMap[preferences.languagePreference]}</p>
          <p><strong>📍 Khu vực ưu tiên:</strong> {locationMap[preferences.locationPreference]}</p>
          <Button variant="outline-secondary" onClick={handleOpenModal}>
            ✏️ Cập nhật tùy chọn
          </Button>
        </>
      ) : (
        <>
          <p className="text-muted">Chưa có tùy chọn nào được cấu hình.</p>
          <Button variant="outline-primary" onClick={handleOpenModal}>
            ➕ Thêm tùy chọn gia đình
          </Button>
        </>
      )}

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>🛠️ {preferences ? "Cập nhật" : "Thêm"} tùy chọn gia đình</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Giới tính ưu tiên</Form.Label>
              <Form.Select name="genderPreference" value={form.genderPreference} onChange={handleInputChange}>
                <option value={0}>Bất kỳ</option>
                <option value={1}>Nam</option>
                <option value={2}>Nữ</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Ngôn ngữ ưu tiên</Form.Label>
              <Form.Select name="languagePreference" value={form.languagePreference} onChange={handleInputChange}>
                <option value={0}>Bất kỳ</option>
                <option value={1}>Tiếng Việt</option>
                <option value={2}>Tiếng Anh</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Khu vực ưu tiên</Form.Label>
              <Form.Select name="locationPreference" value={form.locationPreference} onChange={handleInputChange}>
                {Object.entries(locationMap).map(([key, value]) => (
                  <option key={key} value={key}>{value}</option>
                ))}
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Huỷ</Button>
          <Button variant="primary" onClick={handleSubmit}>
            {preferences ? "Cập nhật" : "Lưu"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PreferencesCard;
