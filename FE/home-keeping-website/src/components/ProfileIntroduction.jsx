import React, { useEffect, useState } from "react";
import "../assets/styles/ProfileIntroduction.css"; // Adjust path if needed

const ProfileIntroduction = () => {
  const [introduction, setIntroduction] = useState("Chưa có");

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setIntroduction(data.introduction?.trim() || "Chưa có");
      })
      .catch((err) => {
        console.error("Lỗi khi lấy dữ liệu giới thiệu:", err);
        setIntroduction("Chưa có");
      });
  }, [accountID, authToken]);

  return (
    <div className="card p-4 shadow-sm mt-4 border-0">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0">Giới thiệu</h5>
      </div>
      <p className={`mt-2 mb-0 intro-text ${introduction === "Chưa có" ? "text-muted" : "hover-gold"}`}>
        {introduction}
      </p>
    </div>
  );
};

export default ProfileIntroduction;
