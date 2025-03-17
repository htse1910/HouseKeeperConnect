import React, { useEffect, useState } from "react";
import { FaBriefcase, FaCheckCircle, FaUser, FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";

function HouseKeeperManagePage() {
  const [filter, setFilter] = useState({ jobType: "Tất cả", status: "Tất cả", date: "" });
  const [activeTab, setActiveTab] = useState("applied");
  const [housekeeperID, setHousekeeperID] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch housekeeper ID using Account ID from localStorage
  useEffect(() => {
    const fetchHousekeeperID = async () => {
      const accountID = localStorage.getItem("accountID");
      const authToken = localStorage.getItem("authToken");
    
      console.log("Account ID:", accountID);
      console.log("Auth Token:", authToken); // ✅ Debugging
    
      if (!accountID || !authToken) {
        setError("Không tìm thấy Account ID hoặc Auth Token.");
        setLoading(false);
        return;
      }
    
      try {
        const response = await fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });
    
        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Lỗi khi lấy dữ liệu người giúp việc: ${errorText}`);
        }
    
        const data = await response.json();
        setHousekeeperID(data.housekeeperID);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải dữ liệu người giúp việc.");
      }
    };
    
    fetchHousekeeperID();
  }, []);

  // Fetch job bookings using housekeeper ID
  useEffect(() => {
    if (!housekeeperID) return;

    const fetchBookings = async () => {
      const authToken = localStorage.getItem("authToken");

      try {
        const response = await fetch(`http://localhost:5280/api/Booking/GetBookingsByHousekeeperID?housekeeperId=${housekeeperID}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`, // ✅ Include auth token
          },
        });

        if (!response.ok) throw new Error("Lỗi khi lấy danh sách công việc.");
        
        const data = await response.json();
        setJobs(data);
      } catch (err) {
        console.error(err);
        setError("Lỗi khi tải danh sách công việc.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [housekeeperID]);

  if (loading) return <p>Đang tải dữ liệu...</p>;
  if (error) return <p className="text-danger">{error}</p>;

  return (
    <div className="container mt-4">
      {/* Job Statistics */}
      <div className="card p-4 shadow-sm mb-3">
        <h4 className="fw-bold">Công việc của tôi</h4>
        <p className="text-muted">Quản lý công việc của bạn, nắm bắt thông tin công việc đã chọn nhanh chóng.</p>

        <div className="d-flex gap-3">
          <div className="p-3 rounded d-flex justify-content-between align-items-center flex-grow-1" style={{ backgroundColor: "#FFF7ED" }}>
            <div>
              <h6>Công việc đã ứng tuyển</h6>
              <h3 className="fw-bold">{jobs.length}</h3>
            </div>
            <FaBriefcase className="text-warning" size={24} />
          </div>

          <div className="p-3 rounded d-flex justify-content-between align-items-center flex-grow-1" style={{ backgroundColor: "#FFF7ED" }}>
            <div>
              <h6>Công việc đã nhận</h6>
              <h3 className="fw-bold">{jobs.filter((job) => job.bookingStatus === 1).length}</h3>
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

      {/* Jobs and Filters */}
      <div className="card p-4 shadow-sm mb-3">
        <div className="row">
          {/* Filters */}
          <div className="col-md-3">
            <div className="card p-3 shadow-sm">
              <h5 className="fw-bold">Bộ lọc</h5>
              <div className="mb-3">
                <label className="form-label">Trạng thái</label>
                <select className="form-select" name="status" value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                  <option value="Tất cả">Tất cả</option>
                  <option value="1">Đã nhận</option>
                  <option value="0">Đang chờ</option>
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label">Ngày</label>
                <input type="date" className="form-control" name="date" value={filter.date} onChange={(e) => setFilter({ ...filter, date: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="col-md-9">
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

            <div className="mt-3">
              {jobs
                .filter((job) => (filter.status === "Tất cả" ? true : job.bookingStatus.toString() === filter.status))
                .map((job) => (
                  <div key={job.bookingID} className="card p-3 shadow-sm mb-3">
                    <h5 className="fw-bold">Công việc {job.jobID}</h5>
                    <p className="text-muted">
                      <FaUser className="me-1" /> Gia đình {job.familyID} &nbsp; | &nbsp;
                      <FaMoneyBillWave className="text-success me-1" /> {job.serviceID} &nbsp; | &nbsp;
                      Ngày làm việc: {new Date(job.scheduledDate).toLocaleDateString()}
                    </p>
                    <span className={`badge bg-${job.bookingStatus === 1 ? "success" : "primary"} text-white`}>
                      {job.bookingStatus === 1 ? "Đã nhận" : "Đang chờ"}
                    </span>

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-warning">Xem chi tiết</button>
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

export default HouseKeeperManagePage;