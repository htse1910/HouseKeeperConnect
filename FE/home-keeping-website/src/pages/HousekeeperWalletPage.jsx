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
      const res = await fetch(
        `http://localhost:5280/api/Wallet/getWallet?id=${accountID}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setWallet(data);
    } catch {
      toast.error("Lỗi khi lấy ví.");
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:5280/api/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=10`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json();
      setTransactions(data || []);
    } catch {
      toast.error("Lỗi khi lấy danh sách giao dịch.");
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10000) {
      toast.warning("Số tiền phải từ 10,000đ trở lên.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5280/api/Withdraw/AddWithdraw?AccountID=${accountID}&Amount=${amount}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${authToken}`,
            Accept: "text/plain",
          },
        }
      );

      if (response.ok) {
        toast.success("🎉 Yêu cầu rút tiền đã được gửi!");
        setShowModal(false);
        setWithdrawAmount("");
        fetchWallet();
        fetchTransactions();
      } else {
        toast.error("Rút tiền thất bại.");
      }
    } catch {
      toast.error("Lỗi kết nối khi rút tiền.");
    }
  };

  useEffect(() => {
    if (accountID && authToken) {
      fetchWallet();
      fetchTransactions();
    }
  }, [accountID, authToken]);

  return (
    <div className="container py-5">
      <ToastContainer />

      <div className="card p-4 rounded-4 shadow-sm">
        <h2 className="fw-bold mb-4 text-center text-primary">
          Ví Người Giúp Việc
        </h2>

        <div className="row g-4">
          {/* Wallet Summary - Left Column */}
          <div className="col-lg-4">
            <div className="card p-4 border-0 shadow-sm rounded-4 bg-light h-100">
              {wallet ? (
                <>
                  <h5 className="fw-bold mb-2">
                    <FaWallet className="me-2 text-primary" />
                    Số dư hiện tại
                  </h5>
                  <small className="text-muted">
                    Cập nhật: {new Date(wallet.updatedAt).toLocaleString()}
                  </small>
                  <h3 className="fw-bold text-success mt-3">
                    {wallet.balance.toLocaleString("vi-VN")}₫
                  </h3>
                  <small className="text-muted">
                    Đang giữ: {wallet.onHold.toLocaleString("vi-VN")}₫
                  </small>
                  <div className="mt-4 text-center">
                    <Button
                      variant="warning"
                      className="text-white fw-bold rounded-pill px-4"
                      onClick={() => setShowModal(true)}
                    >
                      <FaCashRegister className="me-2" />
                      Rút tiền
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted">Đang tải ví...</p>
              )}
            </div>
          </div>

          {/* Transaction History - Right Column */}
          <div className="col-lg-8">
            <div className="card p-4 border-0 shadow-sm rounded-4 h-100">
              <h5 className="fw-semibold mb-3">
                <FaMoneyBillWave className="me-2 text-success" />
                Lịch sử giao dịch
              </h5>

              {loading ? (
                <p className="text-muted">Đang tải...</p>
              ) : transactions.length === 0 ? (
                <p className="text-muted">Không có giao dịch nào.</p>
              ) : (
                <ul
                  className="list-group list-group-flush"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {transactions.map((tx, index) => (
                    <li
                      key={index}
                      className="list-group-item d-flex justify-content-between align-items-start px-3 py-3 border-0 border-bottom bg-white"
                    >
                      <div className="flex-grow-1">
                        <div className="fw-semibold text-break">
                          {tx.description || "Giao dịch"}
                        </div>
                        <small className="text-muted d-flex align-items-center mt-1">
                          <FaInfoCircle className="me-1" />
                          {new Date(tx.createdDate).toLocaleString()}
                        </small>
                      </div>
                      <div className="text-end">
                        <div
                          className={`fw-bold ${
                            tx.amount > 0 ? "text-success" : "text-danger"
                          }`}
                        >
                          {tx.amount.toLocaleString("vi-VN")}₫
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Yêu cầu rút tiền</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Số tiền muốn rút (₫)</Form.Label>
            <Form.Control
              type="number"
              min="10000"
              placeholder="Tối thiểu 10,000đ"
              value={withdrawAmount}
              onChange={(e) => setWithdrawAmount(e.target.value)}
              className="rounded-3"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="rounded-pill"
            onClick={() => setShowModal(false)}
          >
            Hủy
          </Button>
          <Button
            variant="warning"
            className="text-white fw-bold rounded-pill"
            onClick={handleWithdraw}
          >
            Xác nhận rút
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HousekeeperWalletPage;
