import React, { useEffect, useState } from "react";
import {
  FaMoneyBillWave,
  FaMapMarkerAlt,
  FaBriefcase,
  FaUser,
  FaCalendarAlt,
  FaFileAlt,
  FaClock,
  FaCheckCircle
} from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import { Modal } from "react-bootstrap";
import "react-toastify/dist/ReactToastify.css";
import { serviceMap } from "../utils/serviceMap";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const accountID = localStorage.getItem("accountID");
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  const [showModal, setShowModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [selectedDay, setSelectedDay] = useState("");
  const [matchedDate, setMatchedDate] = useState(null);
  const [isToday, setIsToday] = useState(false);

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
        setRows(prev =>
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
      console.warn("❌ Ngày này không nằm trong phạm vi công việc.");
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

      const msg = await res.text();

      if (res.ok) {
        toast.success(msg || "✅ Check-in thành công!");
        setShowModal(false);
      } else {
        toast.error(msg || "❌ Không thể check-in.");
      }
    } catch (err) {
      toast.error("Lỗi khi check-in.");
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/Booking/GetBookingByHousekeeperID?housekeeperId=${housekeeperID}`, {
          headers: { Authorization: `Bearer ${authToken}` }
        });
        const bookingData = await res.json();

        const fullRows = await Promise.all(
          bookingData.map(async (booking) => {
            let jobDetail = null;
            let familyName = "Đang cập nhật";

            try {
              const jobRes = await fetch(`${API_BASE_URL}/Job/GetJobDetailByID?id=${booking.jobID}`, {
                headers: { Authorization: `Bearer ${authToken}` }
              });
              jobDetail = await jobRes.json();

              const familyRes = await fetch(`${API_BASE_URL}/Families/GetFamilyByID?id=${jobDetail.familyID}`, {
                headers: { Authorization: `Bearer ${authToken}` }
              });
              const familyData = await familyRes.json();

              const accountRes = await fetch(`${API_BASE_URL}/Account/GetAccount?id=${familyData.accountID}`, {
                headers: { Authorization: `Bearer ${authToken}` }
              });
              const accountData = await accountRes.json();

              familyName = accountData.name;
            } catch (error) {
              console.warn("Some data missing", error);
            }

            return {
              jobID: booking.jobID,
              bookingID: booking.bookingID,
              jobName: jobDetail?.jobName || "Đang cập nhật",
              familyName,
              status: booking.status,
              jobStatus: jobDetail?.status ?? null, // ⬅️ Add this line
              location: jobDetail?.location || "Đang cập nhật",
              price: jobDetail?.price ? `${jobDetail.price.toLocaleString()} VND` : "Đang cập nhật",
              startDate: jobDetail?.startDate ? new Date(jobDetail.startDate).toLocaleDateString("vi-VN") : "Đang cập nhật",
              endDate: jobDetail?.endDate ? new Date(jobDetail.endDate).toLocaleDateString("vi-VN") : "Đang cập nhật",
              description: jobDetail?.description || "Đang cập nhật",
              slot: Array.isArray(jobDetail?.slotIDs) ? jobDetail.slotIDs.map(s => slotMap[s] || `Slot ${s}`) : [],
              days: Array.isArray(jobDetail?.dayofWeek) ? jobDetail.dayofWeek : [],
              services: Array.isArray(jobDetail?.serviceIDs) ? jobDetail.serviceIDs.map(id => serviceMap[id]) : [],
            };
          })
        );

        setRows(fullRows);
      } catch (err) {
        console.error("Error fetching booking data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (housekeeperID && authToken) fetchData();
  }, [housekeeperID, authToken]);

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

  // Inside the component, before return:
  const handleForceAbandon = async (jobID) => {
    if (!authToken || !accountID) {
      toast.error("Vui lòng đăng nhập lại.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/Job/ForceAbandonJobAndReassign?jobId=${jobID}&accountID=${accountID}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
          }
        }
      );

      const result = await res.json();

      if (res.ok) {
        toast.success(
          `✅ ${result.message}\n💰 Thanh toán cho người giúp việc: ${result.payoutToHK.toLocaleString()} VND\n🔁 Hoàn lại cho gia đình: ${result.refundToFamily.toLocaleString()} VND`
        );
        setRows(prev => prev.filter(row => row.jobID !== jobID));
      } else {
        toast.error(result.message || "❌ Không thể huỷ công việc.");
      }
    } catch (err) {
      toast.error("Lỗi khi gọi API.");
      console.error(err);
    }
  };

  return (
    <div className="container py-4">
      <ToastContainer />
      <h4 className="fw-bold mb-4 text-primary">📋 Danh sách công việc đã nhận</h4>

      {loading ? (
        <p className="text-muted">⏳ Đang tải dữ liệu...</p>
      ) : rows.length === 0 ? (
        <p className="text-muted">Không có công việc nào được đặt.</p>
      ) : (
        <div className="row g-3">
          {rows.map((row, idx) => (
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
                  <span className="me-1"><strong>Gia đình:</strong></span> {row.familyName}
                </div>

                <div className="d-flex flex-wrap mb-1">
                  <div className="small me-3 d-flex align-items-center">
                    <FaMapMarkerAlt className="me-1 text-danger" />
                    <strong>Địa điểm:</strong> {row.location}
                  </div>
                  <div className="small d-flex align-items-center">
                    <FaMoneyBillWave className="me-1 text-success" />
                    <strong>Lương:</strong> {row.price}
                  </div>
                </div>

                <div className="d-flex flex-wrap mb-1">
                  <div className="small me-3 d-flex align-items-center">
                    <FaCalendarAlt className="me-1 text-primary" />
                    <strong>Bắt đầu:</strong> {row.startDate}
                  </div>
                  <div className="small d-flex align-items-center">
                    <FaCalendarAlt className="me-1 text-danger" />
                    <strong>Kết thúc:</strong> {row.endDate}
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
                {/* <pre>Booking Status: {row.status}, Job Status: {row.jobStatus}</pre> */}

                <div className="d-flex flex-wrap">
                  <div className="col-12 col-md-4 small">
                    <strong>
                      <FaClock className="me-1 text-info" />Ca làm việc:
                    </strong>
                    <ul className="ps-3 mb-0">
                      {row.slot.map((s, i) => (
                        <li key={i} className="text-info">{s}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="col-12 col-md-4 small">
                    <strong>📅 Thứ:</strong>
                    <ul className="ps-3 mb-0">
                      {row.days.map((dayIndex, i) => {
                        const dayLabel = dayNames[dayIndex];
                        return (
                          <li
                            key={i}
                            className="text-warning"
                            style={{ cursor: "pointer", textDecoration: "underline" }}
                            onClick={() => openDayModal(row, dayIndex)}
                          >
                            {dayLabel}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                  <div className="col-12 col-md-4 small">
                    <strong>🛎️ Dịch vụ:</strong>
                    <ul className="ps-3 mb-0">
                      {row.services.map((s, i) => (
                        <li key={i} className="text-success">{s}</li>
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
                      )
                        : row.status === 2 ? (
                          <span className="badge bg-secondary px-3 py-2 rounded-pill">
                            Đang thực hiện
                          </span>
                        ) : row.jobStatus === 3 &&
                          (() => {
                            const todayVN = new Date().toLocaleDateString("vi-VN");
                            const start = row.startDate;
                            const end = row.endDate;
                            return todayVN >= start && todayVN <= end;
                          })() ? (
                          <span className="badge bg-light text-dark px-3 py-2 rounded-pill">
                            Chưa tới ngày xác nhận
                          </span>
                        ) : null
                      }
                    </div>
                    <div>
                      {row.jobStatus === 3 && (
                        <button
                          className="btn btn-outline-danger btn-sm rounded-pill fw-bold"
                          onClick={() => handleForceAbandon(row.jobID)}
                        >
                          🛑 Huỷ việc
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedBooking && (
        <Modal show={showModal} onHide={() => setShowModal(false)}>
          <Modal.Header closeButton>
            <Modal.Title>Thông tin ca làm việc</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <p><strong>Công việc:</strong> {selectedBooking.jobName}</p>
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
    </div>
  );
};

export default HousekeeperBookingManagementPage;
