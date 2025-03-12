import React, { useState, useEffect } from "react";

function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("accounts");
  const [accounts, setAccounts] = useState([]);
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [authToken, setAuthToken] = useState(null);

  // ✅ Get `authToken` from localStorage on mount
  useEffect(() => {
    setAuthToken(localStorage.getItem("authToken"));
  }, []);

  useEffect(() => {
    if (!authToken) {
      setError("No auth token found. Please log in again.");
      return;
    }

    if (activeTab === "accounts") fetchAccounts();
    if (activeTab === "housekeepers") fetchHousekeepers();
  }, [authToken, activeTab]);

  const fetchAccounts = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5280/api/Account/AccountList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch account list.");
      const data = await response.json();
      setAccounts(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchHousekeepers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:5280/api/HouseKeeper/HousekeeperList", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch housekeeper list.");
      const data = await response.json();
      setHousekeepers(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="fw-bold text-center">Admin Dashboard</h2>
      <div className="card shadow-sm p-4">
        <p>Welcome, Admin! Here you can manage users, jobs, and system settings.</p>
      </div>

      {/* Tab Navigation */}
      <ul className="nav nav-tabs mt-4">
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "accounts" ? "active" : ""}`} onClick={() => setActiveTab("accounts")}>
            Account List
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "housekeepers" ? "active" : ""}`} onClick={() => setActiveTab("housekeepers")}>
            Housekeeper List
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link ${activeTab === "families" ? "active" : ""}`} onClick={() => setActiveTab("families")}>
            Family List
          </button>
        </li>
      </ul>

      {/* Tab Content */}
      <div className="tab-content mt-4">
        {/* Account List Tab */}
        {activeTab === "accounts" && (
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Account List</h5>
            {loading && <p>Loading accounts...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role ID</th>
                    <th>Status</th>
                    <th>Created At</th>
                    <th>Updated At</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map((account) => (
                    <tr key={account.accountID}>
                      <td>{account.accountID}</td>
                      <td>{account.name}</td>
                      <td>{account.email}</td>
                      <td>{account.phone}</td>
                      <td>{account.roleID}</td>
                      <td>{account.status === 1 ? "Active" : "Inactive"}</td>
                      <td>{new Date(account.createdAt).toLocaleString()}</td>
                      <td>{new Date(account.updatedAt).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Housekeeper List Tab */}
        {activeTab === "housekeepers" && (
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Housekeeper List</h5>
            {loading && <p>Loading housekeepers...</p>}
            {error && <p className="text-danger">{error}</p>}
            {!loading && !error && (
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>Housekeeper ID</th>
                    <th>Account ID</th>
                    <th>Rating</th>
                    <th>Verified</th>
                    <th>Bank Account</th>
                    <th>Jobs Completed</th>
                    <th>Jobs Applied</th>
                  </tr>
                </thead>
                <tbody>
                  {housekeepers.map((housekeeper) => (
                    <tr key={housekeeper.housekeeperID}>
                      <td>{housekeeper.housekeeperID}</td>
                      <td>{housekeeper.accountID}</td>
                      <td>{housekeeper.rating ?? "N/A"}</td>
                      <td>{housekeeper.isVerified ? "Yes" : "No"}</td>
                      <td>{housekeeper.bankAccountNumber || "N/A"}</td>
                      <td>{housekeeper.jobCompleted}</td>
                      <td>{housekeeper.jobsApplied}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Family List Tab (Empty for now) */}
        {activeTab === "families" && (
          <div className="card shadow-sm p-4">
            <h5 className="fw-bold">Family List</h5>
            <p>Coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
