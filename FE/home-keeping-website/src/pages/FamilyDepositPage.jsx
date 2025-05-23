import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../assets/styles/Dashboard.css";
import "../assets/styles/Payment.css";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const FamilyDepositPage = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!accountID || !authToken) {
      setError(t("error.error_auth"));
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers })
      .then((res) => {
        setAccountInfo(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Lỗi xác minh account:", err);
        setError(t("error.error_loading"));
      })
      .finally(() => setLoading(false));
  }, [accountID]);

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || Number(amount) < 10000 || isSubmitting) {
      setErrorMessage(t("deposit.deposit_minimum"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage("");

    axios
      .put(`${API_BASE_URL}/Wallet/Deposit`, null, {
        params: {
          id: Number(accountID),
          balance: Number(amount),
          isMobile: false,
        },
        headers,
      })
      .then((res) => {
        const paymentUrl = res.data?.paymentUrl || res.data;
        if (paymentUrl?.startsWith("http")) {
          window.location.href = paymentUrl;
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      })
      .catch((err) => {
        console.error("Lỗi nạp tiền:", err);
        setError(t("deposit.deposit_failed"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  const loadingOrError = shouldShowLoadingOrError(loading, error, t);
  if (loadingOrError) return loadingOrError;

  return (
    <div className="dashboard-container">
      <div className="dashboard-box shadow-box" style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 className="dashboard-heading">{t("deposit.deposit_title")}</h2>
        <p className="dashboard-subtext">{t("deposit.deposit_description")}</p>

        <div className="deposit-form">
          <label className="form-label">{t("deposit.deposit_placeholder")}</label>
          {errorMessage && (
            <p style={{ color: "red", marginTop: 8 }}>{errorMessage}</p>
          )}
          <div className="deposit-input-wrapper">
            <input
              type="number"
              step="10000"
              min="10000"
              placeholder={t("deposit.deposit_placeholder")}
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <span className="vnd-suffix">VNĐ</span>
          </div>

          <button className="btn-primary" onClick={handleDeposit} disabled={isSubmitting}>
            {isSubmitting ? t("deposit.deposit_processing") : t("deposit.deposit_submit")}
          </button>

          {success && (
            <p className="text-success mt-3">✅ {t("deposit.deposit_success")}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default FamilyDepositPage;
