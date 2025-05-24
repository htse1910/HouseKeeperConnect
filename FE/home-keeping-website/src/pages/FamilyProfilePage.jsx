import React, { useState, useEffect } from "react";
import defaultAvatar from "../assets/images/avatar0.png";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig";
import AvatarCard from "../components/AvatarCard";
import IntroductionCard from "../components/IntroductionCard";
import ContactCard from "../components/ContactCard";
import PreferencesCard from "../components/PreferencesCard";

const FamilyProfilePage = () => {
  const authToken = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const [family, setFamily] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const mapGender = (genderID) => {
    switch (genderID) {
      case 1: return "Nam";
      case 2: return "Nữ";
      case 3: return "Khác";
      default: return "Không rõ";
    }
  };

  useEffect(() => {
    if (!authToken || !accountID) {
      setError("Không xác thực được người dùng.");
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${accountID}`, { headers })
      .then((res) => setFamily(res.data))
      .catch((err) => {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải dữ liệu hồ sơ.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: "1.5rem" }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ padding: "1.5rem", color: "red" }}>❌ {error}</div>;

  return (
    <div className="container mt-4">
      <AvatarCard family={family} mapGender={mapGender} defaultAvatar={defaultAvatar} />
      <IntroductionCard introduction={family?.introduction} />
      <ContactCard family={family} />
      <div className="mb-4">
        <PreferencesCard familyID={family?.familyID} token={authToken} />
      </div>

    </div>
  );
};

export default FamilyProfilePage;
