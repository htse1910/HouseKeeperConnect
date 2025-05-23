import React, { useEffect, useState } from "react";
import axios from "axios";
import "../assets/styles/timetable.css";
import API_BASE_URL from "../config/apiConfig";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const slots = [
    { id: 1, label: "8H - 9H" },
    { id: 2, label: "9H - 10H" },
    { id: 3, label: "10H - 11H" },
    { id: 4, label: "11H - 12H" },
    { id: 5, label: "12H - 13H" },
    { id: 6, label: "13H - 14H" },
    { id: 7, label: "14H - 15H" },
    { id: 8, label: "15H - 16H" },
    { id: 9, label: "16H - 17H" },
    { id: 10, label: "17H - 18H" },
    { id: 11, label: "18H - 19H" },
    { id: 12, label: "19H - 20H" },
];

const HousekeeperSchedulePage = () => {
    const [bookingMap, setBookingMap] = useState({});
    const [weekDates, setWeekDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedSlot, setSelectedSlot] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const accountID = localStorage.getItem("accountID");
        const token = localStorage.getItem("authToken");

        const getSundayOfWeek = (date) => {
            const d = new Date(date);
            const day = d.getDay();
            d.setDate(d.getDate() - day);
            return d;
        };

        const formatDate = (date) =>
            `${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}-${date.getFullYear()}`;

        const sunday = getSundayOfWeek(selectedDate);
        const dateInWeek = formatDate(sunday);

        const fetchSchedule = async () => {
            setLoading(true);
            try {
                const res = await axios.get(
                    `${API_BASE_URL}/Booking_Slots/GetBookingSlotsForHousekeeperByWeekAsync?accountID=${accountID}&dateInWeek=${dateInWeek}`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );

                const map = {};
                res.data.forEach((slot) => {
                    const row = slot.slotID;
                    const dateKey = new Date(slot.date).toDateString();
                    if (!map[row]) map[row] = {};
                    map[row][dateKey] = slot;
                });

                setBookingMap(map);
            } catch (err) {
                if (
                    err.response &&
                    err.response.status === 404 &&
                    err.response.data === "không tìm thấy Slot làm việc trong tuần này!"
                ) {
                    setBookingMap({});
                } else {
                    console.error("Failed to fetch schedule:", err);
                }
            } finally {
                setLoading(false);
            }
        };

        const getWeekDates = (sunday) => {
            const dates = [];
            for (let i = 0; i < 7; i++) {
                const d = new Date(sunday);
                d.setDate(sunday.getDate() + i);
                dates.push(d);
            }
            return dates;
        };

        const weekDateList = getWeekDates(sunday);
        setWeekDates(weekDateList);
        fetchSchedule();
    }, [selectedDate]);

    const handleCheckIn = async () => {
        if (!selectedSlot) return;
        const token = localStorage.getItem("authToken");

        try {
            const res = await axios.post(
                `${API_BASE_URL}/Job/CheckIn?bookingId=${selectedSlot.bookingID}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success(res.data || "✅ Check-in thành công!");

            // Give the toast a moment to show before reload
            setTimeout(() => {
                window.location.reload();
            }, 1500);
        } catch (err) {
            let msg = "❌ Lỗi khi check-in.";
            if (err.response?.data) {
                if (typeof err.response.data === "string") {
                    msg = err.response.data;
                } else if (typeof err.response.data === "object" && err.response.data.message) {
                    msg = err.response.data.message;
                }
            }
            toast.error(msg);
            console.error(err);
        }
    };

    return (
        <div className="container py-4">
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
            />
            <h4 className="fw-bold text-primary mb-4">🗓️ Lịch Làm Việc của Bạn</h4>

            <div className="mb-3">
                <div className="d-flex align-items-center gap-2 mb-3">
                    <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                            const prevWeek = new Date(selectedDate);
                            prevWeek.setDate(prevWeek.getDate() - 7);
                            setSelectedDate(prevWeek);
                        }}
                    >
                        ← Tuần trước
                    </button>

                    <input
                        type="date"
                        className="form-control"
                        value={selectedDate.toISOString().split("T")[0]}
                        onChange={(e) => setSelectedDate(new Date(e.target.value))}
                        style={{ maxWidth: "200px" }}
                    />

                    <button
                        className="btn btn-outline-primary"
                        onClick={() => {
                            const nextWeek = new Date(selectedDate);
                            nextWeek.setDate(nextWeek.getDate() + 7);
                            setSelectedDate(nextWeek);
                        }}
                    >
                        Tuần sau →
                    </button>
                </div>
            </div>

            <div className="table-responsive">
                {loading ? (
                    <div className="text-center my-5">
                        <div className="spinner-border text-primary" role="status" />
                        <p className="mt-2">Đang tải dữ liệu lịch làm việc...</p>
                    </div>
                ) : (
                    <table className="table table-bordered text-center align-middle">
                        <thead className="table-light">
                            <tr>
                                <th className="slot-label-cell">
                                    <div className="slot-label-text">Slot</div>
                                    <div className="weekday-label-text">Thứ</div>
                                </th>
                                {weekDates.map((date, idx) => {
                                    const dayIndex = date.getDay();
                                    const dayNameMap = [
                                        "Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"
                                    ];
                                    return (
                                        <th key={idx}>
                                            <div className="fw-bold">{dayNameMap[dayIndex]}</div>
                                            <div className="small text-muted">
                                                {date.toLocaleDateString("vi-VN", {
                                                    day: "2-digit",
                                                    month: "2-digit",
                                                })}
                                            </div>
                                        </th>
                                    );
                                })}
                            </tr>
                        </thead>
                        <tbody>
                            {slots.map((slot) => (
                                <tr key={slot.id}>
                                    <td>
                                        <div><strong>{slot.label}</strong></div>
                                    </td>
                                    {weekDates.map((date, colIdx) => {
                                        const dateKey = date.toDateString();
                                        const slotData = bookingMap[slot.id]?.[dateKey];

                                        return (
                                            <td
                                                key={colIdx}
                                                style={{
                                                    backgroundColor: slotData ? "#007bff" : "#ffffff",
                                                    color: slotData ? "#ffffff" : "#000000",
                                                    cursor: slotData ? "pointer" : "default",
                                                }}
                                                onClick={() => slotData && setSelectedSlot(slotData)}
                                            >
                                                {slotData ? (
                                                    <div className="fw-semibold text-decoration-underline">
                                                        {slotData.jobName ?? "Không rõ"}
                                                    </div>
                                                ) : (
                                                    <span className="text-muted">--</span>
                                                )}
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Inline Modal */}
            {selectedSlot && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{ backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1050 }}
                    onClick={() => setSelectedSlot(null)}
                >
                    <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-content rounded-4 border-0">
                            <div className="modal-header border-0">
                                <h5 className="modal-title">Thông tin ca làm</h5>
                                <button type="button" className="btn-close" onClick={() => setSelectedSlot(null)}></button>
                            </div>
                            <div className="modal-body">
                                <p><strong>Tên công việc:</strong> {selectedSlot.jobName ?? "Không rõ"}</p>
                                <p><strong>👤 Đã Check-in:</strong> {selectedSlot.isCheckedIn ? "✅ Có" : "❌ Chưa"}</p>
                                <p><strong>👪 Gia đình xác nhận:</strong> {selectedSlot.isConfirmedByFamily ? "✅ Có" : "❌ Chưa"}</p>
                                {selectedSlot.checkInTime && (
                                    <p><strong>⏱ Thời gian check-in:</strong> {new Date(selectedSlot.checkInTime).toLocaleString("vi-VN")}</p>
                                )}
                                {selectedSlot.confirmedAt && (
                                    <p><strong>📬 Xác nhận lúc:</strong> {new Date(selectedSlot.confirmedAt).toLocaleString("vi-VN")}</p>
                                )}

                                {!selectedSlot.isCheckedIn && (
                                    <div className="text-center mt-3">
                                        <button className="btn btn-success" onClick={handleCheckIn}>
                                            ✅ Check In
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default HousekeeperSchedulePage;
