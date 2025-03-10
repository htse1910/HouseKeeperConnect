import React, { useState } from "react";
import { FaBriefcase, FaCheckCircle, FaUser, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

function FamilyManagePage() {
  const [filter, setFilter] = useState({ jobType: "Tất cả", status: "Tất cả", date: "" });
  const [activeTab, setActiveTab] = useState("applied");

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  const jobs = [
    {
      id: 1,
      title: "Dọn dẹp nhà cửa",
      employer: "Gia đình Nguyễn Văn A",
      location: "Quận 1, TP.HCM",
      salary: "150,000 VND/giờ",
      status: "Đang chờ phản hồi",
      statusColor: "primary",
      isAccepted: false,
    },
    {
      id: 2,
      title: "Nấu ăn gia đình",
      employer: "Gia đình Trần Văn B",
      location: "Quận 2, TP.HCM",
      salary: "200,000 VND/giờ",
      status: "Đã chấp nhận",
      statusColor: "success",
      isAccepted: true,
    },
  ];

  return (
    <div className="container mt-4">
      {/* First Card - Job Statistics */}
      <div className="card p-4 shadow-sm mb-3">
        <h4 className="fw-bold">Công việc của tôi</h4>
        <p className="text-muted">
          Quản lý công việc của bạn, nắm bắt thông tin công việc đã chọn nhanh chóng.
        </p>

        <div className="d-flex gap-3">
          <div className="p-3 rounded d-flex justify-content-between align-items-center flex-grow-1" style={{ backgroundColor: "#FFF7ED" }}>
            <div>
              <h6>Công việc đã ứng tuyển</h6>
              <h3 className="fw-bold">15</h3>
            </div>
            <FaBriefcase className="text-warning" size={24} />
          </div>

          <div className="p-3 rounded d-flex justify-content-between align-items-center flex-grow-1" style={{ backgroundColor: "#FFF7ED" }}>
            <div>
              <h6>Công việc đã nhận</h6>
              <h3 className="fw-bold">8</h3>
            </div>
            <FaCheckCircle className="text-success" size={24} />
          </div>

          <div className="p-3 rounded d-flex align-items-center justify-content-between" style={{ backgroundColor: "#FFF7ED", minWidth: "250px" }}>
            <div>
              <h6>Nhiều công việc chờ bạn khám phá</h6>
              <h3 className="fw-bold">2M+</h3>
            </div>
            <button className="btn btn-warning">Tìm việc ngay</button>
          </div>
        </div>
      </div>

      {/* Second Card - Expands Based on Content */}
      <div className="card p-4 shadow-sm mb-3">
        <div className="row">
          {/* Filter Card - Left Side */}
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold">Bộ lọc</h5>
              <div className="mb-3">
                <label className="form-label">Loại công việc</label>
                <select className="form-select" name="jobType" value={filter.jobType} onChange={handleFilterChange}>
                  <option value="Tất cả">Tất cả</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" name="status" value={filter.status} onChange={handleFilterChange}>
                  <option value="Tất cả">Tất cả</option>
                  <option value="Đang chờ phản hồi">Đang chờ phản hồi</option>
                  <option value="Đã chấp nhận">Đã chấp nhận</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày</label>
                <input type="date" className="form-control" name="date" value={filter.date} onChange={handleFilterChange} />
              </div>
            </div>
          </div>

          {/* Right Section - Tabs and Job Listings */}
          <div className="col-md-9">
            {/* Tabs Section */}
            <div className="d-flex gap-4 border-bottom">
              {["Đã ứng tuyển", "Đã nhận", "Hoàn thành"].map((tab, index) => {
                const tabKey = ["applied", "accepted", "completed"][index];
                return (
                  <div
                    key={tabKey}
                    className={`pb-2 cursor-pointer ${activeTab === tabKey ? "text-warning fw-bold border-bottom border-2 border-warning" : "text-secondary"}`}
                    style={{ cursor: "pointer" }}
                    onClick={() => setActiveTab(tabKey)}
                  >
                    {tab}
                  </div>
                );
              })}
            </div>

            {/* Job Listings - Inside Second Card */}
            <div className="mt-3">
              {jobs.map((job) => (
                <div key={job.id} className="card p-3 shadow-sm mb-3">
                  <h5 className="fw-bold">{job.title}</h5>
                  <p className="text-muted">
                    <FaUser className="me-1" /> {job.employer} &nbsp; | &nbsp;
                    <FaMapMarkerAlt className="me-1" /> {job.location} &nbsp; | &nbsp;
                    <FaMoneyBillWave className="text-success me-1" /> {job.salary}
                  </p>
                  <span className={`badge bg-${job.statusColor} text-white`}>{job.status}</span>

                  <div className="d-flex gap-2 mt-3">
                    {job.isAccepted ? (
                      <button className="btn btn-warning">Xem chi tiết</button>
                    ) : (
                      <>
                        <button className="btn btn-outline-danger">Hủy ứng tuyển</button>
                        <button className="btn btn-warning">Xem chi tiết</button>
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FamilyManagePage;
