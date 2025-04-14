import React, { useEffect, useState } from "react";
import { FaToolbox, FaSearch, FaPlus } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const AdminServicesPage = () => {
  const authToken = localStorage.getItem("authToken");
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchID, setSearchID] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [formData, setFormData] = useState({
    serviceName: "",
    price: "",
    serviceTypeID: "",
    description: "",
  });
  const [addResult, setAddResult] = useState(null);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const res = await fetch("${API_BASE_URL}/Service/ServiceList", {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setServices(data);
    } catch (err) {
      console.error("Failed to fetch services:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchByID = async () => {
    if (!searchID.trim()) return;
    setLoading(true);
    setSearchMode(true);
    try {
      const res = await fetch(`${API_BASE_URL}/Service/GetServiceByID?id=${searchID}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setServices(data ? [data] : []);
    } catch (err) {
      console.error("Search by ID failed:", err);
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchID("");
    setSearchMode(false);
    fetchServices();
  };

  const handleAddService = async () => {
    if (!formData.serviceName || !formData.price || !formData.serviceTypeID) return;
    try {
      const params = new URLSearchParams({
        ServiceName: formData.serviceName,
        Price: formData.price,
        ServiceTypeID: formData.serviceTypeID,
        Description: formData.description,
      });

      const res = await fetch(`${API_BASE_URL}/Service/AddService?${params}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const result = await res.text();
      setAddResult(result);
      setFormData({ serviceName: "", price: "", serviceTypeID: "", description: "" });
      fetchServices();
    } catch (err) {
      console.error("Add service failed:", err);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  return (
    <div className="container py-5">
      <div className="card shadow-sm border-0 p-4 rounded-4">
        <h3 className="fw-bold mb-4 text-primary d-flex align-items-center">
          <FaToolbox className="me-2" /> Quản lý Dịch vụ
        </h3>

        {/* Search Section */}
        <div className="row gy-2 gx-3 align-items-end mb-4">
          <div className="col-md-6">
            <label className="form-label fw-semibold">Tìm dịch vụ theo ID</label>
            <div className="input-group">
              <span className="input-group-text">
                <FaSearch />
              </span>
              <input
                type="number"
                className="form-control"
                placeholder="Nhập ID dịch vụ..."
                value={searchID}
                onChange={(e) => setSearchID(e.target.value)}
              />
              <button className="btn btn-primary" onClick={searchByID}>Tìm</button>
            </div>
          </div>
          <div className="col-md-2 d-flex align-items-end">
            <button className="btn btn-outline-dark w-100" onClick={resetSearch}>❌ Đặt lại</button>
          </div>
        </div>

        {/* Add Service Form */}
        <div className="mb-5">
          <h5 className="fw-semibold mb-3">➕ Thêm dịch vụ mới</h5>
          <div className="row g-3">
            <div className="col-md-4">
              <input
                className="form-control"
                placeholder="Tên dịch vụ"
                value={formData.serviceName}
                onChange={(e) => setFormData({ ...formData, serviceName: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Giá (VND)"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="col-md-2">
              <input
                type="number"
                className="form-control"
                placeholder="Loại dịch vụ ID"
                value={formData.serviceTypeID}
                onChange={(e) => setFormData({ ...formData, serviceTypeID: e.target.value })}
              />
            </div>
            <div className="col-md-3">
              <input
                className="form-control"
                placeholder="Mô tả (tuỳ chọn)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div className="col-md-1">
              <button className="btn btn-success w-100" onClick={handleAddService}>
                <FaPlus />
              </button>
            </div>
          </div>
          {addResult && <div className="alert alert-info mt-3">{addResult}</div>}
        </div>

        {loading ? (
          <p className="text-muted">⏳ Đang tải danh sách dịch vụ...</p>
        ) : services.length === 0 ? (
          <div className="alert alert-warning">Không có dịch vụ nào.</div>
        ) : (
          <div className="table-responsive">
            <table className="table table-bordered table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>ID</th>
                  <th>Tên dịch vụ</th>
                  <th>Giá (VND)</th>
                  <th>Tên loại dịch vụ</th>
                  <th>Mô tả</th>
                </tr>
              </thead>
              <tbody>
                {services.map((service) => (
                  <tr key={service.serviceID}>
                    <td>{service.serviceID}</td>
                    <td>{service.serviceName}</td>
                    <td>{service.price.toLocaleString()} đ</td>
                    <td>{service.serviceType?.serviceTypeName || "—"}</td>
                    <td>{service.description || "Không có mô tả"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminServicesPage;
