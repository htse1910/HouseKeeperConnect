import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../assets/styles/Dashboard.css";
import "../assets/styles/Payment.css";

const FamilyDepositPage = () => {
  const { t } = useTranslation();
  const [amount, setAmount] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [accountInfo, setAccountInfo] = useState(null);
  const [error, setError] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const isDemo = new URLSearchParams(window.location.search).get("demo") === "true";

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (isDemo) {
      setAccountInfo({ accountID: 1, name: "Demo User" });
      setLoading(false);
      return;
    }

    if (!accountID || !authToken) {
      setError(t("error_auth"));
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
      .then((res) => {
        setAccountInfo(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Lỗi xác minh account:", err);
        setError(t("error_loading"));
      })
      .finally(() => setLoading(false));
  }, [accountID]);

  const handleDeposit = () => {
    if (!amount || isNaN(amount) || Number(amount) <= 0 || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    axios
      .put(`http://localhost:5280/api/Wallet/Deposit`, null, {
        params: {
          id: Number(accountID),
          balance: Number(amount),
        },
        headers,
      })
      .then((res) => {
        const paymentUrl = res.data;
        if (paymentUrl?.startsWith("http")) {
          window.location.href = paymentUrl;
        } else {
          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);
        }
      })
      .catch((err) => {
        console.error("Lỗi nạp tiền:", err);
        setError(t("deposit_failed"));
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  };

  if (loading) {
    return (
      <div className="dashboard-container text-center">
        <span className="icon-loading" />
        <p>{t("loading_data")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container text-center">
        <p className="job-posting-alert job-posting-error">❌ {error}</p>
        {!isDemo && (
          <button className="btn-secondary" onClick={() => (window.location.search = "?demo=true")}>
            {t("view_demo")}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-box shadow-box" style={{ maxWidth: 500, margin: "0 auto" }}>
        <h2 className="dashboard-heading">{t("deposit_title")}</h2>
        <p className="dashboard-subtext">{t("deposit_description")}</p>

        <div className="deposit-form">
          <label className="form-label">{t("deposit_placeholder")}</label>
          <div className="deposit-input-wrapper">
            <input
              type="number"
              placeholder={t("deposit_placeholder")}
              className="form-input"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              min="10000"
            />
            <span className="vnd-suffix">VNĐ</span>
          </div>

          <button className="deposit-button" onClick={handleDeposit} disabled={isSubmitting}>
            {isSubmitting ? t("deposit_processing") : t("deposit_submit")}
          </button>

          {success && <p className="success-text mt-3">✅ {t("deposit_success")}</p>}
        </div>
      </div>
    </div>
  );
};

export default FamilyDepositPage;
