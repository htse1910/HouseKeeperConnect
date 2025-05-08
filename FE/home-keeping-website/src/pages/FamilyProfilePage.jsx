import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../assets/styles/Profile.css";
import defaultAvatar from "../assets/images/avatar0.png";
import axios from "axios";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const FamilyProfilePage = () => {
    const { t } = useTranslation();

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const [accountInfo, setAccountInfo] = useState(null);
    const [family, setFamily] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shouldShowLoadingOrError = loading || error;

    const mapJobStatus = (status) => {
        const statusMap = {
            1: "pending",
            2: "verified",
            3: "accepted",
            4: "completed",
            5: "expired",
            6: "canceled",
            7: "not_permitted",
            8: "pending_family_confirmation",
            9: "housekeeper_quit"
        };
    
        const key = statusMap[status];
        return key ? t(`job.jobStatus.${key}`) : t("job.job.not_sure");
    };    

    useEffect(() => {
        setLoading(true);
        setError(null);

        if (!authToken) {
            setError(t("error.error_auth"));
            setLoading(false);
            return;
        }

        if (!accountID) {
            setError(t("error.error_account"));
            setLoading(false);
            return;
        }

        // Gọi API để lấy thông tin tài khoản
        axios.get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers })
            .then((accountResponse) => {
                const account = accountResponse.data;
                if (!account || !account.accountID) throw new Error(t("error.error_auth"));
                setAccountInfo(account);

                return axios.get(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${accountID}`, { headers });
            })
            .then((familyResponse) => {
                const familyData = familyResponse.data;
                if (!familyData) throw new Error(t("error.error_loading"));
                setFamily(familyData);

                return axios.get(`${API_BASE_URL}/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
            })
            .then((jobResponse) => {
                const jobList = jobResponse.data;
                if (!Array.isArray(jobList)) {
                    console.warn("API Job không trả về danh sách hợp lệ.");
                    setJobs([]);
                    return;
                }

                const jobDetailPromises = jobList.map(job =>
                    axios.get(`${API_BASE_URL}/Job/GetJobDetailByID?id=${job.jobID}`, { headers })
                        .then(response => response.data)
                        .catch(err => {
                            console.warn(`Không thể lấy chi tiết job ID ${job.jobID}`, err);
                            return null;
                        })
                );

                return Promise.all(jobDetailPromises)
                    .then((detailedJobs) => {
                        const validJobs = detailedJobs.filter(job => job !== null);
                        const formattedJobs = validJobs.map(job => ({
                            jobID: job.jobID,
                            title: job.jobName,
                            startDate: new Date(job.startDate).toLocaleDateString("vi-VN"),
                            endDate: new Date(job.endDate).toLocaleDateString("vi-VN"),
                            status: mapJobStatus(job.status),
                            salary: job.price,
                            location: job.location,
                            description: job.description,
                            serviceIDs: job.serviceIDs,
                        }));
                        setJobs(formattedJobs);
                    });
            })
            .catch((err) => {
                if (err.response && err.response.status === 404) {
                    console.warn("Không có công việc nào được đăng (404 - No records).");
                    setJobs([]);
                } else {
                    console.error("API Error:", err);
                    setError(t("error.error_loading"));
                    setLoading(false);
                }
            })
            .finally(() => {
                setLoading(false);
            });

    }, []);

    const mapGender = (genderID) => {
        switch (genderID) {
            case 1: return t("user.male");
            case 2: return t("user.female");
            case 3: return t("user.other");
            default: return t("misc.no_description");
        }
    };

    if (loading) return <div className="profile-container"><p>{t("error.loading_data")}</p></div>;
    if (error) return <div className="profile-container error">❌ {error}</div>;

    return (
        <div className="profile-container">
            {/* Profile Header */}
            <div className="profile-header">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <img
                            src={family?.localProfilePicture || family?.googleProfilePicture || defaultAvatar}
                            crossOrigin="anonymous"
                            alt="Avatar"
                        />
                    </div>
                    <h2 className="profile-name">
                        {family?.name || t("misc.no_description")}
                    </h2>
                </div>

                {/* Thông tin cá nhân */}
                <div className="profile-details">
                    <h1 className="profile-title">
                        {t("misc.personal_info")}
                        <button
                            className="profile-edit-button"
                            onClick={() => (window.location.href = "/family/profile/update")}
                            title={t("user.profile_update")}
                        >
                            ✏️
                        </button>
                    </h1>
                    <p className="profile-label"><strong>{t("user.nickname")}:</strong> {family?.nickname || t("misc.no_description")}</p>
                    <p className="profile-label"><strong>{t("user.gender")}:</strong> {mapGender(family?.gender)}</p>
                    <p className="profile-label"><strong>{t("user.address")}:</strong> {family?.address || t("misc.no_description")}</p>
                    <p className="profile-label"><strong>Email:</strong> {family?.email || t("misc.no_description")}</p>
                    <p className="profile-label"><strong>{t("user.phone")}:</strong> {family?.phone || t("misc.no_description")}</p>
                </div>
            </div>

            {/* Giới thiệu */}
            <div className="profile-left">
                <div className="profile-section">
                    <h2 className="section-title">{t("misc.introduction")}</h2>
                    <p className="profile-introduction">
                        {family?.introduction || t("misc.no_intro")}
                    </p>
                </div>
            </div>
        </div>
    );

};

export default FamilyProfilePage;
