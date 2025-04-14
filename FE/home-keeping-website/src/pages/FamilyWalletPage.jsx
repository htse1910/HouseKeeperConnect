import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../assets/styles/Transaction.css";
import { useTranslation } from "react-i18next";
import { formatDate, formatTotalCurrency } from "../utils/formatData";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

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
            const res = await fetch(`${API_BASE_URL}/Wallet/getWallet?id=${accountID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
            });
            const data = await res.json();
            setWallet(data);
        } catch {
            toast.error(t("error.error_loading"));
        }
    };

    const fetchTransactions = async () => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=10`,
                { headers: { Authorization: `Bearer ${authToken}` } }
            );
            const data = await res.json();
            setTransactions(data?.slice(0, 5) || []);
        } catch {
            toast.error(t("error.error_loading"));
        } finally {
            setLoading(false);
        }
    };

    const handleWithdraw = async () => {
        const amount = parseFloat(withdrawAmount);
        if (!amount || amount < 10000) {
            toast.warning(t("deposit.deposit_placeholder") + " >= 10,000 VNĐ");
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
                toast.success(message || t("deposit.deposit_return_success"));
                setShowModal(false);
                setWithdrawAmount("");
                fetchWallet();
                fetchTransactions();
            } else {
                toast.error(message || t("deposit.deposit_return_fail"));
            }
        } catch {
            toast.error(t("deposit.deposit_failed"));
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

            <h1 className="wallet-title">{t("uncategorized.wallet")}</h1>

            <div className="wallet-grid">
                <div className="wallet-left">
                    <div className="wallet-box">
                        {wallet ? (
                            <>
                                <p className="wallet-label">{t("misc.current_balance")}</p>
                                <p className="wallet-balance">
                                    {formatTotalCurrency(wallet.balance)}
                                </p>
                                <p className="wallet-meta">
                                    <strong>{t("dashboard.dashboard_payment.pending")}:</strong>{" "}
                                    {formatTotalCurrency(wallet.onHold)}
                                </p>
                                <p className="wallet-meta">
                                    <strong>{t("misc.created_date")}:</strong>{" "}
                                    {formatDate(wallet.updatedAt)}
                                </p>
                                <div className="wallet-btn-group">
                                    <button
                                        className="btn-secondary wallet-btn"
                                        onClick={() => (window.location.href = "/family/deposit")}
                                    >
                                        {t("dashboard.dashboard_deposit")}
                                    </button>
                                    <button
                                        className="btn-primary wallet-btn"
                                        onClick={() => setShowModal(true)}
                                    >
                                        {t("dashboard.dashboard_payment.withdraw")}
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="wallet-meta">{t("misc.loading_data")}</p>
                        )}
                    </div>
                </div>

                <div className="wallet-right">
                    <div className="wallet-box">
                        <p className="wallet-label">{t("dashboard.dashboard_recent_transactions")}</p>
                        {loading ? (
                            <p className="wallet-meta">{t("misc.loading_data")}</p>
                        ) : transactions.length === 0 ? (
                            <p className="wallet-meta">{t("misc.no_transactions")}</p>
                        ) : (
                            <table className="wallet-table">
                                <thead>
                                    <tr>
                                        <th>{t("transaction.transaction_id")}</th>
                                        <th>{t("misc.description")}</th>
                                        <th>{t("misc.amount")}</th>
                                        <th>{t("misc.date")}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.map((tx, index) => (
                                        <tr key={index}>
                                            <td>{tx.transactionID || "—"}</td>
                                            <td>{tx.description || t("transaction.transaction_unknown")}</td>
                                            <td className={`wallet-amount wallet-status-${tx.status}`}>
                                                {formatTotalCurrency(tx.amount)}
                                            </td>
                                            <td>{formatDate(tx.createdDate)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        )}
                        <div className="wallet-link-wrap">
                            <Link to="/family/transactions" className="wallet-link">
                                {t("uncategorized.view_all_transactions")} →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {showModal && (
                <div className="wallet-modal-overlay">
                    <div className="wallet-modal-box">
                        <div className="wallet-modal-header-row">
                            <label className="wallet-modal-title">{t("dashboard.dashboard_payment.withdraw")}</label>
                            <span className="wallet-modal-close" onClick={() => setShowModal(false)}>✖</span>
                        </div>
                        <div className="wallet-modal-body">
                            <label className="wallet-label">{t("deposit.deposit_placeholder")}</label>
                            <input
                                type="number"
                                min={10000}
                                step={10000}
                                placeholder={t("deposit.deposit_placeholder")}
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
                                {t("misc.cancel")}
                            </button>
                            <button className="btn-primary" onClick={handleWithdraw}>
                                {t("misc.confirm")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyWalletPage;
