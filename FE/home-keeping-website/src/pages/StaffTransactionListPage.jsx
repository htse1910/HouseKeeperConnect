import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table, Button, Spinner, Alert } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../config/apiConfig";

const transactionTypeMap = {
  1: "Deposit",
  2: "Withdrawal",
  3: "Payment",
  4: "Payout",
  5: "Refund",
};

const transactionStatusMap = {
  1: "Pending",
  2: "Completed",
  3: "Expired",
  4: "Canceled",
};

const StaffTransactionListPage = () => {
  const { t } = useTranslation();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showWeekOnly, setShowWeekOnly] = useState(false);
  const [error, setError] = useState(null);

  const fetchTransactions = async (lastWeek = false) => {
    setLoading(true);
    setError(null);
    const endpoint = lastWeek
      ? "/Transaction/TransactionInPastWeek?pageNumber=1&pageSize=1000"
      : "/Transaction/TransactionList?pageNumber=1&pageSize=1000";
    try {
      const token = localStorage.getItem("authToken");
      const res = await axios.get(`${API_BASE_URL}${endpoint}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTransactions(res.data);
    } catch (err) {
      setError(t("error_loading", "Failed to load transactions."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const formatCurrency = (amount) =>
    amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

  return (
    <div className="container py-4">
      <h3>{t("transaction.transactions", "Transactions")}</h3>

      <div className="mb-3">
        <Button
          variant={showWeekOnly ? "secondary" : "primary"}
          onClick={() => {
            const newState = !showWeekOnly;
            setShowWeekOnly(newState);
            fetchTransactions(newState);
          }}
        >
          {showWeekOnly
            ? t("transaction.show_all", "Show All")
            : t("transaction.show_week", "Show Last Week")}
        </Button>
      </div>

      {loading && <Spinner animation="border" variant="primary" />}
      {error && <Alert variant="danger">{error}</Alert>}

      {!loading && !error && (
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>ID</th>
              <th>{t("transaction.type", "Type")}</th>
              <th>{t("transaction.account", "Account ID")}</th>
              <th>{t("transaction.amount", "Amount")}</th>
              <th>{t("transaction.fee", "Fee")}</th>
              <th>{t("transaction.description", "Description")}</th>
              <th>{t("transaction.created_at", "Created Date")}</th>
              <th>{t("transaction.status", "Status")}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.transactionID}>
                <td>{tx.transactionID}</td>
                <td>{t(`transactionType.${transactionTypeMap[tx.transactionType]}`, transactionTypeMap[tx.transactionType])}</td>
                <td>{tx.accountID}</td>
                <td>{formatCurrency(tx.amount)}</td>
                <td>{formatCurrency(tx.fee)}</td>
                <td>{tx.description}</td>
                <td>{new Date(tx.createdDate).toLocaleString("vi-VN")}</td>
                <td>{t(`transactionStatus.${transactionStatusMap[tx.status]}`, transactionStatusMap[tx.status])}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default StaffTransactionListPage;
