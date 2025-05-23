import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AdminServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [editServiceID, setEditServiceID] = useState(null);
  const [editPrice, setEditPrice] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Service/ServiceList`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services", err);
      toast.error("Không thể tải danh sách dịch vụ.", { position: "top-right" });
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (service) => {
    try {
      const url = `${API_BASE_URL}/Service/UpdateService?ServiceID=${service.serviceID}&ServiceName=${encodeURIComponent(
        service.serviceName
      )}&Price=${editPrice}&ServiceTypeID=${service.serviceType.serviceTypeID}&Description=${encodeURIComponent(
        editDescription
      )}`;

      const res = await fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });

      const msg = await res.text();
      if (res.ok) {
        toast.success(msg, {
          position: "top-right",
          autoClose: 2000,
          onClose: () => window.location.reload(),
        });
      } else {
        toast.error(msg, { position: "top-right" });
      }
    } catch (err) {
      toast.error("Lỗi khi cập nhật dịch vụ.", { position: "top-right" });
    } finally {
      setEditServiceID(null);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container-fluid">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <div className="row">
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>
        <div className="col-md-10 py-5">
          <h2 className="fw-bold mb-4 text-primary text-center">Danh Sách Dịch Vụ</h2>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
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
                      <th>Giá</th>
                      <th>Mô tả</th>
                      <th>Hành động</th>
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.serviceID} className="text-center">
                        <td>{service.serviceID}</td>
                        <td>{service.serviceName}</td>
                        <td>{service.serviceType?.serviceTypeName}</td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <input
                              type="number"
                              className="form-control"
                              value={editPrice}
                              onChange={(e) => setEditPrice(e.target.value)}
                              style={{ maxWidth: "100px", margin: "auto" }}
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
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                            />
                          ) : (
                            service.description || "Không có"
                          )}
                        </td>
                        <td>
                          {editServiceID === service.serviceID ? (
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSave(service)}
                            >
                              Lưu
                            </button>
                          ) : (
                            <button
                              className="btn btn-warning btn-sm"
                              onClick={() => {
                                setEditServiceID(service.serviceID);
                                setEditPrice(service.price);
                                setEditDescription(service.description || "");
                              }}
                            >
                              Sửa
                            </button>
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
    </div>
  );
};

export default AdminServiceListPage;
