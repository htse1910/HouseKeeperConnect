import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { formatDateTime, formatTotalCurrency } from "../utils/formatData";
import "../assets/styles/Payment.css";

const FamilyJobPaymentResultPage = () => {
    const { t } = useTranslation();
    const location = useLocation();
    const navigate = useNavigate();

    const state = location.state || {};
    const {
        jobID,
        jobName,
        amount,
        fee,
        createdAt,
        currentBalance,
        topUpNeeded,
        housekeeperEarnings
    } = state;

    const goBack = () => {
        navigate("/family/dashboard");
    };

    return (
        <div className="payment-result-container">
            <h2 className="payment-result-title">{t("job.jobPost.success")}</h2>
            <p className="payment-result-message">{t("deposit.deposit_return_note_success")}</p>

            <div className="payment-info-box">
                <p><strong>{t("job.job_title")}:</strong> {jobName || `#${jobID}`}</p>
                <p><strong>{t("misc.date")}:</strong> {formatDateTime(createdAt)}</p>
                <p><strong>{t("misc.amount")}:</strong> {formatTotalCurrency(amount, t)}</p>
                <p><strong>{t("misc.fee")}:</strong> {formatTotalCurrency(fee, t)}</p>
                <p><strong>{t("transaction.transactionStatus.payout")}:</strong> {formatTotalCurrency(housekeeperEarnings, t)}</p>
                {topUpNeeded > 0 && (
                    <p className="payment-note">
                        ⚠️ {t("deposit.deposit_failed")} {t("misc.deposit_amount")}: {formatCurrency(topUpNeeded, t)}
                    </p>
                )}
                <p className="payment-balance">
                    {t("misc.current_balance")}: {formatTotalCurrency(currentBalance, t)}
                </p>
            </div>

            <button onClick={goBack} className="btn-secondary" style={{ marginTop: "20px" }}>
                {t("uncategorized.return_now")}
            </button>
        </div>
    );
};

export default FamilyJobPaymentResultPage;
