import React from "react";
import { Link, useLocation } from "react-router-dom";
import { FaTable, FaChartBar, FaTools, FaUserShield } from "react-icons/fa";

const AdminSidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { path: "/admin/dashboard", icon: <FaChartBar />, label: "Thống kê" },
    { path: "/admin/users", icon: <FaTable />, label: "Bảng Tài Khoản" },
    { path: "/admin/services", icon: <FaTools />, label: "Dịch vụ" },
    { path: "/admin/staff", icon: <FaUserShield />, label: "Nhân viên" },
    { path: "/admin/platform-fees", icon: <FaUserShield />, label: "Phí nền tảng" },
  ];

  return (
    <div className="px-2">
      <h5 className="fw-bold mb-4 ps-2">Bảng Điều Khiển</h5>
      <ul className="list-unstyled">
        {navItems.map((item, idx) => {
          const isActive = pathname === item.path;
          return (
            <li key={idx} className="mb-2">
              <Link
                to={item.path}
                className={`d-flex align-items-center gap-2 px-3 py-2 rounded-pill fw-medium text-decoration-none ${
                  isActive ? "bg-primary text-white shadow-sm" : "text-dark"
                }`}
                style={{
                  transition: "background-color 0.2s ease",
                }}
              >
                {item.icon} <span>{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default AdminSidebar;
