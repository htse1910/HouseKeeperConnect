import React, { useEffect, useState } from "react";

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
    <div className="card p-4 shadow-sm mt-3">
      <h5 className="fw-bold">Giới thiệu</h5>
      <p className="mt-2">{introduction}</p>
    </div>
  );
};

export default ProfileIntroduction;
