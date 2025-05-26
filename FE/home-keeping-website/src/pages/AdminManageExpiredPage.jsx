import React from "react";
import AdminSidebar from "../components/AdminSidebar";

const AdminManageExpiredPage = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-2 bg-light min-vh-100 py-4 px-3">
          <AdminSidebar />
        </div>
        <div className="col-md-10 py-5">
          <h2 className="fw-bold text-center text-danger">📅 Quản lý công việc hết hạn</h2>
        </div>
      </div>
    </div>
  );
};

export default AdminManageExpiredPage;
