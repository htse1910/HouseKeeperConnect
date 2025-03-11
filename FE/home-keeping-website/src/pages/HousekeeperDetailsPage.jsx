import React, { useEffect, useState } from "react";
import {
  FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaStar, FaUserCircle, FaCheckCircle, FaTimesCircle
} from "react-icons/fa";

function HousekeeperDetailsPage() {
  const [housekeeper, setHousekeeper] = useState(null);
  const [housekeeperDetails, setHousekeeperDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [noRecords, setNoRecords] = useState(false);

  useEffect(() => {
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    if (!accountID) {
      setError("Không tìm thấy accountID trong localStorage.");
      setLoading(false);
      return;
    }

    if (!authToken) {
      setError("Không tìm thấy authToken. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    // Fetch general account details
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (!response.ok) throw new Error("Lỗi xác thực tài khoản.");
        return response.json();
      })
      .then((data) => setHousekeeper(data))
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu tài khoản:", error);
      });

    // Fetch housekeeper details
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${authToken}`,
      },
    })
      .then((response) => {
        if (response.status === 404) {
          setNoRecords(true);
          return null;
        }
        if (!response.ok) throw new Error("Lỗi khi xác thực.");
        return response.json();
      })
      .then((data) => {
        if (data) {
          setHousekeeperDetails(data);
          setNoRecords(false);
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu người giúp việc:", error);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Đang tải thông tin...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      {/* Housekeeper Header */}
      <div className="card shadow-sm p-4 mb-3">
        <div className="d-flex justify-content-between align-items-center">
          <h3 className="fw-bold">{housekeeper?.name || "Không có thông tin"}</h3>
          <button
            className="btn btn-primary"
            onClick={() => window.location.href = `/housekeeper/profile/update/${localStorage.getItem("accountID")}`}
          >
            Cập nhật tài khoản
          </button>
        </div>

        <p className="text-muted">
          <FaMapMarkerAlt className="text-danger me-2" />
          {housekeeper?.location || "Chưa cập nhật"} &nbsp; | &nbsp;
          <FaMoneyBillWave className="text-success me-2" />
          {housekeeper?.salary || "Thỏa thuận"} &nbsp; | &nbsp;
          <FaClock className="text-muted me-2" />
          Đăng {housekeeper?.updatedAt || "không rõ"}
        </p>

        {/* Identification Picture Section */}
        {noRecords ? (
          <div className="alert alert-warning mt-3">
            <p className="text-danger fw-bold">Bạn chưa thêm ảnh xác minh danh tính.</p>
            <button className="btn btn-primary" onClick={() => window.location.href = "/housekeeper/upload-id"}>
              Thêm ảnh xác minh danh tính
            </button>
          </div>
        ) : (
          <div className="alert alert-success mt-3">
            <p className="fw-bold">Ảnh xác minh danh tính đã được thêm.</p>
            <button className="btn btn-outline-primary" onClick={() => window.location.href = "/housekeeper/update-id"}>
              Cập nhật ảnh xác minh
            </button>
          </div>
        )}
      </div>

      <div className="row">
        {/* Profile Details */}
        <div className="col-md-8">
          <div className="card shadow-sm p-4 mb-3">
            <h5 className="fw-bold">Thông tin cá nhân</h5>
            <p><strong>Email:</strong> {housekeeper?.email}</p>
            <p><strong>Số điện thoại:</strong> {housekeeper?.phone}</p>
          </div>

          {/* Job Statistics Section */}
          <div className="card shadow-sm p-4 mb-3">
            <h5 className="fw-bold">Thống kê công việc</h5>
            <p><strong>Số công việc đã hoàn thành:</strong> {housekeeperDetails?.jobCompleted ?? "0"}</p>
            <p><strong>Số công việc đã ứng tuyển:</strong> {housekeeperDetails?.jobsApplied ?? "0"}</p>
            <p>
              <strong>Trạng thái xác minh:</strong>{" "}
              {housekeeperDetails?.isVerified ? (
                <span className="text-success">
                  <FaCheckCircle /> Đã xác minh
                </span>
              ) : (
                <span className="text-danger">
                  <FaTimesCircle /> Chưa xác minh
                </span>
              )}
            </p>
          </div>

          {/* Reviews Section */}
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Đánh giá</h5>
            <p className="text-muted">Chưa có đánh giá nào.</p>
            <button className="btn btn-warning mt-2">Thêm đánh giá</button>
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="col-md-4">
          {/* Housekeeper Profile Card */}
          <div className="card shadow-sm p-4 mb-3">
            <h5 className="fw-bold">Hồ sơ người giúp việc</h5>
            <h6>{housekeeper?.name}</h6>
            <p className="text-muted">{housekeeper?.location || "Chưa cập nhật"}</p>
            <div className="d-flex align-items-center">
              {[...Array(5)].map((_, i) => (
                <FaStar key={i} className={i < 4 ? "text-warning" : "text-muted"} />
              ))}
              <span className="ms-2 text-muted">(4.0)</span>
            </div>
            <div className="d-flex gap-2 mt-2">
              <button className="btn btn-warning w-50">Thuê ngay</button>
              <button className="btn btn-outline-warning w-50">Nhắn tin</button>
            </div>
          </div>

          {/* Similar Jobs Section */}
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Công việc tương tự</h5>
            <p className="text-muted">Không có công việc tương tự.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HousekeeperDetailsPage;
