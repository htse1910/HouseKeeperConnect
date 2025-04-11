import React, { useEffect, useState } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { formatTotalCurrency, formatDateTime } from "../utils/formatData";
import { shouldShowLoadingOrError, getPagination } from "../utils/uiHelpers";
import "../assets/styles/Payment.css";
import "../assets/styles/Dashboard.css";

const StaffPayoutApprovalPage = () => {
    const { t } = useTranslation();
    const [allPayouts, setAllPayouts] = useState([]);
    const [filteredPayouts, setFilteredPayouts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("all");
    const [searchKeyword, setSearchKeyword] = useState("");
    const [confirmAction, setConfirmAction] = useState(null);

    const pageSize = 10;

    useEffect(() => {
        fetchFullPayoutInfo();
    }, []);

    useEffect(() => {
        applyFilter();
    }, [statusFilter, searchKeyword, allPayouts]);

    const fetchFullPayoutInfo = async () => {
        setLoading(true);
        setError("");
        try {
            const payoutRes = await axios.get(`/api/Payout/PayoutList?pageNumber=1&pageSize=100`);
            const payoutList = Array.isArray(payoutRes.data) ? payoutRes.data : payoutRes.data.data || [];

            const jobServiceRes = await axios.get(`/api/Job_Service/Job_ServiceList`);

            const result = await Promise.all(
                payoutList.map(async (payout) => {
                    try {
                        const bookingRes = await axios.get(`/api/Booking/GetBookingByID?id=${payout.bookingID}`);
                        const jobID = bookingRes.data.jobID;

                        const jobRes = await axios.get(`/api/Job/GetJobByID?id=${jobID}`);
                        const jobName = jobRes.data.jobName;
                        const familyID = jobRes.data.familyID;

                        const familyRes = await axios.get(`/api/Families/GetFamilyByID?id=${familyID}`);
                        const nickname = familyRes.data.account?.nickname || "Unknown";

                        const services = jobServiceRes.data
                            .filter((s) => s.jobID === jobID)
                            .map((s) => s.serviceID);

                        return {
                            payoutID: payout.payoutID,
                            payoutDate: payout.payoutDate,
                            amount: payout.amount,
                            status: payout.status,
                            jobID,
                            jobName,
                            familyID,
                            nickname,
                            services,
                        };
                    } catch (innerErr) {
                        console.warn("Failed to fetch some data for payout:", innerErr);
                        return null;
                    }
                })
            );

            setAllPayouts(result.filter((r) => r !== null));
        } catch (err) {
            console.error(err);
            setError(t("error.error_loading"));
        } finally {
            setLoading(false);
        }
    };

    const applyFilter = () => {
        let result = [...allPayouts];

        if (statusFilter !== "all") {
            const statusInt = statusFilter === "pending" ? 1 : 2;
            result = result.filter((p) => p.status === statusInt);
        }

        if (searchKeyword.trim()) {
            result = result.filter((p) =>
                p.nickname.toLowerCase().includes(searchKeyword.trim().toLowerCase())
            );
        }

        setFilteredPayouts(result);
        setCurrentPage(1);
    };

    const handleApprove = async (payoutID) => {
        try {
            await axios.put(`/api/Payout/UpdatePayout?payoutID=${payoutID}&status=2`);
            setConfirmAction(null);
            fetchFullPayoutInfo();
        } catch {
            alert(t("error.unexpected_error"));
        }
    };

    const handleReject = async (payoutID) => {
        try {
            await axios.put(`/api/Payout/UpdatePayout?payoutID=${payoutID}&status=3`);
            setConfirmAction(null);
            fetchFullPayoutInfo();
        } catch {
            alert(t("error.unexpected_error"));
        }
    };

    const { paginatedData, pageRange } = getPagination(filteredPayouts, currentPage, pageSize);

    const changePage = (page) => {
        if (page !== "..." && page !== currentPage) {
            setCurrentPage(page);
            window.scrollTo({ top: 0, behavior: "smooth" });
        }
    };

    return (
        <div className="dashboard-content">
            <h2>{t("transaction.transaction_withdraw")}</h2>

            {/* Bộ lọc + Tìm kiếm */}
            <div className="housekeeper-filter-container">
                <label className="housekeeper-filter-label">{t("status.status")}</label>
                <select
                    className="housekeeper-filter"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                >
                    <option value="all">{t("filter.filter.all")}</option>
                    <option value="pending">{t("status.transactionStatus.pending")}</option>
                    <option value="completed">{t("status.transactionStatus.completed")}</option>
                </select>

                <input
                    className="housekeeper-search"
                    type="text"
                    placeholder={t("user.nickname")}
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                />
            </div>

            {shouldShowLoadingOrError(loading, error, t)}

            {!loading && filteredPayouts.length === 0 && (
                <p className="user-verification-empty-message">{t("misc.no_transactions")}</p>
            )}

            {!loading && paginatedData.length > 0 && (
                <>
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>{t("misc.date")}</th>
                                <th>{t("misc.housekeeper")}</th>
                                <th>{t("misc.amount")}</th>
                                <th>{t("status.status")}</th>
                                <th>{t("misc.actions")}</th>
                            </tr>
                        </thead>
                        <tbody>
                            {paginatedData.map((payout, index) => (
                                <tr key={payout.payoutID}>
                                    <td>{(currentPage - 1) * pageSize + index + 1}</td>
                                    <td>{formatDateTime(payout.payoutDate)}</td>
                                    <td>{payout.nickname}</td>
                                    <td>{formatTotalCurrency(payout.amount, t)}</td>
                                    <td>
                                        <span
                                            className={`payout-status-badge ${payout.status === 1 ? "payout-status-pending" : "payout-status-completed"
                                                }`}
                                        >
                                            {payout.status === 1
                                                ? t("status.transactionStatus.pending")
                                                : t("status.transactionStatus.completed")}
                                        </span>
                                    </td>
                                    <td>
                                        {payout.status === 1 && (
                                            <>
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => setConfirmAction({ id: payout.payoutID, type: "approve" })}
                                                >
                                                    {t("verification.approve")}
                                                </button>
                                                <button
                                                    className="btn-cancel"
                                                    onClick={() => setConfirmAction({ id: payout.payoutID, type: "reject" })}
                                                >
                                                    {t("verification.reject")}
                                                </button>
                                            </>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls" style={{ marginTop: "20px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {pageRange.map((page) => (
                            <button
                                key={page} // ✅ Sử dụng chính giá trị page làm key
                                className={`btn-secondary ${page === currentPage ? "btn-primary" : ""}`}
                                onClick={() => changePage(page)}
                            >
                                {page}
                            </button>
                        ))}
                    </div>
                </>
            )}

            {/* Confirm modal */}
            {confirmAction && (
                <div className="modal-overlay">
                    <div className="modal-box">
                        <h3>{t("misc.confirm")}</h3>
                        <p>
                            {confirmAction.type === "approve"
                                ? t("misc.confirm") + " duyệt giao dịch này?"
                                : t("misc.confirm") + " từ chối giao dịch này?"}
                        </p>
                        <div style={{ marginTop: "16px", display: "flex", gap: "10px", justifyContent: "center" }}>
                            <button
                                className="btn-primary"
                                onClick={() =>
                                    confirmAction.type === "approve"
                                        ? handleApprove(confirmAction.id)
                                        : handleReject(confirmAction.id)
                                }
                            >
                                {t("misc.confirm")}
                            </button>
                            <button className="btn-secondary" onClick={() => setConfirmAction(null)}>
                                {t("misc.cancel")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StaffPayoutApprovalPage;
