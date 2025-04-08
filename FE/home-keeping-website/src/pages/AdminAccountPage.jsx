import React from "react";
import ScrollToTopButton from "../components/ScrollToTopButton";
import AccountTable from "../components/AccountTable";
import { FaUsers } from "react-icons/fa";

const AdminAccountPage = () => {
  return (
    <div className="container py-5">
      <ScrollToTopButton />
      <div className="card shadow-sm border-0 p-4 rounded-4">
        <h1 className="fw-bold text-primary text-center mb-4 d-flex align-items-center justify-content-center">
          <FaUsers className="me-2" />
          Quản lý Tài khoản Người dùng
        </h1>
        <AccountTable />
      </div>
    </div>
  );
};

export default AdminAccountPage;
