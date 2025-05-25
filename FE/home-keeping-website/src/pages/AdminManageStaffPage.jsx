import React, { useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { Modal, Button, Form } from "react-bootstrap";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminManageStaffPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    gender: 1,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("authToken");

      const form = new FormData();
      form.append("Name", formData.name);
      form.append("Email", formData.email);
      form.append("Password", formData.password);
      form.append("Phone", formData.phone);
      form.append("Gender", formData.gender);

      await axios.post(`${API_BASE_URL}/Account/CreateStaff`, form, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Tạo nhân viên thành công!");
      setShowModal(false);
      setFormData({ name: "", email: "", password: "", phone: "", gender: 1 });
    } catch (error) {
      toast.error("Lỗi khi tạo nhân viên!");
    }
  };

  return (
    <div className="d-flex">
      <div style={{ width: "250px" }}>
        <AdminSidebar />
      </div>
      <div className="p-4 flex-grow-1">
        <h3 className="mb-4">Quản Lý Nhân Viên</h3>
        <Button variant="primary" onClick={() => setShowModal(true)}>
          Tạo Nhân Viên Mới
        </Button>

        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Tạo Nhân Viên</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form>
              <Form.Group className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Mật khẩu</Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select name="gender" value={formData.gender} onChange={handleChange}>
                  <option value={1}>Nam</option>
                  <option value={2}>Nữ</option>
                </Form.Select>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
            <Button variant="primary" onClick={handleSubmit}>
              Tạo
            </Button>
          </Modal.Footer>
        </Modal>
        <ToastContainer />
      </div>
    </div>
  );
};

export default AdminManageStaffPage;