import React, { useEffect, useState } from "react";
import { FaPhone, FaEnvelope, FaCreditCard } from "react-icons/fa";

const ContactInfo = () => {
  const [phone, setPhone] = useState("Chưa cập nhật");
  const [email, setEmail] = useState("Chưa cập nhật");
  const [bankAccount, setBankAccount] = useState("Chưa cập nhật");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPhone(data.phone?.trim() || "Chưa cập nhật");
        setEmail(data.email?.trim() || "Chưa cập nhật");
        setBankAccount(data.bankAccountNumber?.trim() || "Chưa cập nhật");
      })
      .catch((error) => {
        console.error("Lỗi khi lấy thông tin liên hệ:", error);
      });
  }, [accountID, authToken]);

  return (
    <div className="col-md-6 d-flex">
      <div className="card shadow-sm border-0 p-4 w-100 h-100">
        <h5 className="fw-bold mb-3">📞 Thông tin liên hệ</h5>
        <div className="row g-3">
          <div className="col-12 d-flex align-items-start">
            <FaPhone className="text-danger me-3 mt-1" />
            <div>
              <div className="text-muted small">Số điện thoại</div>
              <div className="fw-semibold hover-gold">{phone}</div>
            </div>
          </div>

          <div className="col-12 d-flex align-items-start">
            <FaEnvelope className="text-danger me-3 mt-1" />
            <div>
              <div className="text-muted small">Email</div>
              <div className="fw-semibold hover-gold">{email}</div>
            </div>
          </div>

          <div className="col-12 d-flex align-items-start">
            <FaCreditCard className="text-danger me-3 mt-1" />
            <div>
              <div className="text-muted small">Số tài khoản ngân hàng</div>
              <div className="fw-semibold hover-gold">{bankAccount}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactInfo;
