import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../assets/styles/Payment.css";

function FamilyDepositReturnPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [balance, setBalance] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [amount, setAmount] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const result = searchParams.get("status")?.toLowerCase();
    setStatus(result);
    setTransactionId(searchParams.get("transactionId"));
    setAmount(searchParams.get("amount"));

    if (result === "success" && accountID) {
      axios
        .get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
        .then((res) => {
          setBalance(res.data.balance || null);
        })
        .catch(() => {
          setBalance(null);
        });
    }

    const timeout = setTimeout(() => {
      window.location.href = "/family/dashboard";
    }, 5000);

    return () => clearTimeout(timeout);
  }, [searchParams]);

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return t("deposit_return_success");
      case "cancelled":
        return t("deposit_return_cancel");
      default:
        return t("deposit_return_fail");
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "success":
        return t("deposit_return_note_success");
      case "cancelled":
        return t("deposit_return_note_cancel");
      default:
        return t("deposit_return_note_fail");
    }
  };

  return (
    <div className="payment-result-container text-center">
      <h2 className="payment-result-title">{getStatusTitle()}</h2>
      <p className="payment-result-message">{getStatusMessage()}</p>

      {(transactionId || amount) && (
        <div className="payment-info-box">
          {transactionId && (
            <p>
              🧾 <strong>{t("transaction_id")}:</strong>{" "}
              <span className="text-emphasis">{transactionId}</span>
            </p>
          )}
          {amount && (
            <p>
              💰 <strong>{t("deposit_amount")}:</strong>{" "}
              <span className="text-emphasis">
                {Number(amount).toLocaleString()} VNĐ
              </span>
            </p>
          )}
        </div>
      )}

      {balance !== null && (
        <p className="payment-balance">
          🪙 <strong>{t("current_balance")}:</strong>{" "}
          {Number(balance).toLocaleString()} VNĐ
        </p>
      )}

      <p className="payment-note mt-3">{t("redirecting_dashboard")}</p>

      <button className="btn-secondary mt-2" onClick={() => navigate("/family/dashboard")}>
        {t("return_now")}
      </button>
    </div>
  );
}

export default FamilyDepositReturnPage;
