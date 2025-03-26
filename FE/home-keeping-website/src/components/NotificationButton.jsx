import React, { useState, useEffect } from "react";
import { FaEnvelope } from "react-icons/fa";

const NotificationButton = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `http://localhost:5280/api/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=1&pageSize=7`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      if (!response.ok) throw new Error("Failed to fetch notifications");

      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter((n) => !n.isRead).length);
    } catch (error) {
      console.error("Notification fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const toggleDropdown = async () => {
    setShowDropdown(!showDropdown);
    if (!showDropdown) await fetchNotifications();
  };

  const markAsRead = async (id) => {
    try {
      await fetch(
        `http://localhost:5280/api/Notification/IsRead?id=${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      setNotifications((prev) =>
        prev.map((n) =>
          n.notificationsID === id ? { ...n, isRead: true } : n
        )
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  return (
    <div className="notification-wrapper position-relative mx-2">
      <button
        className="btn btn-light position-relative"
        title="Notifications"
        onClick={toggleDropdown}
        style={{
          borderRadius: "50%",
          padding: "8px 10px",
          border: "1px solid #ccc",
        }}
      >
        <FaEnvelope size={16} />
        {unreadCount > 0 && (
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: "0.6rem" }}>
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="card shadow-sm position-absolute end-0 mt-2" style={{ width: "300px", maxHeight: "400px", overflowY: "auto", zIndex: 999 }}>
          <div className="card-body">
            <h6 className="card-title mb-2">Notifications</h6>
            {notifications.length === 0 ? (
              <p className="text-muted">No notifications</p>
            ) : (
              notifications
                .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
                .map((notification) => (
                  <div key={notification.notificationsID} className="mb-3">
                    <div className="small">{notification.message}</div>
                    <div className="d-flex justify-content-between align-items-center">
                      <small className="text-muted">
                        {new Date(notification.createdDate).toLocaleString()}
                      </small>
                      {notification.isRead ? (
                        <span className="badge bg-secondary">Read</span>
                      ) : (
                        <button
                          className="badge bg-warning border-0"
                          onClick={() => markAsRead(notification.notificationsID)}
                        >
                          Unread
                        </button>
                      )}
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationButton;
