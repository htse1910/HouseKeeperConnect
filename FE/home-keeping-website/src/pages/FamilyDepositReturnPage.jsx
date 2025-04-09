import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../assets/styles/Payment.css";
import { formatTotalCurrency } from "../utils/formatData";

function FamilyDepositReturnPage() {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [transactionId, setTransactionId] = useState(null);
  const [amount, setAmount] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    const result = searchParams.get("status")?.toLowerCase(); // paid / cancelled
    const transID = searchParams.get("orderCode");
    const amountValue = searchParams.get("amount");

    setTransactionId(transID);
    setAmount(amountValue);

    if (transID && result === "paid") {
      axios
        .get(`http://localhost:5280/api/Payment/success?orderCode=${transID}`, { headers })
        .then((res) => {
          if (res.data === "PAID") {
            setStatus("success");
          } else {
            setStatus("failed");
          }
        })
        .catch(() => {
          setStatus("failed");
        });
    } else if (transID && result === "cancelled") {
      axios
        .get(`http://localhost:5280/api/Payment/cancel?orderCode=${transID}`, { headers })
        .then(() => setStatus("cancelled"))
        .catch(() => setStatus("failed"));
    } else {
      setStatus("failed");
    }

    const timeout = setTimeout(() => {
      window.location.href = "/family/dashboard";
    }, 5000);

    return () => clearTimeout(timeout);
  }, [searchParams]);

  const getStatusTitle = () => {
    switch (status) {
      case "success":
        return t("deposit.deposit_return_success");
      case "cancelled":
        return t("deposit.deposit_return_cancel");
      default:
        return t("deposit.deposit_return_fail");
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case "success":
        return t("deposit.deposit_return_note_success");
      case "cancelled":
        return t("deposit.deposit_return_note_cancel");
      default:
        return t("deposit.deposit_return_note_fail");
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
              🧾 <strong>{t("transaction.transaction_id")}:</strong>{" "}
              <span className="text-emphasis">{transactionId}</span>
            </p>
          )}
          {amount && (
            <p>
              💰 <strong>{t("deposit.deposit_amount")}:</strong>{" "}
              <span className="text-emphasis">{formatTotalCurrency(amount, t)}</span>
            </p>
          )}
        </div>
      )}

      <p className="payment-note mt-3">{t("misc.redirecting_dashboard")}</p>

      <button className="btn-secondary mt-2" onClick={() => navigate("/family/dashboard")}>
        {t("misc.return_now")}
      </button>
    </div>
  );
}

export default FamilyDepositReturnPage;
