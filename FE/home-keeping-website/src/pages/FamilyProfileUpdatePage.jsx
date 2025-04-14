import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import "../assets/styles/Profile.css";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const FamilyProfileUpdatePage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const [formData, setFormData] = useState({
        name: "",
        nickname: "",
        gender: 1,
        address: "",
        email: "",
        phone: "",
        introduction: "",
    });

    const [originalData, setOriginalData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!authToken || !accountID) {
            setError(t("error_account"));
            setLoading(false);
            return;
        }

        axios.get(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${accountID}`, { headers })
            .then((res) => {
                const f = res.data;
                const initial = {
                    name: f.name || "",
                    nickname: f.nickname || "",
                    gender: f.gender || 1,
                    address: f.address || "",
                    email: f.email || "",
                    phone: f.phone || "",
                    introduction: f.introduction || "",
                };
                setFormData(initial);
                setOriginalData(initial);
                setLoading(false);
            })
            .catch(() => {
                setError(t("error_loading"));
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!authToken || !accountID) {
            alert(t("error_account"));
            return;
        }

        if (JSON.stringify(formData) === JSON.stringify(originalData)) {
            alert(t("no_changes")); // ✅ key đã thêm trong vi.json
            return;
        }

        setLoading(true);

        axios.put(`${API_BASE_URL}/Families/UpdateFamily`, {
            ...formData,
            accountID: parseInt(accountID)
        }, { headers })
            .then(() => {
                alert(t("update_success"));
                navigate("/family/profile");
            })
            .catch(() => {
                alert(t("update_failed"));
                setLoading(false);
            });
    };

    if (loading) return <div className="profile-container"><p>{t("loading_data")}</p></div>;
    if (error) return <div className="profile-container error">❌ {error}</div>;

    return (
        <div className="profile-container">
            <h1 className="profile-title">{t("profile")}</h1>
            <form className="family-profile-update-form" onSubmit={handleSubmit}>
                <label>{t("family_name")}</label>
                <input name="name" value={formData.name} onChange={handleChange} required />

                <label>{t("nickname")}</label>
                <input name="nickname" value={formData.nickname} onChange={handleChange} />

                <label>{t("gender")}</label>
                <select name="gender" value={formData.gender} onChange={handleChange}>
                    <option value={1}>{t("male")}</option>
                    <option value={2}>{t("female")}</option>
                    <option value={0}>Khác</option>
                </select>

                <label>{t("address")}</label>
                <input name="address" value={formData.address} onChange={handleChange} />

                <label>Email</label>
                <input name="email" value={formData.email} disabled />

                <label>{t("phone")}</label>
                <input name="phone" value={formData.phone} onChange={handleChange} />

                <label>{t("introduction")}</label>
                <textarea name="introduction" rows={5} value={formData.introduction} onChange={handleChange}></textarea>

                <button className="btn-primary" type="submit">{t("save_changes")}</button>
            </form>
        </div>
    );
};

export default FamilyProfileUpdatePage;
