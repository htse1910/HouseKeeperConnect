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
      setNotifications(data || []);
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
        // Update the local state without refetching
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
        <ul className="list-group list-group-flush">
          {notifications.map((noti) => (
            <li
              key={noti.notificationsID}
              className={`list-group-item d-flex align-items-start ${
                noti.isRead ? "" : "bg-light"
              }`}
            >
              <div className="me-3">
                <FaBell className="text-warning mt-1" />
              </div>

              <div className="flex-grow-1">
                <div className="fw-semibold mb-1 d-flex justify-content-between align-items-center">
                  <span>{noti.message}</span>
                  {!noti.isRead && (
                    <div className="d-flex align-items-center gap-2">
                      <span className="badge bg-primary">Chưa đọc</span>
                      <button
                        className="btn btn-sm btn-outline-success"
                        onClick={() => markAsRead(noti.notificationsID)}
                      >
                        Đánh dấu đã đọc
                      </button>
                    </div>
                  )}
                </div>
                <small className="text-muted">
                  <FaClock className="me-1" />
                  {new Date(noti.createdDate).toLocaleString()}
                </small>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationsCard;
