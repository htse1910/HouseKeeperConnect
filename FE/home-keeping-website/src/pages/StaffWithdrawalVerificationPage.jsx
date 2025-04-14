import React, { useEffect, useState } from "react";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const StaffWithdrawalVerificationPage = () => {
  const [withdrawals, setWithdrawals] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Withdraw/WithdrawList?pageNumber=1&pageSize=100`, { headers })
      .then(async (res) => {
        const pendingList = res.data.filter(w => w.status === 1); // Only Pending

        const enriched = await Promise.all(
          pendingList.map(async (w) => {
            try {
              const acc = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${w.accountID}`, { headers });
              return { ...w, account: acc.data };
            } catch {
              return { ...w, account: { name: "Unknown" } };
            }
          })
        );

        setWithdrawals(enriched);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleUpdateStatus = async (withdrawID, newStatus) => {
    await axios.put(`${API_BASE_URL}/Withdraw/UpdateWithdraw`, null, {
      headers,
      params: { WithdrawID: withdrawID, Status: newStatus }
    });

    setWithdrawals(prev => prev.filter(w => w.withdrawID !== withdrawID));
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container py-4">
      <h3 className="mb-4">Pending Withdrawal Requests</h3>
      {withdrawals.length === 0 ? (
        <p>No pending withdrawals found.</p>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover">
            <thead className="table-light">
              <tr>
                <th>Withdraw ID</th>
                <th>Account Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Bank Number</th>
                <th>Requested On</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {withdrawals.map((w) => (
                <tr key={w.withdrawID}>
                  <td>{w.withdrawID}</td>
                  <td>{w.account?.name}</td>
                  <td>{w.account?.email}</td>
                  <td>{w.amount.toLocaleString()} VND</td>
                  <td>{w.bankNumber}</td>
                  <td>{new Date(w.requestDate).toLocaleString()}</td>
                  <td>
                    <button
                      className="btn btn-success btn-sm me-2"
                      onClick={() => handleUpdateStatus(w.withdrawID, 2)}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleUpdateStatus(w.withdrawID, 3)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default StaffWithdrawalVerificationPage;
