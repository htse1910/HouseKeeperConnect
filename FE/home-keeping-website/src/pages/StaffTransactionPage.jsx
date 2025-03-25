import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Transaction.css";

const FamilyTransactionPage = () => {
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const getTransactionTypeLabel = (type) => {
        switch (type) {
            case 0: return "Nạp tiền";
            case 1: return "Thanh toán";
            case 2: return "Rút tiền";
            default: return "Không xác định";
        }
    };

    const getStatusLabel = (status) => {
        switch (status) {
            case 0: return "Đang xử lý";
            case 1: return "Thành công";
            case 2: return "Thất bại";
            default: return "Không rõ";
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 0: return "transaction-family-status-0";
            case 1: return "transaction-family-status-1";
            case 2: return "transaction-family-status-2";
            default: return "";
        }
    };

    useEffect(() => {
        if (isDemo) {
            const fake = Array.from({ length: 10 }, (_, i) => ({
                transactionID: 1000 + i,
                userName: `Người dùng ${i + 1}`,
                transactionType: i % 3,
                amount: 100000 + i * 50000,
                fee: 5000,
                description: "Giao dịch thử nghiệm",
                createdDate: new Date(Date.now() - i * 86400000).toISOString(),
                status: i % 3,
            }));
            setTransactions(fake);
            setLoading(false);
            setError(null);
            return;
        }

        if (!authToken || !accountID) {
            setError("Vui lòng đăng nhập để xem giao dịch.");
            setLoading(false);
            return;
        }

        setLoading(true);
        axios.get("http://localhost:5280/api/Transaction/TransactionList", { headers })
            .then((res) => {
                const filtered = res.data.filter(txn => txn.account?.accountID === parseInt(accountID));
                const mapped = filtered.map(txn => ({
                    transactionID: txn.transactionID,
                    userName: txn.account?.name || "Không rõ",
                    transactionType: txn.transactionType,
                    amount: txn.amount,
                    fee: txn.fee,
                    description: txn.description,
                    createdDate: txn.createdDate,
                    status: txn.status,
                }));
                setTransactions(mapped);
                setError(null);
            })
            .catch((err) => {
                console.error("Lỗi tải giao dịch:", err);
                setError("Không thể tải danh sách giao dịch.");
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    if (loading || error) {
        return (
            <div className="transaction-family-container">
                {loading && <p>Đang tải dữ liệu giao dịch...</p>}
                {error && (
                    <>
                        <p className="transaction-family-error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                Xem chế độ demo
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="transaction-family-container">
            <h1 className="transaction-family-title">Lịch sử giao dịch {isDemo && "(Demo Mode)"}</h1>

            {transactions.length === 0 ? (
                <p>Không có giao dịch nào.</p>
            ) : (
                <table className="transaction-family-table">
                    <thead>
                        <tr>
                            <th>Mã GD</th>
                            <th>Người dùng</th>
                            <th>Loại</th>
                            <th>Số tiền</th>
                            <th>Phí</th>
                            <th>Trạng thái</th>
                            <th>Ngày tạo</th>
                            <th>Chi tiết</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((txn) => (
                            <tr key={txn.transactionID}>
                                <td>{txn.transactionID}</td>
                                <td>{txn.userName}</td>
                                <td>{getTransactionTypeLabel(txn.transactionType)}</td>
                                <td>{txn.amount.toLocaleString("vi-VN")} VND</td>
                                <td>{txn.fee.toLocaleString("vi-VN")} VND</td>
                                <td className={getStatusClass(txn.status)}>
                                    {getStatusLabel(txn.status)}
                                </td>
                                <td>{new Date(txn.createdDate).toLocaleDateString("vi-VN")}</td>
                                <td>
                                    <button className="btn-secondary" onClick={() => setSelectedTransaction(txn)}>
                                        Xem
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}

            {selectedTransaction && (
                <div className="transaction-family-modal">
                    <div className="transaction-family-modal-content">
                        <span className="close" onClick={() => setSelectedTransaction(null)}>&times;</span>
                        <h2>Chi tiết Giao dịch</h2>
                        <p><strong>Mã giao dịch:</strong> {selectedTransaction.transactionID}</p>
                        <p><strong>Người dùng:</strong> {selectedTransaction.userName}</p>
                        <p><strong>Loại:</strong> {getTransactionTypeLabel(selectedTransaction.transactionType)}</p>
                        <p><strong>Số tiền:</strong> {selectedTransaction.amount.toLocaleString("vi-VN")} VND</p>
                        <p><strong>Phí:</strong> {selectedTransaction.fee.toLocaleString("vi-VN")} VND</p>
                        <p><strong>Trạng thái:</strong> {getStatusLabel(selectedTransaction.status)}</p>
                        <p><strong>Ngày tạo:</strong> {new Date(selectedTransaction.createdDate).toLocaleString("vi-VN")}</p>
                        <p><strong>Ghi chú:</strong> {selectedTransaction.description || "Không có ghi chú."}</p>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyTransactionPage;
