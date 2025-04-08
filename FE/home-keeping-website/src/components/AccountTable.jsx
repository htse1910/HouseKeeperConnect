import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const getEnumLabel = (type, value) => {
  const enums = {
    AccountStatus: { 0: "Inactive", 1: "Active", 2: "Pending" },
    Gender: { 1: "Male", 2: "Female" },
    Role: {
      1: "Người giúp việc",
      2: "Gia đình",
      3: "Nhân viên",
      4: "Quản trị viên",
    },
  };
  return enums[type]?.[value] || "Không xác định";
};

const AccountTable = () => {
  const authToken = localStorage.getItem("authToken");

  const [accounts, setAccounts] = useState([]);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState("");
  const [searchID, setSearchID] = useState("");
  const [searchMode, setSearchMode] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [updatingID, setUpdatingID] = useState(null);

  const pageSize = 5;

  const fetchAccounts = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5280/api/Account/AccountList?pageNumber=${page}&pageSize=${pageSize}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setAccounts(data);
      setHasNextPage(data.length === pageSize);
    } catch (err) {
      console.error("Fetch failed:", err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByName = async () => {
    if (!searchName.trim()) return;
    setLoading(true);
    setSearchMode(true);
    try {
      const res = await fetch(
        `http://localhost:5280/api/Account/SearchAccount?name=${encodeURIComponent(searchName)}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setAccounts(data);
    } catch (err) {
      console.error("Search by name failed:", err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const searchByID = async () => {
    if (!searchID.trim()) return;
    setLoading(true);
    setSearchMode(true);
    try {
      const res = await fetch(
        `http://localhost:5280/api/Account/GetAccount?id=${searchID}`,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      const data = await res.json();
      setAccounts(data ? [data] : []);
    } catch (err) {
      console.error("Search by ID failed:", err);
      setAccounts([]);
    } finally {
      setLoading(false);
    }
  };

  const resetSearch = () => {
    setSearchName("");
    setSearchID("");
    setSearchMode(false);
    setPage(1);
    fetchAccounts();
  };

  const changeStatus = async (id) => {
    setUpdatingID(id);
    setStatusMessage("");
    try {
      const res = await fetch(`http://localhost:5280/api/Account/ChangeStatus?id=${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const msg = await res.text();
      setStatusMessage(msg);
      fetchAccounts();
    } catch (err) {
      setStatusMessage("Lỗi cập nhật trạng thái.");
      console.error(err);
    } finally {
      setUpdatingID(null);
    }
  };

  useEffect(() => {
    if (!searchMode) fetchAccounts();
  }, [page]);

  return (
    <div>
      <div className="row gy-2 gx-3 align-items-end mb-4">
        <div className="col-md-5">
          <label className="form-label fw-semibold">Tìm theo tên</label>
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tên người dùng..."
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
            />
            <button className="btn btn-primary" onClick={searchByName}>Tìm</button>
          </div>
        </div>

        <div className="col-md-5">
          <label className="form-label fw-semibold">Tìm theo ID</label>
          <div className="input-group">
            <input
              type="number"
              className="form-control"
              placeholder="Nhập ID người dùng..."
              value={searchID}
              onChange={(e) => setSearchID(e.target.value)}
            />
            <button className="btn btn-secondary" onClick={searchByID}>Tìm</button>
          </div>
        </div>

        <div className="col-md-2 d-flex align-items-end">
          <button className="btn btn-outline-dark w-100" onClick={resetSearch}>❌ Đặt lại</button>
        </div>
      </div>

      {statusMessage && <div className="alert alert-info">{statusMessage}</div>}

      {loading ? (
        <p className="text-muted">⏳ Đang tải...</p>
      ) : accounts.length === 0 ? (
        <div className="alert alert-warning">Không tìm thấy tài khoản nào.</div>
      ) : (
        <div className="table-responsive">
          <table className="table table-bordered table-hover align-middle">
            <thead className="table-light">
              <tr>
                <th>ID</th>
                <th>Ảnh</th>
                <th>Tên</th>
                <th>Biệt danh</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Số tài khoản</th>
                <th>Giới tính</th>
                <th>Vai trò</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
                <th>Provider</th>
                <th>Google ID</th>
                <th>Ảnh Google</th>
                <th>Password</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {accounts.map((acc) => (
                <tr key={acc.accountID}>
                  <td>{acc.accountID}</td>
                  <td>
                    <img
                      src={acc.localProfilePicture || acc.googleProfilePicture}
                      alt={acc.name}
                      className="rounded-circle"
                      width="36"
                      height="36"
                    />
                  </td>
                  <td>{acc.name}</td>
                  <td>{acc.nickname}</td>
                  <td>{acc.email}</td>
                  <td>{acc.phone}</td>
                  <td>{acc.bankAccountNumber}</td>
                  <td>{getEnumLabel("Gender", acc.gender)}</td>
                  <td>{getEnumLabel("Role", acc.roleID)}</td>
                  <td>{getEnumLabel("AccountStatus", acc.status)}</td>
                  <td>{new Date(acc.createdAt).toLocaleString()}</td>
                  <td>{new Date(acc.updatedAt).toLocaleString()}</td>
                  <td>{acc.provider || "—"}</td>
                  <td>{acc.googleId || "—"}</td>
                  <td>
                    {acc.googleProfilePicture ? (
                      <a href={acc.googleProfilePicture} target="_blank" rel="noreferrer">
                        Link
                      </a>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="text-muted">••••••••</td>
                  <td>
                    <button
                      className="btn btn-sm btn-outline-primary"
                      onClick={() => changeStatus(acc.accountID)}
                      disabled={updatingID === acc.accountID}
                    >
                      {updatingID === acc.accountID ? "Đang cập nhật..." : "Cập nhật trạng thái"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {!searchMode && (
        <div className="d-flex justify-content-between align-items-center mt-4">
          <button
            className="btn btn-outline-secondary rounded-pill px-4"
            disabled={page <= 1}
            onClick={() => setPage((prev) => prev - 1)}
          >
            <FaChevronLeft className="me-2" /> Trước
          </button>
          <span className="text-muted">Trang {page}</span>
          <button
            className="btn btn-outline-primary rounded-pill px-4"
            disabled={!hasNextPage}
            onClick={() => setPage((prev) => prev + 1)}
          >
            Sau <FaChevronRight className="ms-2" />
          </button>
        </div>
      )}
    </div>
  );
};

export default AccountTable;
