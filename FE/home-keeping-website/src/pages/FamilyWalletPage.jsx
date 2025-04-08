import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/Profile.css";
import { useTranslation } from "react-i18next";

const FamilyWalletPage = () => {
  const { t } = useTranslation();
  const [wallet, setWallet] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [withdrawAmount, setWithdrawAmount] = useState("");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const fetchWallet = async () => {
    try {
      const res = await fetch(`http://localhost:5280/api/Wallet/getWallet?id=${accountID}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const data = await res.json();
      setWallet(data);
    } catch {
      toast.error(t("error_loading"));
    }
  };

  const fetchTransactions = async () => {
    try {
      const res = await fetch(
        `http://localhost:5280/api/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=10`,
        { headers: { Authorization: `Bearer ${authToken}` } }
      );
      const data = await res.json();
      setTransactions(data?.slice(0, 5) || []);
    } catch {
      toast.error(t("error_loading"));
    } finally {
      setLoading(false);
    }
  };

  const handleWithdraw = async () => {
    const amount = parseFloat(withdrawAmount);
    if (!amount || amount < 10000) {
      toast.warning(t("deposit_placeholder") + " >= 10,000 VNĐ");
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5280/api/Withdraw/AddWithdraw?AccountID=${accountID}&Amount=${amount}`,
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
        toast.success(message || t("deposit_return_success"));
        setShowModal(false);
        setWithdrawAmount("");
        fetchWallet();
        fetchTransactions();
      } else {
        toast.error(message || t("deposit_return_fail"));
      }
    } catch {
      toast.error(t("deposit_failed"));
    }
  };

  useEffect(() => {
    if (accountID && authToken) {
      fetchWallet();
      fetchTransactions();
    }
  }, [accountID, authToken]);

  return (
    <div className="wallet-container">
      <ScrollToTopButton />
      <ToastContainer position="top-center" autoClose={3000} />

      <h1 className="wallet-title">{t("wallet")}</h1>

      <div className="wallet-grid">
        {/* Left: Wallet Info */}
        <div className="wallet-left">
          <div className="wallet-box">
            {wallet ? (
              <>
                <p className="wallet-label">{t("current_balance")}</p>
                <p className="wallet-balance">
                  {wallet.balance.toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="wallet-meta">
                  {t("dashboard_payment.pending")}: {wallet.onHold.toLocaleString("vi-VN")} VNĐ
                </p>
                <p className="wallet-meta">
                  {t("created_date")}: {new Date(wallet.updatedAt).toLocaleString("vi-VN")}
                </p>
                <button className="btn-primary wallet-btn" onClick={() => setShowModal(true)}>
                  {t("dashboard_payment.withdraw")}
                </button>
              </>
            ) : (
              <p className="wallet-meta">{t("loading_data")}</p>
            )}
          </div>
        </div>

        {/* Right: Transaction Preview */}
        <div className="wallet-right">
          <div className="wallet-box">
            <p className="wallet-label">{t("dashboard_recent_transactions")}</p>
            {loading ? (
              <p className="wallet-meta">{t("loading_data")}</p>
            ) : transactions.length === 0 ? (
              <p className="wallet-meta">{t("no_transactions")}</p>
            ) : (
              <table className="wallet-table">
                <thead>
                  <tr>
                    <th>{t("transaction_id")}</th>
                    <th>{t("description")}</th>
                    <th>{t("amount")}</th>
                    <th>{t("date")}</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx, index) => (
                    <tr key={index}>
                      <td>{tx.transactionID || "—"}</td>
                      <td>{tx.description || t("transaction_unknown")}</td>
                      <td className={`wallet-amount ${tx.amount > 0 ? "positive" : "negative"}`}>
                        {tx.amount.toLocaleString("vi-VN")} VNĐ
                      </td>
                      <td>{new Date(tx.createdDate).toLocaleDateString("vi-VN")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
            <div className="wallet-link-wrap">
              <Link to="/family/transactions" className="wallet-link">
                {t("view_all_transactions")} →
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Withdraw Modal */}
      {showModal && (
        <div className="wallet-modal-overlay">
          <div className="wallet-modal-box">
            <div className="wallet-modal-header">
              <span>{t("dashboard_payment.withdraw")}</span>
              <span className="icon" onClick={() => setShowModal(false)}>✖</span>
            </div>
            <div className="wallet-modal-body">
              <label className="wallet-label">{t("deposit_placeholder")}</label>
              <input
                type="number"
                min={10000}
                step={10000}
                placeholder="10,000 VNĐ"
                value={withdrawAmount}
                onChange={(e) => {
                  const value = e.target.value;
                  if (!value || /^[0-9]+$/.test(value)) {
                    setWithdrawAmount(value);
                  }
                }}
              />
            </div>
            <div className="wallet-modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>
                {t("cancel")}
              </button>
              <button className="btn-primary" onClick={handleWithdraw}>
                {t("confirm")}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FamilyWalletPage;
