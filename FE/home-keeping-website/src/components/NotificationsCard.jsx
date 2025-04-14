import React, { useEffect, useState } from "react";
import { FaBell, FaClock } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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
        `${API_BASE_URL}/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=1&pageSize=1000`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();

      // Sort and deduplicate by message
      const sorted = (data || []).sort(
        (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
      );

      const seenMessages = new Set();
      const deduplicated = sorted.filter(noti => {
        if (seenMessages.has(noti.message)) return false;
        seenMessages.add(noti.message);
        return true;
      });

      setNotifications(deduplicated);
    } catch (error) {
      console.error("Lỗi khi lấy thông báo:", error);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/IsRead?id=${id}`,
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
    <div className="card shadow-sm border-0 p-4 h-100">
      <h5 className="fw-bold mb-3 d-flex align-items-center">
        <FaBell className="text-warning me-2" />
        Thông báo
      </h5>

      {loading ? (
        <p className="text-muted text-center">Đang tải...</p>
      ) : notifications.length === 0 ? (
        <p className="text-muted text-center">Không có thông báo mới.</p>
      ) : (
        <div style={{ maxHeight: "220px", overflowY: "auto" }}>
          <ul className="list-group list-group-flush small">
            {notifications.map((noti) => (
              <li
                key={noti.notificationsID}
                className={`list-group-item px-3 py-3 rounded-2 mb-2 shadow-sm border ${noti.isRead ? "bg-white" : "bg-light"}`}
              >
                <div className="d-flex justify-content-between align-items-start">
                  <div className="me-2">
                    <FaBell className="text-warning mt-1" />
                  </div>

                  <div className="flex-grow-1">
                    <div className="d-flex justify-content-between align-items-start mb-1">
                      <span className="text-break fw-semibold">{noti.message}</span>
                      <span
                        className={`badge rounded-pill ms-2 px-2 py-1 ${noti.isRead ? "bg-secondary text-white" : "bg-warning text-dark"}`}
                        style={{ cursor: noti.isRead ? "default" : "pointer", fontSize: "0.75rem" }}
                        onClick={() => !noti.isRead && markAsRead(noti.notificationsID)}
                      >
                        {noti.isRead ? "Đã đọc" : "Chưa đọc"}
                      </span>
                    </div>

                    <small className="text-muted d-flex align-items-center">
                      <FaClock className="me-1" />
                      {new Date(noti.createdDate).toLocaleString("vi-VN")}
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
