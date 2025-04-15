import React, { useState, useEffect } from "react";
import { FaBell } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Modal, Button } from "react-bootstrap";
import API_BASE_URL from "../config/apiConfig";

const NotificationButton = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=1&pageSize=10`,
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

  const markAsRead = async (id) => {
    try {
      await fetch(`${API_BASE_URL}/Notification/IsRead?id=${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
      });

      setNotifications((prev) =>
        prev.map((n) => (n.notificationsID === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((prev) => Math.max(prev - 1, 0));
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const handleOpen = async () => {
    setShowModal(true);
    await fetchNotifications();

    setTimeout(() => {
      const unread = notifications.filter((n) => !n.isRead);
      unread.forEach((n) => markAsRead(n.notificationsID));
    }, 2500);
  };

  return (
    <>
      <div className="position-relative mx-2">
        <button
          className="btn btn-light position-relative rounded-circle border"
          title="Notifications"
          onClick={handleOpen}
        >
          <FaBell size={16} />
          {unreadCount > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {unreadCount}
            </span>
          )}
        </button>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName="modal-lg modal-dialog-scrollable"
      >
        <Modal.Header closeButton className="py-2 px-3">
          <Modal.Title className="fs-6">🔔 Notifications</Modal.Title>
        </Modal.Header>

        <Modal.Body className="px-3 py-2">
          {notifications.length === 0 ? (
            <p className="text-muted small text-center m-0">No notifications</p>
          ) : (
            notifications
              .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))
              .map((notification) => (
                <div key={notification.notificationsID} className="border-bottom py-2">
                  <div className="small mb-1">{notification.message}</div>
                  <div className="d-flex justify-content-between align-items-center">
                    <small className="text-muted">
                      {new Date(notification.createdDate).toLocaleString()}
                    </small>
                    <span
                      className={`badge ${notification.isRead ? "bg-secondary" : "bg-warning text-dark"
                        }`}
                    >
                      {notification.isRead ? "Read" : "Unread"}
                    </span>
                  </div>
                </div>
              ))
          )}
        </Modal.Body>

        <Modal.Footer className="py-2 px-3">
          <Button
            variant="outline-primary"
            size="sm"
            className="rounded-pill"
            onClick={() => {
              setShowModal(false);
              navigate("/account/notifications");
            }}
          >
            🔗 Xem tất cả
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default NotificationButton;
