import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaSave } from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig";

// Utility: Format to Vietnam Time
const formatVietnamTime = (isoString) => {
  const date = new Date(isoString);
  return date.toLocaleString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour12: false,
  });
};

const ManagePlatformFeesPage = () => {
  const [fees, setFees] = useState([]);
  const [editFee, setEditFee] = useState(null);
  const [editPercent, setEditPercent] = useState("");

  const token = localStorage.getItem("authToken");
  const headers = { Authorization: `Bearer ${token}` };

  const fetchFees = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/PlatformFee/PlatformFeeList?pageNumber=1&pageSize=100`, { headers });
      setFees(res.data || []);
    } catch (err) {
      console.error("Failed to fetch fees:", err);
    }
  };

  const saveUpdate = async () => {
    if (!editFee || !editPercent) return;
    try {
      await axios.put(
        `${API_BASE_URL}/PlatformFee/UpdateFee?fID=${editFee.feeID}&percent=${editPercent}`,
        null,
        { headers }
      );
      setEditFee(null);
      setEditPercent("");
      fetchFees();
    } catch (err) {
      console.error("Failed to update fee:", err);
    }
  };

  useEffect(() => {
    fetchFees();
  }, []);

  return (
    <div className="container py-4">
      <h2>Manage Platform Fees</h2>

      {/* Fee List */}
      <table className="table table-bordered mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Percent</th>
            <th>Created</th>
            <th>Updated</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {fees.map((fee) => (
            <tr key={fee.feeID}>
              <td>{fee.feeID}</td>
              <td>
                {editFee?.feeID === fee.feeID ? (
                  <input
                    type="number"
                    value={editPercent}
                    onChange={(e) => setEditPercent(e.target.value)}
                    className="form-control"
                    style={{ maxWidth: "100px" }}
                  />
                ) : (
                  `${fee.percent * 100}%`
                )}
              </td>
              <td>{formatVietnamTime(fee.createdDate)}</td>
              <td>{formatVietnamTime(fee.updatedDate)}</td>
              <td>
                {editFee?.feeID === fee.feeID ? (
                  <button className="btn btn-primary btn-sm" onClick={saveUpdate}>
                    <FaSave /> Save
                  </button>
                ) : (
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => {
                      setEditFee(fee);
                      setEditPercent(fee.percent);
                    }}
                  >
                    Edit
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ManagePlatformFeesPage;
