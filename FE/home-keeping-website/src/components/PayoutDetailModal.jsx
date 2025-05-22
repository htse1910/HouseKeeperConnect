import React from "react";

const PayoutDetailModal = ({ payout, onClose }) => {
  if (!payout) return null;

  return (
    <>
      {/* Light backdrop */}
      <div
        className="position-fixed top-0 start-0 w-100 h-100"
        style={{ backgroundColor: "rgba(255, 255, 255, 0.4)", zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className="modal fade show d-block"
        tabIndex="-1"
        style={{ zIndex: 1050 }}
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow rounded-4 border-0">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Chi tiết thanh toán</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>
            <div className="modal-body text-center">
              <img
                src={payout.avatar || "/default-avatar.png"}
                alt="avatar"
                className="rounded-circle mb-3"
                width="90"
                height="90"
              />
              <h5 className="mb-1">{payout.familyName}</h5>
              <p className="text-muted small mb-1">SĐT: {payout.phone}</p>
              <p className="text-muted small mb-1">
                STK ngân hàng: {payout.bankAccountNumber}
              </p>
              <p className="fw-semibold fs-6 mt-2">
                Số tiền: {payout.amount.toLocaleString()}đ
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PayoutDetailModal;
