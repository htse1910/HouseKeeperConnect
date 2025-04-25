import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import AdminSidebar from "../components/AdminSidebar";

const AdminServiceListPage = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch("http://localhost:5280/api/Service/ServiceList", {
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

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container-fluid">
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
                    </tr>
                  </thead>
                  <tbody>
                    {services.map((service) => (
                      <tr key={service.serviceID} className="text-center">
                        <td>{service.serviceID}</td>
                        <td>{service.serviceName}</td>
                        <td>{service.serviceType?.serviceTypeName}</td>
                        <td>{service.price.toLocaleString("vi-VN")} ₫</td>
                        <td>{service.description || "Không có"}</td>
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
