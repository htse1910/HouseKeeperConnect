import React, { useEffect, useState } from "react";
import { FaBell, FaClock } from "react-icons/fa";

const NotificationsCard = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    fetchNotifications();
  }, [accountID, authToken]);

  const fetchNotifications = async () => {
    if (!accountID || !authToken) return;

    try {
      const response = await fetch(
        `http://localhost:5280/api/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=1&pageSize=5`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "text/plain",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();

      const sortedData = (data || []).sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      setNotifications(sortedData);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:5280/api/Notification/IsRead?id=${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );

      if (response.ok) {
        setNotifications((prev) =>
          prev.map((noti) =>
            noti.notificationsID === id ? { ...noti, isRead: true } : noti
          )
        );
      } else {
        console.error("Failed to mark notification as read");
      }
    } catch (err) {
      console.error("Lỗi khi đánh dấu đã đọc:", err);
    }
  };

  return (
    <div className="card p-4 shadow-sm h-100">
      <h5 className="fw-semibold mb-3">Thông báo</h5>

      {loading ? (
        <p className="text-muted text-center">Đang tải...</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted text-center">Không có thông báo mới.</p>
      ) : (
        <div style={{ maxHeight: "200px", overflowY: "auto" }}>
          <ul className="list-group list-group-flush small">
            {notifications.map((noti) => (
              <li
                key={noti.notificationsID}
                className={`list-group-item px-2 py-2 ${noti.isRead ? "" : "bg-light"}`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2">
                    <FaBell className="text-warning me-2" />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start">
                      <span className="text-break">{noti.message}</span>
                      <span
                        className={`badge ms-2 ${noti.isRead ? "bg-secondary" : "bg-warning text-dark"
                          }`}
                        style={{ cursor: noti.isRead ? "default" : "pointer" }}
                        onClick={() => !noti.isRead && markAsRead(noti.notificationsID)}
                      >
                        {noti.isRead ? "Đã đọc" : "Chưa đọc"}
                      </span>
                    </div>
                    <small className="text-muted d-flex align-items-center mt-1">
                      <FaClock className="me-1" />
                      {new Date(noti.createdDate).toLocaleString()}
                    </small>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationsCard;
