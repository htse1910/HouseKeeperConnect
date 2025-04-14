import React, { useEffect, useState } from "react";
import {
  FaWallet,
  FaMoneyBillWave,
  FaInfoCircle,
  FaCashRegister,
} from "react-icons/fa";
import { Button, Modal, Form } from "react-bootstrap";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "../components/ScrollToTopButton";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const HousekeeperWalletPage = () => {
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchWallet = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/Wallet/getWallet?id=${accountID}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setWallet(data);
    } catch {
      toast.error("Lỗi khi lấy thông tin ví.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `${API_BASE_URL}/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=10`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json();
      setTransactions(data || []);
    } catch {
      toast.error("Lỗi khi lấy giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10000) {
      toast.warning("Số tiền phải từ 10,000₫ trở lên.");
      return;
    }

    try {
      const res = await fetch(
        `${API_BASE_URL}/Withdraw/AddWithdraw?AccountID=${accountID}&Amount=${amount}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "text/plain",
          },
        }
      );

      const message = await res.text();

      if (res.ok) {
        toast.success(message || "Yêu cầu rút tiền đã được gửi!");
        setShowModal(false);
        setWithdrawAmount("");
        fetchWallet();
        fetchTransactions();
      } else {
        toast.error(message || "Rút tiền thất bại.");
      }
    } catch {
      toast.error("Lỗi khi gửi yêu cầu rút tiền.");
    }
  };

  useEffect(() => {
    if (accountID && authToken) {
      fetchWallet();
      fetchTransactions();
    }
  }, [accountID, authToken]);

  return (
    <div className="container py-4">
      <ScrollToTopButton />
      <ToastContainer position="top-center" autoClose={3000} />

      <div className="card rounded-4 shadow-sm border-0 p-4 mx-auto" style={{ maxWidth: "900px" }}>
        <h4 className="fw-bold text-center text-primary mb-4">💰 Ví Người Giúp Việc</h4>

        <div className="row g-4">
          {/* Wallet Info */}
          <div className="col-md-4">
            <div className="card bg-light border-0 rounded-4 shadow-sm p-3 h-100">
              {wallet ? (
                <>
                  <div className="fw-semibold text-muted small mb-1">
                    <FaWallet className="me-2 text-primary" />
                    Số dư hiện tại
                  </div>
                  <div className="fs-4 fw-bold text-success">
                    {wallet.balance.toLocaleString("vi-VN")}₫
                  </div>
                  <div className="text-muted small mb-3">
                    Giữ: {wallet.onHold.toLocaleString("vi-VN")}₫
                  </div>
                  <div className="small text-muted">
                    Cập nhật: {new Date(wallet.updatedAt).toLocaleString()}
                  </div>
                  <div className="text-center mt-4">
                    <Button
                      variant="warning"
                      className="text-white fw-semibold rounded-pill px-4"
                      onClick={() => setShowModal(true)}
                    >
                      <FaCashRegister className="me-2" />
                      Rút tiền
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted small">Đang tải ví...</p>
              )}
            </div>
          </div>

          {/* Transactions */}
          <div className="col-md-8">
            <div className="card border-0 rounded-4 shadow-sm p-3 h-100">
              <div className="fw-semibold mb-3 text-muted">
                <FaMoneyBillWave className="me-2 text-success" />
                Lịch sử giao dịch
              </div>

              {loading ? (
                <p className="text-muted small">Đang tải...</p>
              ) : transactions.length === 0 ? (
                <p className="text-muted small">Không có giao dịch nào.</p>
              ) : (
                <div style={{ maxHeight: "400px", overflowY: "auto" }}>
                  <ul className="list-group list-group-flush small">
                    {transactions.map((tx, index) => (
                      <li
                        key={index}
                        className="list-group-item d-flex justify-content-between align-items-start border-0 border-bottom py-2 px-1"
                      >
                        <div className="me-2">
                          <div className="fw-semibold">{tx.description || "Giao dịch"}</div>
                          <small className="text-muted d-flex align-items-center mt-1">
                            <FaInfoCircle className="me-1" />
                            {new Date(tx.createdDate).toLocaleString()}
                          </small>
                        </div>
                        <div className={`fw-bold ${tx.amount > 0 ? "text-success" : "text-danger"}`}>
                          {tx.amount.toLocaleString("vi-VN")}₫
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">💳 Yêu cầu rút tiền</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label className="small">Số tiền muốn rút (₫)</Form.Label>
            <Form.Control
              type="number"
              min={10000}
              step={10000}
              placeholder="Tối thiểu 10,000₫"
              className="rounded-3"
              value={withdrawAmount}
              onChange={(e) => {
                const value = e.target.value;
                if (!value || /^[0-9]+$/.test(value)) {
                  setWithdrawAmount(value);
                }
              }}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" className="rounded-pill" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button
            variant="warning"
            className="text-white fw-bold rounded-pill"
            onClick={handleWithdraw}
          >
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HousekeeperWalletPage;
