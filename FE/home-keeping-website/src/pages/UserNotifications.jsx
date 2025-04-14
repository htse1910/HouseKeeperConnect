import React, { useState, useEffect } from "react";
import { FaBell, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import ScrollToTopButton from "../components/ScrollToTopButton";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const UserNotifications = () => {
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const [notifications, setNotifications] = useState([]);
    const [page, setPage] = useState(1);
    const [hasNextPage, setHasNextPage] = useState(false);
    const [loading, setLoading] = useState(true);

    const pageSize = 10;

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `${API_BASE_URL}/Notification/GetNotificationByUserID?id=${accountID}&pageNumber=${page}&pageSize=${pageSize}`,
                {
                    headers: { Authorization: `Bearer ${authToken}` },
                }
            );
            const data = await response.json();
            // ✅ Sort newest to oldest
            const sorted = [...data].sort(
                (a, b) => new Date(b.createdDate) - new Date(a.createdDate)
            );
            setNotifications(sorted);
            setHasNextPage(data.length === pageSize);
        } catch (err) {
            console.error("Failed to load notifications:", err);
            setNotifications([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [page]);

    const markAsRead = async (id) => {
        try {
            await fetch(`${API_BASE_URL}/Notification/IsRead?id=${id}`, {
                method: "PUT",
                headers: { Authorization: `Bearer ${authToken}` },
            });
            setNotifications((prev) =>
                prev.map((n) =>
                    n.notificationsID === id ? { ...n, isRead: true } : n
                )
            );
        } catch (err) {
            console.error("Error marking notification as read:", err);
        }
    };

    return (
        <div className="container py-5" style={{ maxWidth: "800px" }}>
            <ScrollToTopButton />
            <div className="card shadow-sm border-0 p-4 rounded-4">
                <h3 className="fw-bold mb-4 text-primary d-flex align-items-center">
                    <FaBell className="me-2" />
                    Tất cả thông báo
                </h3>

                {loading ? (
                    <p className="text-muted">⏳ Đang tải...</p>
                ) : notifications.length === 0 ? (
                    <div className="alert alert-info">Bạn không có thông báo nào.</div>
                ) : (
                    <div className="list-group list-group-flush">
                        {notifications.map((n) => (
                            <div
                                key={n.notificationsID}
                                className="list-group-item py-3 px-0 border-bottom"
                            >
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="me-3">
                                        <div className="fw-semibold mb-1">{n.message}</div>
                                        <small className="text-muted">
                                            {new Date(n.createdDate).toLocaleString()}
                                        </small>
                                    </div>
                                    <div className="text-end">
                                        {n.isRead ? (
                                            <span className="badge bg-secondary">Đã đọc</span>
                                        ) : (
                                            <button
                                                className="btn btn-sm btn-warning text-white rounded-pill"
                                                onClick={() => markAsRead(n.notificationsID)}
                                            >
                                                Đánh dấu đã đọc
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination Controls */}
                <div className="d-flex justify-content-between align-items-center mt-4">
                    <button
                        className="btn btn-outline-secondary rounded-pill px-4"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        <FaChevronLeft className="me-2" />
                        Trước
                    </button>
                    <span className="text-muted">Trang {page}</span>
                    <button
                        className="btn btn-outline-primary rounded-pill px-4"
                        disabled={!hasNextPage}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Sau
                        <FaChevronRight className="ms-2" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default UserNotifications;
