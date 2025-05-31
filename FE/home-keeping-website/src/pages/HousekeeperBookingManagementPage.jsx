import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaClock,
  FaCheckCircle,
  FaInfoCircle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Modal } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
// import { serviceMap } from "../utils/serviceMap";
import useServiceMap from "../utils/useServiceMap";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip } from "bootstrap";

const dayNames = ["Chủ Nhật", "Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy"];
const slotMap = {
  1: "8H - 9H",
  2: "9H - 10H",
  3: "10H - 11H",
  4: "11H - 12H",
  5: "12H - 13H",
  6: "13H - 14H",
  7: "14H - 15H",
  8: "15H - 16H",
  9: "16H - 17H",
  10: "17H - 18H",
  11: "18H - 19H",
  12: "19H - 20H",
};

const HousekeeperBookingManagementPage = () => {
  // const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountID = localStorage.getItem("accountID");
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [matchedDate, setMatchedDate] = useState(null);
  const [isToday, setIsToday] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingCount, setBookingCount] = useState(null);
  const pageSize = 5;
  const [allBookings, setAllBookings] = useState([]);

  const paginatedBookings = allBookings;

  const totalPages = Math.ceil(bookingCount / pageSize);
  const serviceMap = useServiceMap();
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);
  const [jobToCancel, setJobToCancel] = useState(null);
  const [hoveredTooltipIndex, setHoveredTooltipIndex] = useState(null);

  const handleMarkComplete = async (jobID) => {
    if (!authToken || !accountID) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const res = await fetch(`${API_BASE_URL}/Job/HousekeeperCompleteJob?jobId=${jobID}&accountID=${accountID}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      const msg = await res.text();
      if (res.ok) {
        toast.success(msg || "✅ Đã báo hoàn thành công việc!");
        setAllBookings(prev =>
          prev.map(row =>
            row.jobID === jobID ? { ...row, status: 6 } : row
          )
        );
      } else {
        toast.error(msg || "❌ Không thể hoàn thành công việc.");
      }
    } catch (err) {
      toast.error("Lỗi khi gọi API.");
      console.error(err);
    }
  };

  const getVNDate = (date = new Date()) => {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: "Asia/Ho_Chi_Minh",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
      .formatToParts(date)
      .reduce((acc, part) => {
        if (part.type === "year") acc.year = part.value;
        if (part.type === "month") acc.month = part.value;
        if (part.type === "day") acc.day = part.value;
        return acc;
      }, {});
    return new Date(`${parts.year}-${parts.month}-${parts.day}`);
  };

  const openDayModal = (booking, dayIndex) => {
    const start = new Date(booking.startDate.split("/").reverse().join("-"));
    const end = new Date(booking.endDate.split("/").reverse().join("-"));
    const todayVN = getVNDate();
    const currentVNDay = todayVN.getDay();

    const diff = dayIndex - currentVNDay;
    const matched = new Date(todayVN);
    matched.setDate(todayVN.getDate() + diff);
    const normalizeDate = (date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const startNorm = normalizeDate(start);
    const endNorm = normalizeDate(end);
    const matchedNorm = normalizeDate(matched);

    console.log("▶️ start:", start);
    console.log("▶️ end:", end);
    console.log("▶️ todayVN:", todayVN);
    console.log("▶️ matched:", matched);
    console.log("▶️ selected day index:", dayIndex);

    if (matchedNorm >= startNorm && matchedNorm <= endNorm) {
      const isSameDate = todayVN.toDateString() === matched.toDateString();
      console.log("✅ Show modal. isToday:", isSameDate);

      setSelectedBooking(booking);
      setSelectedDay(dayNames[dayIndex]);
      setMatchedDate(matched);
      setIsToday(isSameDate);
      setShowModal(true);
    } else {
      toast.warn("❌ Ngày này không nằm trong phạm vi công việc.");
    }
  };

  const handleCheckIn = async () => {
    if (!selectedBooking) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/CheckIn?bookingId=${selectedBooking.bookingID}`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${authToken}` }
        }
      );

      const text = await res.text();

      if (res.ok) {
        toast.success(text || "✅ Check-in thành công!");
        setShowModal(false);
      } else {
        toast.error(text || "❌ Không thể check-in.");
      }
    } catch (err) {
      toast.error("❌ Lỗi khi check-in.");
      console.error(err);
    }
  };

  const fetchBookingsByPage = async (page) => {
    if (!authToken || !housekeeperID) return;

    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE_URL}/Booking/GetBookingByHousekeeperID?housekeeperId=${housekeeperID}&pageNumber=${page}&pageSize=${pageSize}`,
        {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        }
      );
      const data = await res.json();
      setAllBookings(data);
    } catch (error) {
      toast.error("❌ Lỗi khi tải công việc.");
      console.error("Fetch failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookingCount = async () => {
    if (!authToken || !accountID) return;

    try {
      const res = await fetch(
        `${API_BASE_URL}/Booking/CountBookingsByHousekeeperID?accountID=${accountID}`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const total = await res.json();
      setBookingCount(total);
    } catch (error) {
      console.error("Failed to fetch booking count:", error);
    }
  };

  const getJobStatusText = (status) => {
    switch (status) {
      case 1: return "🕐 Đang chờ duyệt";
      case 2: return "📋 Đã duyệt";
      case 3: return "✔️ Đã nhận";
      case 4: return "✅ Hoàn thành";
      case 5: return "⌛ Đã hết hạn";
      case 6: return "❌ Đã hủy";
      case 7: return "🚫 Không được phép";
      case 8: return "⏳ Chờ gia đình xác nhận";
      case 9: return "🚪 Bạn đã bỏ việc";
      default: return "Không rõ";
    }
  };

  useEffect(() => {
    fetchBookingCount();
  }, [housekeeperID, authToken]);

  useEffect(() => {
    fetchBookingsByPage(currentPage);
  }, [currentPage]);

  useEffect(() => {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((el) => new Tooltip(el));

    // Optional: style tooltip box globally
    const tooltipStyle = document.createElement("style");
    tooltipStyle.innerHTML = `
    .tooltip.show {
      background-color: #0dcaf0 !important;
      color: #fff !important;
      border-radius: 6px;
      box-shadow: 0 0 10px rgba(13, 202, 240, 0.8);
      font-size: 0.875rem;
      padding: 6px 12px;
      transition: box-shadow 0.3s ease;
    }

    .tooltip.show:hover {
      box-shadow: 0 0 14px rgba(13, 202, 240, 1);
    }

    .tooltip .tooltip-inner {
      background-color: transparent !important;
    }
  `;
    document.head.appendChild(tooltipStyle);
  }, []);

  // Inside the component, before return:
  const handleForceAbandon = async (jobID) => {
    if (!authToken || !accountID) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }

    const url = `${API_BASE_URL}/Job/ForceAbandonJobAndReassign?jobId=${jobID}&accountID=${accountID}`;

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
          "Content-Type": "application/json"
        }
      });

      // Response received, but might be 404
      const text = await res.text();

      if (!res.ok) {
        toast.error(`❌ ${text || "Không thể huỷ công việc."}`);
        return;
      }

      let result;
      try {
        result = JSON.parse(text);
      } catch {
        result = { message: text };
      }

      let toastMsg = `✅ ${result.message}`;
      if (result.newPrice) {
        toastMsg += `\n🔁 Giá tiền cho công việc mới tạo lại: ${result.newPrice.toLocaleString()} VND`;
      }

      toast.success(toastMsg);
      setAllBookings(prev => prev.filter(row => row.jobID !== jobID));
    } catch (err) {
      console.error("❌ Fetch failed:", err);
      toast.error("❌ Lỗi khi gọi API.");
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="fw-bold text-primary mb-0">
            📋 Danh sách công việc đã nhận
            {bookingCount !== null && (
              <span className="badge bg-info ms-2">
                Tổng số: {bookingCount}
              </span>
            )}
          </h4>
        </div>
        <div>
          <button
            className="btn btn-outline-primary"
            onClick={() => window.location.href = "/housekeeper-schedule"}
          >
            🗓️ Xem Lịch Làm Việc
          </button>
        </div>
      </div>
      {loading ? (
        <p className="text-muted">⏳ Đang tải dữ liệu...</p>
      ) : (
        <>
          <div className="d-flex justify-content-end align-items-center mb-3">
            <div className="text-muted small">
              Trang {currentPage} / {totalPages}
            </div>
          </div>

          {paginatedBookings.length === 0 ? (
            <p className="text-muted">Không có công việc nào được đặt.</p>
          ) : (
            <>
              <div className="row g-3">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentPage}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                  >
                    {paginatedBookings.map((row, idx) => (
                      // ⬅️ You already have this job card block
                      <div className="col-12" key={idx}>
                        {/* Job card rendering... */}
                        <div className="col-12" key={idx}>
                          <div className="card shadow-sm border-0 rounded-3 p-2 mb-4">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <h6 className="fw-bold mb-0">
                                <FaBriefcase className="me-2 text-warning" />
                                {row.jobName}
                              </h6>
                              <span className="text-muted small">#{row.bookingID}</span>
                            </div>

                            <div className="mb-1 text-muted small d-flex align-items-center">
                              <FaUser className="me-1" />
                              <span className="me-1"><strong>Gia đình:</strong></span> {row.familyname}
                            </div>

                            <div className="d-flex flex-wrap mb-1">
                              <div className="small me-3 d-flex align-items-center">
                                <FaMapMarkerAlt className="me-1 text-danger" />
                                <strong>Địa điểm:</strong> {row.location}
                              </div>
                              <div className="small d-flex align-items-center">
                                <FaMoneyBillWave className="me-1 text-success" />
                                <strong>Lương:</strong> {row.totalPrice.toLocaleString("vi-VN")} VNĐ
                              </div>
                            </div>

                            <div className="d-flex flex-wrap mb-1">
                              <div className="small me-3 d-flex align-items-center">
                                <FaCalendarAlt className="me-1 text-primary" />
                                <strong>Bắt đầu:</strong> {new Date(row.startDate).toLocaleDateString("vi-VN")}
                              </div>
                              <div className="small d-flex align-items-center">
                                <FaCalendarAlt className="me-1 text-danger" />
                                <strong>Kết thúc:</strong> {new Date(row.endDate).toLocaleDateString("vi-VN")}
                              </div>
                            </div>

                            <div className="mb-1 small d-flex align-items-center">
                              <FaFileAlt className="me-1 text-secondary" />
                              <strong>Mô tả:</strong> {row.description}
                            </div>

                            <div className="mb-1 small d-flex align-items-center">
                              <FaCheckCircle className="me-1 text-success" />
                              <strong>Trạng thái công việc:</strong> {getJobStatusText(row.jobStatus)}
                            </div>

                            <div className="d-flex flex-wrap">
                              <div className="col-12 col-md-4 small">
                                <strong>
                                  <FaClock className="me-1 text-info" />Ca làm việc:
                                </strong>
                                <ul className="ps-3 mb-0">
                                  {row.slotIDs?.map((s, i) => (
                                    <li key={i} className="text-info">{slotMap[s] || `Slot ${s}`}</li>
                                  ))}
                                </ul>
                              </div>
                              <div className="col-12 col-md-4 small">
                                <div style={{ display: "inline-block", position: "relative" }}>
                                  <FaCalendarAlt className="me-1 text-primary" /> Thứ (Check-in ở dưới):

                                </div>
                                <ul className="ps-3 mb-0">
                                  {row.dayofWeek?.map((dayIndex, i) => (
                                    <li
                                      key={i}
                                      className="text-warning"
                                      style={{ cursor: "pointer", textDecoration: "underline" }}
                                      onClick={() => openDayModal(row, dayIndex)}
                                    >
                                      {dayNames[dayIndex]}
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div className="col-12 col-md-4 small">
                                <strong>🛎️ Dịch vụ:</strong>
                                <ul className="ps-3 mb-0">
                                  {row.serviceIDs?.map((s, i) => (
                                    <li key={i} className="text-success">{serviceMap[s]}</li>
                                  ))}
                                </ul>
                              </div>
                            </div>

                            <div className="text-end mt-2">
                              <div className="d-flex justify-content-between align-items-center mt-2">
                                <div>
                                  {row.jobStatus === 3 &&
                                    row.status !== 6 &&
                                    getVNDate() >= new Date(row.endDate.split("/").reverse().join("-")) ? (
                                    <button
                                      className="btn btn-sm btn-success rounded-pill fw-bold me-2"
                                      onClick={() => handleMarkComplete(row.jobID)}
                                    >
                                      <FaCheckCircle className="me-1" />
                                      Báo hoàn thành
                                    </button>
                                  ) : row.status === 4 && row.jobStatus !== 6 ? (
                                    <span className="badge bg-success px-3 py-2 rounded-pill">
                                      Đã hoàn thành ✅
                                    </span>
                                  ) : row.status === 2 ? (
                                    <span className="badge bg-secondary px-3 py-2 rounded-pill">
                                      Đang thực hiện
                                    </span>
                                  ) : row.jobStatus === 3 &&
                                    (() => {
                                      const todayVN = new Date().toLocaleDateString("vi-VN");
                                      return todayVN >= row.startDate && todayVN <= row.endDate;
                                    })() ? (
                                    <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                                      Chưa tới ngày xác nhận
                                    </span>
                                  ) : null}
                                </div>
                                <div>
                                  {row.jobStatus === 3 && (
                                    <button
                                      className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
                                      onClick={() => {
                                        setJobToCancel(row.jobID);
                                        setShowCancelConfirm(true);
                                      }}
                                    >
                                      🛑 Huỷ việc
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                </AnimatePresence>
              </div>

              {totalPages > 1 && (
                <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    ⬅️ Trước
                  </button>

                  <input
                    type="number"
                    min="1"
                    max={totalPages}
                    value={currentPage}
                    onChange={(e) => {
                      const page = parseInt(e.target.value, 10);
                      if (!isNaN(page) && page >= 1 && page <= totalPages) {
                        setCurrentPage(page);
                      }
                    }}
                    className="form-control form-control-sm text-center"
                    style={{ width: "60px" }}
                  />

                  <span className="small">/ {totalPages}</span>

                  <button
                    className="btn btn-sm btn-outline-primary"
                    onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Sau ➡️
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}

      {/* Modal */}
      {selectedBooking && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thông tin ca làm việc</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Gia đình:</strong> {selectedBooking.familyName}</p>
            <p><strong>Bắt đầu:</strong> {selectedBooking.startDate}</p>
            <p><strong>Kết thúc:</strong> {selectedBooking.endDate}</p>
            <p><strong>Thứ:</strong> {selectedDay}</p>
            <p><strong>Ngày trong tuần này:</strong> {matchedDate?.toLocaleDateString("vi-VN")}</p>

            {isToday && (
              <div className="text-center mt-3">
                <button className="btn btn-success" onClick={handleCheckIn}>
                  ✅ Check In
                </button>
              </div>
            )}
          </Modal.Body>
          <Modal.Footer>
            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Đóng</button>
          </Modal.Footer>
        </Modal>
      )}
      <Modal show={showCancelConfirm} onHide={() => setShowCancelConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận huỷ công việc</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn huỷ công việc này? Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <button className="btn btn-secondary" onClick={() => setShowCancelConfirm(false)}>
            Không
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              handleForceAbandon(jobToCancel);
              setShowCancelConfirm(false);
            }}
          >
            Đồng ý huỷ
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default HousekeeperBookingManagementPage;
