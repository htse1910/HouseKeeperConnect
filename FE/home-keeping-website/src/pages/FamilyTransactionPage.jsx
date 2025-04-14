import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../assets/styles/Transaction.css";
import { formatTotalCurrency, formatDate, formatDateTime, getTransactionFormatData } from "../utils/formatData";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const generateFakeTransactions = () => {
    const transactionTypes = [1, 2, 3, 4]; // enum hợp lệ
    const statuses = [1, 2, 3, 4]; // enum hợp lệ

    return Array.from({ length: 37 }, (_, i) => ({
        transactionID: 1000 + i,
        transactionType: transactionTypes[i % transactionTypes.length],
        amount: 100000 + i * 50000,
        fee: 5000,
        description: "Giao dịch thử nghiệm",
        createdDate: new Date(Date.now() - i * 86400000).toISOString(),
        status: statuses[i % statuses.length],
    }));
};

const FamilyTransactionPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const shouldShowLoadingOrError = loading || error;


    // Pagination state (reused structure)
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const MAX_VISIBLE_PAGES = 15;
    const [inputPage, setInputPage] = useState("");

    const filteredTransactions = transactions;
    const indexOfLastRecord = currentPage * recordsPerPage;
    const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
    const currentRecords = filteredTransactions.slice(indexOfFirstRecord, indexOfLastRecord);
    const totalPages = Math.ceil(filteredTransactions.length / recordsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationRange = () => {
        if (totalPages <= MAX_VISIBLE_PAGES) {
            return Array.from({ length: totalPages }, (_, i) => i + 1);
        }

        const middleStart = Math.max(currentPage - 2, 2);
        const middleEnd = Math.min(currentPage + 2, totalPages - 1);

        const pages = [1];

        if (middleStart > 2) pages.push("...");
        for (let i = middleStart; i <= middleEnd; i++) pages.push(i);
        if (middleEnd < totalPages - 1) pages.push("...");
        pages.push(totalPages);

        return pages;
    };

    const paginationRange = getPaginationRange();

    const handlePageInput = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setInputPage(value);
        }
    };

    const handlePageSubmit = (event) => {
        event.preventDefault();
        const pageNumber = parseInt(inputPage, 10);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
        }
        setInputPage("");
    };

    useEffect(() => {
        if (isDemo) {
            setTransactions(generateFakeTransactions());
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        if (!authToken) {
            setError(t("error.error_auth"));
            setLoading(false);
            return;
        }

        if (!accountID) {
            setError(t("error.error_account"));
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers })
            .then((res) => {
                const acc = res.data;
                if (!acc || !acc.accountID) throw new Error(t("error_auth"));

                return axios.get(`${API_BASE_URL}/Transaction/GetTransactionByUserID?id=${accountID}&pageNumber=1&pageSize=100`, { headers });
            })
            .then((txnRes) => {
                const txnData = txnRes.data || [];
                setTransactions(txnData);

                console.log("Transactions:", txnData);
                console.log("Filtered:", txnData.filter(txn => [1, 2, 4].includes(txn.status)));

            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(t("error_loading"));
            })
            .finally(() => {
                setLoading(false);
            });
    }, [isDemo]);

    if (shouldShowLoadingOrError) {
        return (
            <div className="transaction-family-container">
                {loading && (
                    <>
                        <span className="icon-loading" />
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="transaction-family-error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="transaction-family-container">
            <h1 className="transaction-family-title">
                {t("transaction.transaction_history")} {isDemo && "(Demo Mode)"}
            </h1>

            {filteredTransactions.length === 0 ? (
                <p>{t("misc.no_transactions")}</p>
            ) : (
                <>
                    <table className="transaction-family-table">
                        <thead>
                            <tr>
                                <th>{t("transaction.transaction_id")}</th>
                                <th>{t("transaction.transaction_type")}</th>
                                <th>{t("misc.amount")}</th>
                                <th>{t("misc.fee")}</th>
                                <th>{t("status.status")}</th>
                                <th>{t("misc.created_date")}</th>
                                <th>{t("job.job.view_detail")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRecords.map((txn) => {
                                const { statusLabel, statusClass, typeLabel } = getTransactionFormatData(txn.status, txn.transactionType, t);
                                return (
                                    <tr key={txn.transactionID}>
                                        <td>{txn.transactionID}</td>
                                        <td>{typeLabel}</td>
                                        <td>{formatTotalCurrency(txn.amount, t)}</td>
                                        <td>{formatTotalCurrency(txn.fee, t)}</td>
                                        <td className={statusClass}>{statusLabel}</td>
                                        <td>{formatDate(txn.createdDate)}</td>
                                        <td>
                                            <button className="btn-secondary" onClick={() => setSelectedTransaction(txn)}>
                                                {t("job.job.view_detail")}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>

                    <div className="housekeeper-pagination">
                        <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                            &laquo;
                        </button>

                        {paginationRange.map((page, index) =>
                            page === "..." ? (
                                <span key={index} className="dots">...</span>
                            ) : (
                                <button
                                    key={index}
                                    onClick={() => paginate(page)}
                                    className={currentPage === page ? "active-page" : ""}
                                >
                                    {page}
                                </button>
                            )
                        )}

                        <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                            &raquo;
                        </button>

                        {totalPages > 15 && (
                            <form onSubmit={handlePageSubmit} className="pagination-input-form">
                                <input
                                    type="text"
                                    className="pagination-input"
                                    value={inputPage}
                                    onChange={handlePageInput}
                                    placeholder={t("go_to")}
                                />
                                <button type="submit" className="pagination-go-btn">Go</button>
                            </form>
                        )}
                    </div>
                </>
            )}

            {selectedTransaction && (() => {
                const { statusLabel, typeLabel } = getTransactionFormatData(
                    selectedTransaction.status,
                    selectedTransaction.transactionType,
                    t
                );

                return (
                    <div className="transaction-family-modal">
                        <div className="transaction-family-modal-content">
                            <span className="close" onClick={() => setSelectedTransaction(null)}>&times;</span>
                            <h2>{t("transaction.transaction_detail")}</h2>
                            <p><strong>{t("transaction.transaction_id")}:</strong> {selectedTransaction.transactionID}</p>
                            <p><strong>{t("transaction.transaction_type")}:</strong> {typeLabel}</p>
                            <p><strong>{t("misc.amount")}:</strong> {formatTotalCurrency(selectedTransaction.amount, t)}</p>
                            <p><strong>{t("misc.fee")}:</strong> {formatTotalCurrency(selectedTransaction.fee, t)}</p>
                            <p><strong>{t("status.status")}:</strong> {statusLabel}</p>
                            <p><strong>{t("misc.created_date")}:</strong> {formatDateTime(selectedTransaction.createdDate)}</p>
                            <p><strong>{t("misc.description")}:</strong> {selectedTransaction.description || t("misc.no_description")}</p>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
};

export default FamilyTransactionPage;
