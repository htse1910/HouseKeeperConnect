import React, { useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";

const SERVICE_TYPES = {
  1: "Dọn dẹp nhà cửa",
  2: "Chăm sóc trẻ em/người cao tuổi",
  3: "Nấu ăn tại nhà",
  4: "Giặt ủi & chăm sóc quần áo",
  5: "Chăm sóc sân vườn & thú cưng",
  6: "Dịch vụ sửa chữa & bảo trì nhà cửa",
  7: "Hỗ trợ đặc biệt",
};

const AdminServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [editServiceID, setEditServiceID] = useState(null);
  const [editedData, setEditedData] = useState({});
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    serviceName: "",
    price: "",
    serviceTypeID: 1,
    description: "",
  });

  const token = localStorage.getItem("authToken");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Service/ServiceList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data);
    } catch {
      toast.error("Không thể tải danh sách dịch vụ.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (service) => {
    const { serviceName, price, serviceTypeID, description } = editedData;
    const url = `${API_BASE_URL}/Service/UpdateService?ServiceID=${service.serviceID}&ServiceName=${encodeURIComponent(serviceName)}&Price=${price}&ServiceTypeID=${serviceTypeID}&Description=${encodeURIComponent(description)}`;

    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      if (res.ok) {
        toast.success(msg);
        fetchServices();
      } else {
        toast.error(msg);
      }
    } catch {
      toast.error("Lỗi khi cập nhật dịch vụ.");
    } finally {
      setEditServiceID(null);
    }
  };

  const handleAddService = async () => {
    const { serviceName, price, serviceTypeID, description } = newService;
    const url = `${API_BASE_URL}/Service/AddService?ServiceName=${encodeURIComponent(serviceName)}&Price=${price}&ServiceTypeID=${serviceTypeID}&Description=${encodeURIComponent(description)}`;
    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      if (res.ok) {
        toast.success(msg);
        fetchServices();
        setShowAddModal(false);
        setNewService({ serviceName: "", price: "", serviceTypeID: 1, description: "" });
      } else {
        toast.error(msg);
      }
    } catch {
      toast.error("Lỗi khi thêm dịch vụ.");
    }
  };

  const toggleServiceStatus = async (id, enable) => {
    const url = `${API_BASE_URL}/Service/${enable ? "EnableService" : "DisableService"}?id=${id}`;
    try {
      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      if (res.ok) {
        toast.success(msg);
        fetchServices();
      } else {
        toast.error(msg);
      }
    } catch {
      toast.error("Lỗi khi cập nhật trạng thái dịch vụ.");
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container-fluid">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>
        <div className="col-md-10 py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h2 className="fw-bold text-primary">Danh Sách Dịch Vụ</h2>
            <Button variant="success" onClick={() => setShowAddModal(true)}>
              Thêm Dịch Vụ
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status" />
            </div>
          ) : (
            <div className="card p-4 shadow-sm border-primary rounded">
              <div className="table-responsive">
                <table className="table table-bordered table-hover table-striped align-middle">
                  <thead className="table-primary text-center">
                    <tr>
                      <th>ID</th>
                      <th>Tên dịch vụ</th>
                      <th>Loại dịch vụ</th>
                      <th>Giá theo giờ</th>
                      <th>Mô tả</th>
                      <th>Trạng thái</th>
                      <th>Chỉnh sửa</th>
                      <th>Sửa trạng thái dịch vụ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.serviceID} className="text-center">
                        <td>{service.serviceID}</td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editedData.serviceName}
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  serviceName: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            service.serviceName
                          )}
                        </td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <select
                              className="form-select"
                              value={editedData.serviceTypeID}
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  serviceTypeID: parseInt(e.target.value),
                                }))
                              }
                            >
                              {Object.entries(SERVICE_TYPES).map(([id, name]) => (
                                <option key={id} value={id}>
                                  {name}
                                </option>
                              ))}
                            </select>
                          ) : (
                            service.serviceType?.serviceTypeName
                          )}
                        </td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <input
                              type="number"
                              className="form-control"
                              value={editedData.price}
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  price: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            `${service.price.toLocaleString("vi-VN")} ₫`
                          )}
                        </td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <input
                              type="text"
                              className="form-control"
                              value={editedData.description}
                              onChange={(e) =>
                                setEditedData((prev) => ({
                                  ...prev,
                                  description: e.target.value,
                                }))
                              }
                            />
                          ) : (
                            service.description || "Không có"
                          )}
                        </td>
                        <td>
                          {service.status === 1 ? (
                            <span className="badge bg-success">Hoạt động</span>
                          ) : (
                            <span className="badge bg-secondary">Không hoạt động</span>
                          )}
                        </td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleSave(service)}
                            >
                              Lưu
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() => {
                                setEditServiceID(service.serviceID);
                                setEditedData({
                                  serviceName: service.serviceName,
                                  price: service.price,
                                  description: service.description || "",
                                  serviceTypeID: service.serviceTypeID,
                                });
                              }}
                            >
                              Sửa
                            </Button>
                          )}
                        </td>
                        <td>
                          {service.status === 1 ? (
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => toggleServiceStatus(service.serviceID, false)}
                            >
                              Vô hiệu hóa
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline-success"
                              onClick={() => toggleServiceStatus(service.serviceID, true)}
                            >
                              Kích hoạt
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Service Modal */}
      <Modal show={showAddModal} onHide={() => setShowAddModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Thêm Dịch Vụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Tên dịch vụ</Form.Label>
              <Form.Control
                type="text"
                value={newService.serviceName}
                onChange={(e) =>
                  setNewService({ ...newService, serviceName: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Giá theo giờ</Form.Label>
              <Form.Control
                type="number"
                value={newService.price}
                onChange={(e) =>
                  setNewService({ ...newService, price: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Loại dịch vụ</Form.Label>
              <Form.Select
                value={newService.serviceTypeID}
                onChange={(e) =>
                  setNewService({
                    ...newService,
                    serviceTypeID: parseInt(e.target.value),
                  })
                }
              >
                {Object.entries(SERVICE_TYPES).map(([id, name]) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                type="text"
                value={newService.description}
                onChange={(e) =>
                  setNewService({ ...newService, description: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleAddService}>
            Thêm
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminServiceListPage;
