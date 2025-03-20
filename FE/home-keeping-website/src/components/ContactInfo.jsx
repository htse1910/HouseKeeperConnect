import React, { useEffect, useState } from "react";
import { FaPhone, FaEnvelope } from "react-icons/fa";

const ContactInfo = () => {
  const [phone, setPhone] = useState("...");
  const [email, setEmail] = useState("...");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setPhone(data.phone || "Chưa cập nhật");
        setEmail(data.email || "Chưa cập nhật");
      })
      .catch((error) => console.error("Lỗi khi lấy thông tin liên hệ:", error));
  }, [accountID, authToken]);

  return (
    <div className="col-md-6 d-flex">
      <div className="card p-4 shadow-sm w-100 h-100">
        <h5 className="fw-bold">Thông tin liên hệ</h5>
        <p><FaPhone className="text-danger me-2" /> {phone}</p>
        <p><FaEnvelope className="text-danger me-2" /> {email}</p>
      </div>
    </div>
  );
};

export default ContactInfo;
