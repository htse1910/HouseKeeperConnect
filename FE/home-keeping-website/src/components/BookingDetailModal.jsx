import React from "react";
import { Modal, Button } from "react-bootstrap";

const BookingDetailModal = ({
  show,
  onClose,
  booking,
  selectedDay,
  matchedDate,
  isToday,
  onCheckIn
}) => {
  return (
    <Modal show={show} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title>Thông tin ca làm việc</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {booking && (
          <>
            <p><strong>Công việc:</strong> {booking.jobName}</p>
            <p><strong>Gia đình:</strong> {booking.familyName}</p>
            <p><strong>Bắt đầu:</strong> {booking.startDate}</p>
            <p><strong>Kết thúc:</strong> {booking.endDate}</p>
            <p><strong>Thứ:</strong> {selectedDay}</p>
            <p><strong>Ngày trong tuần này:</strong> {matchedDate?.toLocaleDateString("vi-VN")}</p>

            {isToday && (
              <div className="text-center mt-4">
                <Button variant="success" onClick={onCheckIn}>
                  ✅ Check In
                </Button>
              </div>
            )}
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BookingDetailModal;
