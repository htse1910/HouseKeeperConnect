import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Profile.css";
import API_BASE_URL from "../config/apiConfig";

const FamilyProfileUpdatePage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const authToken = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");

  const headers = {
    Authorization: `Bearer ${authToken}`,
  };

  const [formData, setFormData] = useState({
    name: "",
    nickname: "",
    gender: 1,
    address: "",
    email: "",
    phone: "",
    introduction: "",
    bankAccountNumber: "",
    bankAccountName: "", // <-- New
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [originalData, setOriginalData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authToken || !accountID) {
      setError(t("error_account"));
      setLoading(false);
      return;
    }

    axios
      .get(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${accountID}`, { headers })
      .then((res) => {
        const f = res.data;
        const initial = {
          name: f.name || "",
          nickname: f.nickname || "",
          gender: f.gender ?? 1,
          address: f.address || "",
          email: f.email || "",
          phone: f.phone || "",
          introduction: f.introduction || "",
          bankAccountNumber: f.bankAccountNumber || "",
          bankAccountName: f.bankAccountName || "", // <-- New
        };
        setFormData(initial);
        setOriginalData(initial);
        setLoading(false);
      })
      .catch(() => {
        setError(t("error.error_loading"));
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "gender" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!authToken || !accountID) {
      alert(t("error_account"));
      return;
    }

    if (JSON.stringify(formData) === JSON.stringify(originalData) && !profilePicture) {
      alert(t("no_changes"));
      return;
    }

    setLoading(true);

    const payload = new FormData();
    payload.append("AccountID", accountID);
    payload.append("Name", formData.name);
    payload.append("Nickname", formData.nickname);
    payload.append("Gender", formData.gender);
    payload.append("Address", formData.address);
    payload.append("Phone", formData.phone);
    payload.append("Email", formData.email);
    payload.append("BankAccountNumber", formData.bankAccountNumber);
    payload.append("BankAccountName", formData.bankAccountName); // <-- New
    payload.append("Introduction", formData.introduction);
    if (profilePicture) payload.append("LocalProfilePicture", profilePicture);

    axios
      .put(`${API_BASE_URL}/Families/UpdateFamily`, payload, { headers })
      .then(() => {
        alert(t("misc.update_success"));
        navigate("/family/profile");
      })
      .catch(() => {
        alert(t("misc.update_failed"));
        setLoading(false);
      });
  };

  if (loading) return <div className="profile-container"><p>{t("error.loading_data")}</p></div>;
  if (error) return <div className="profile-container error">❌ {error}</div>;

  return (
    <div className="profile-container">
      <h1 className="profile-title">{t("user.profile_update")}</h1>
      <form className="family-profile-update-form" onSubmit={handleSubmit}>
        <label>{t("misc.family_name")}</label>
        <input name="name" value={formData.name} onChange={handleChange} required />

        <label>{t("user.nickname")}</label>
        <input name="nickname" value={formData.nickname} onChange={handleChange} />

        <label>{t("user.gender")}</label>
        <select name="gender" value={formData.gender} onChange={handleChange}>
          <option value={1}>{t("user.male")}</option>
          <option value={2}>{t("user.female")}</option>
          <option value={0}>{t("user.other")}</option>
        </select>

        <label>{t("user.address")}</label>
        <input name="address" value={formData.address} onChange={handleChange} />

        <label>Email</label>
        <input name="email" value={formData.email} disabled />

        <label>{t("user.phone")}</label>
        <input name="phone" value={formData.phone} onChange={handleChange} />

        <label>{t("misc.introduction")}</label>
        <textarea name="introduction" rows={5} value={formData.introduction} onChange={handleChange}></textarea>

        <label>{t("misc.bank_account_number")}</label>
        <input name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} />
        <small className="text-danger">Bạn phải nhập đúng số tài khoản của bạn để tránh chuyển sai tài khoản</small>
        
        <label>{t("misc.bank_account_name")}</label>
        <select name="bankAccountName" value={formData.bankAccountName} onChange={handleChange}>
          <option value="">Chọn ngân hàng</option>
          <option value="Vietcombank">Vietcombank</option>
          <option value="VietinBank">VietinBank</option>
          <option value="Techcombank">Techcombank</option>
          <option value="BIDV">BIDV</option>
          <option value="MBBank">MBBank</option>
          <option value="VPBank">VPBank</option>
          <option value="ACB">ACB</option>
          <option value="TPBank">TPBank</option>
          <option value="VIB">VIB</option>
          <option value="Agribank">Agribank</option>
        </select>
        <small className="text-danger">Bạn phải chọn đúng tên ngân hàng để giao dịch thành công</small>

        <label>{t("misc.profile_picture")}</label>
        <input type="file" className="form-control mb-3" onChange={(e) => setProfilePicture(e.target.files[0])} />

        <button className="btn-primary" type="submit">{t("misc.save_changes")}</button>
      </form>
    </div>
  );
};

export default FamilyProfileUpdatePage;