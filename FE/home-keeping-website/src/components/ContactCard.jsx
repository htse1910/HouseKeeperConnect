import React from "react";
import "../assets/styles/ProfileIntroduction.css";
import { FaPhone, FaEnvelope, FaCreditCard } from "react-icons/fa";

const ContactCard = ({ family }) => {
  const contactItems = [
    {
      icon: <FaPhone className="text-danger me-2 mt-1" />,
      label: "Số điện thoại",
      value: family?.phone || "Chưa cập nhật",
    },
    {
      icon: <FaEnvelope className="text-danger me-2 mt-1" />,
      label: "Email",
      value: family?.email || "Chưa cập nhật",
    },
    {
      icon: <FaCreditCard className="text-danger me-2 mt-1" />,
      label: "Số tài khoản ngân hàng",
      value: family?.bankAccountNumber || "Chưa cập nhật",
    },
    {
      icon: <FaCreditCard className="text-danger me-2 mt-1" />,
      label: "Ngân hàng",
      value: family?.bankAccountName || "Chưa cập nhật",
    },
  ];

  return (
    <div className="card shadow-sm p-4 mt-4 mb-4 border-0" style={{ borderRadius: "1rem" }}>
      <h5 className="fw-bold mb-3" style={{ fontSize: "1.25rem" }}>📞 Thông tin liên hệ</h5>
      <div className="row gy-3">
        {contactItems.map((item, index) => (
          <div key={index} className="col-md-6 d-flex align-items-start">
            {item.icon}
            <div>
              <div className="text-muted" style={{ fontSize: "0.95rem" }}>{item.label}</div>
              <div className="fw-semibold hover-gold intro-text" style={{ fontSize: "1.05rem" }}>
                {item.value}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContactCard;