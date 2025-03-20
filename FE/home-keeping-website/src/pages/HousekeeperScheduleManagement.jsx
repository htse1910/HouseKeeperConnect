import React, { useEffect, useState } from "react";

const HousekeeperScheduleManagement = () => {
  const [housekeeperID, setHousekeeperID] = useState(null);
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) {
      setError("Không tìm thấy thông tin tài khoản.");
      setLoading(false);
      return;
    }

    // Step 1: Fetch Housekeeper ID
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.housekeeperID) {
          setHousekeeperID(data.housekeeperID);
        } else {
          setError("Không tìm thấy ID người giúp việc.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy ID người giúp việc:", err);
        setError("Lỗi khi lấy ID người giúp việc.");
      })
      .finally(() => setLoading(false));
  }, [accountID, authToken]);

  useEffect(() => {
    if (!housekeeperID) return;

    setLoading(true);

    // Step 2: Fetch Schedule Data
    fetch(`http://localhost:5280/api/Schedule/GetSchedulesByHousekeeper?housekeeperId=${housekeeperID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setSchedules(data);
        } else {
          setSchedules([]);
          setError("Không có lịch trình nào được tìm thấy.");
        }
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu lịch trình:", err);
        setError("Lỗi khi lấy dữ liệu lịch trình.");
      })
      .finally(() => setLoading(false));
  }, [housekeeperID, authToken]);

  return (
    <div className="container mt-4">
      <h2 className="fw-bold">Quản lý lịch trình</h2>

      {loading && <p className="text-muted">Đang tải dữ liệu...</p>}
      {error && <p className="text-danger">{error}</p>}

      {!loading && !error && schedules.length === 0 && (
        <p className="text-muted">Chưa có lịch trình nào.</p>
      )}

      {!loading && schedules.length > 0 && (
        <ul className="list-group mt-3">
          {schedules.map((schedule, index) => (
            <li key={index} className="list-group-item">
              <strong>{schedule.date}</strong> - {schedule.time}: {schedule.task}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HousekeeperScheduleManagement;
