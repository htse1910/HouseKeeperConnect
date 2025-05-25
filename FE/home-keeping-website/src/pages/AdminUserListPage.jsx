import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import UserTableRow from "../components/UserTableRow";
import UserDetailsModal from "../components/UserDetailsModal";
import AdminSidebar from "../components/AdminSidebar";
import API_BASE_URL from "../config/apiConfig";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Modal, Button, Form } from "react-bootstrap";
const AdminUserListPage = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 6;
  const [totalUsers, setTotalUsers] = useState(0);
  const [showResetModal, setShowResetModal] = useState(false);
  const [targetUser, setTargetUser] = useState(null);
  const [newPassword, setNewPassword] = useState("");
  const [searchEmail, setSearchEmail] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchMode, setIsSearchMode] = useState(false);

  const openResetModal = (user) => {
    setTargetUser(user);
    setShowResetModal(true);
  };

  const closeResetModal = () => {
    setShowResetModal(false);
    setTargetUser(null);
    setNewPassword("");
  };

  const handleConfirmReset = () => {
    if (newPassword.trim()) {
      handleResetPassword(targetUser.accountID, newPassword);
      closeResetModal();
    } else {
      toast.warn("Mật khẩu không được để trống.");
    }
  };

  const paginatedUsers = allUsers;

  const handleSearchByEmail = async () => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!searchEmail || !emailRegex.test(searchEmail)) {
      toast.error("Vui lòng nhập đúng định dạng email.", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setIsSearching(true);
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(
        `${API_BASE_URL}/Account/SearchAccountByEmail?email=${encodeURIComponent(searchEmail)}`,
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!res.ok) throw new Error("Không tìm thấy tài khoản.");

      const user = await res.json();
      setAllUsers([user]);
      setIsSearchMode(true);

      toast.success("Tìm kiếm thành công!", {
        position: "top-right",
        autoClose: 3000,
      });
    } catch (err) {
      setAllUsers([]);
      setIsSearchMode(true);
      toast.error("Không tìm thấy tài khoản phù hợp.", {
        position: "top-right",
        autoClose: 3000,
      });
    } finally {
      setIsSearching(false);
    }
  };

  const fetchUsers = async (page = 1) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("authToken");

      const [listRes, countRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Account/AccountList?pageNumber=${page}&pageSize=${USERS_PER_PAGE}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${API_BASE_URL}/Account/TotalAccount`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const listData = await listRes.json();
      const countData = await countRes.json();

      setAllUsers(listData);
      setTotalUsers(countData.totalHousekeepers + countData.totalFamilies); // ✅
      console.log("Total: ", totalUsers)
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeStatus = async (id) => {
    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/Account/ChangeStatus?id=${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const msg = await res.text();
      if (res.ok) {
        toast.success(msg, { position: "top-right", autoClose: 3000 });
        fetchUsers();
      } else {
        toast.error("Không thể cập nhật trạng thái.", { position: "top-right", autoClose: 3000 });
      }
    } catch (err) {
      toast.error("Lỗi khi thay đổi trạng thái.", { position: "top-right", autoClose: 3000 });
    }
  };

  const handleResetPassword = async (accountID, password) => {
    if (!password || password.trim() === "") {
      toast.warn("Mật khẩu không được để trống.");
      return;
    }

    try {
      const token = localStorage.getItem("authToken");
      const res = await fetch(`${API_BASE_URL}/Account/AdminResetPassword?accountID=${accountID}&password=${encodeURIComponent(password)}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const msg = await res.text();
      if (res.ok) {
        toast.success(`Đặt lại mật khẩu thành công`, { position: "top-right", autoClose: 3000 });
      } else {
        toast.error(`Không thể đặt lại mật khẩu: ${msg}`, { position: "top-right", autoClose: 3000 });
      }
    } catch (err) {
      toast.error("Lỗi khi đặt lại mật khẩu.", { position: "top-right", autoClose: 3000 });
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers(currentPage);
  }, [currentPage]);

  const getRole = (id) => (id === 1 ? "Người giúp việc" : id === 2 ? "Gia đình" : id === 3 ? "Nhân viên" : "Không xác định");
  const getGender = (g) => (g === 1 ? "Nam" : g === 2 ? "Nữ" : "Không rõ");

  return (
    <div className="container-fluid">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      <style>{`
        .card-custom {
          border: 2px solid #0d6efd;
          border-radius: 1rem;
          background: #f0f8ff;
          box-shadow: 0 6px 12px rgba(0, 0, 0, 0.07);
          padding: 24px;
        }
        .table thead th {
          background-color: #e7f1ff;
          color: #0d6efd;
        }
        .table tbody tr:nth-child(odd) td {
          background-color: #f9fcff;
        }
        .table tbody tr:hover td {
          background-color: #e0f0ff;
          transition: background-color 0.3s ease;
        }
        .btn-outline-primary:hover {
          background-color: #0d6efd;
          color: white;
        }
        .btn-warning {
          background-color: #ffc107;
          border: none;
        }
        .btn-warning:hover {
          background-color: #e0a800;
        }
      `}</style>

      <div className="row">
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>

        <div className="col-md-10 py-5">
          <h2 className="fw-bold mb-4 text-primary text-center">Bảng Tài Khoản</h2>
          <div className="d-flex align-items-center gap-2 mb-3">
            <input
              type="text"
              placeholder="Tìm theo email..."
              className="form-control"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearchByEmail()}
              style={{ maxWidth: "300px" }}
            />
            <button className="btn btn-primary" onClick={handleSearchByEmail}>
              {isSearching ? (
                <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
              ) : (
                "Tìm"
              )}
            </button>
            {isSearchMode && (
              <button
                className="btn btn-outline-secondary"
                onClick={() => {
                  setSearchEmail("");
                  setIsSearchMode(false);
                  fetchUsers(currentPage);
                }}
              >
                Xóa tìm kiếm
              </button>
            )}
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Đang tải...</span>
              </div>
            </div>
          ) : (
            <>
              <div className="card-custom">
                <div className="table-responsive">
                  <table className="table table-bordered table-hover table-striped align-middle">
                    <thead className="text-center">
                      <tr>
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th>Họ tên</th>
                        <th>Email</th>
                        <th>Vai trò</th>
                        <th>Giới tính</th>
                        <th>Trạng thái</th>
                        <th>Ngày tạo</th>
                        <th>Chi tiết</th>
                        <th>Thay đổi trạng thái</th>
                        <th>Đặt lại mật khẩu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedUsers.map((user) => (
                        <UserTableRow
                          key={user.accountID}
                          user={user}
                          onSelect={setSelectedUser}
                          onChangeStatus={handleChangeStatus}
                          onResetPassword={handleResetPassword}
                          onRequestPasswordResetModal={openResetModal}
                          getRole={getRole}
                          getGender={getGender}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>
                <Modal show={showResetModal} onHide={closeResetModal} centered>
                  <Modal.Header closeButton>
                    <Modal.Title>Đặt lại mật khẩu</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    <Form.Group>
                      <Form.Label>Nhập mật khẩu mới cho <strong>{targetUser?.email}</strong>:</Form.Label>
                      <Form.Control
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Mật khẩu mới"
                      />
                    </Form.Group>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={closeResetModal}>Hủy</Button>
                    <Button variant="danger" onClick={handleConfirmReset}>Xác nhận</Button>
                  </Modal.Footer>
                </Modal>

              </div>

              {/* Pagination */}
              {!isSearchMode && totalUsers > USERS_PER_PAGE && (
                <div className="d-flex justify-content-center align-items-center gap-3 mt-4">
                  <button
                    className="btn btn-outline-primary"
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage((p) => p - 1)}
                  >
                    <span className="me-1">&larr;</span> Trước
                  </button>

                  <input
                    type="number"
                    min={1}
                    max={Math.ceil(totalUsers / USERS_PER_PAGE)}
                    value={currentPage}
                    onChange={(e) => {
                      const page = Number(e.target.value);
                      const max = Math.ceil(totalUsers / USERS_PER_PAGE);
                      if (page >= 1 && page <= max) {
                        setCurrentPage(page);
                      }
                    }}
                    className="form-control text-center"
                    style={{ width: "70px" }}
                  />

                  <span className="fw-bold">
                    / {Math.ceil(totalUsers / USERS_PER_PAGE)}
                  </span>

                  <button
                    className="btn btn-outline-primary"
                    disabled={currentPage === Math.ceil(totalUsers / USERS_PER_PAGE)}
                    onClick={() => setCurrentPage((p) => p + 1)}
                  >
                    Sau <span className="ms-1">&rarr;</span>
                  </button>
                </div>
              )}
            </>
          )}

          <UserDetailsModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
            getRole={getRole}
            getGender={getGender}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminUserListPage;
