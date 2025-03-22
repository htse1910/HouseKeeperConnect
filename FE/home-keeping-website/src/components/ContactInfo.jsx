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
      <div className="card p-4 shadow-sm w-100 h-100">
        <h5 className="fw-bold">Thông tin liên hệ</h5>
        <p><FaPhone className="text-danger me-2" /> {phone}</p>
        <p><FaEnvelope className="text-danger me-2" /> {email}</p>
        <p><FaCreditCard className="text-danger me-2" /> {bankAccount}</p>
      </div>
    </div>
  );
};

export default ContactInfo;
