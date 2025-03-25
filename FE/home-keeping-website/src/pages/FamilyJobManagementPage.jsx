import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import "../assets/styles/Job.css";

const generateFakeJobs = () => {
    const titles = [
        "Dọn dẹp nhà cửa", "Nấu ăn gia đình", "Chăm sóc trẻ em",
        "Giặt giũ quần áo", "Vệ sinh nhà tắm", "Rửa chén bát",
        "Dọn dẹp sân vườn", "Ủi quần áo", "Nấu tiệc cuối tuần", "Tổng vệ sinh ngày lễ"
    ];
    const locations = ["Quận 1", "Quận 3", "Gò Vấp", "Tân Bình", "Bình Thạnh", "Thủ Đức"];
    const types = ["Dọn dẹp", "Nấu ăn"];
    const statuses = [0, 1, 2];

    return Array.from({ length: 40 }, (_, i) => {
        const randomDaysAgo = Math.floor(Math.random() * 15);
        return {
            jobID: i + 1,
            title: titles[Math.floor(Math.random() * titles.length)],
            location: locations[Math.floor(Math.random() * locations.length)],
            salary: Math.floor(Math.random() * 100000) + 50000,
            jobName: types[Math.floor(Math.random() * types.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            postedDate: new Date(Date.now() - randomDaysAgo * 86400000).toISOString()
        };
    });
};

const FamilyJobManagementPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    const [jobs, setJobs] = useState([]);
    const [housekeepers, setHousekeepers] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const shouldShowLoadingOrError = loading || error;

    const [filter, setFilter] = useState({
        status: "all",
        jobName: "all",
        date: ""
    });
    const [jobToDelete, setJobToDelete] = useState(null);

    const [showBackToTop, setShowBackToTop] = useState(false);

    useEffect(() => {
        if (isDemo) {
            setJobs(generateFakeJobs());
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        if (!authToken) {
            setError(t("error_auth"));
            setLoading(false);
            return;
        }

        if (!accountID) {
            setError(t("error_account"));
            setLoading(false);
            return;
        }

        axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((accountRes) => {
                const account = accountRes.data;
                if (!account || !account.accountID) throw new Error(t("error_auth"));

                return axios.get(`http://localhost:5280/api/Families/SearchFamilyByAccountId?accountId=${accountID}`, { headers });
            })
            .then((familyResponse) => {
                const familyData = familyResponse.data?.[0];
                if (!familyData) throw new Error(t("error_loading"));

                return axios.get(`http://localhost:5280/api/Account/TotalAccount`, { headers });
            })
            .then((accountsRes) => {
                const accountsData = accountsRes.data;
                if (!accountsData) throw new Error("Accounts", t("error_loading"));
                setHousekeepers(accountsData.totalHousekeepers);

                return axios.get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountId=${accountID}`, { headers });
            })
            .then((jobRes) => {
                setJobs(jobRes.data || []);
            })
            .catch((err) => {
                console.error("API Error:", err);
                setError(t("error_loading"));
            })
            .finally(() => {
                setLoading(false);
            });

    }, [isDemo]);

    const filteredJobs = jobs.filter(job => {
        const { status, jobName, date } = filter;

        // Lọc theo dropdown
        if (status !== "all" && job.status !== parseInt(status)) return false;
        if (jobName !== "all" && job.jobName !== jobName) return false;
        if (date && job.postedDate.slice(0, 10) !== date) return false;

        return true;
    });

    const handleDeleteClick = (job) => {
        setJobToDelete(job);
    };

    const confirmDelete = async () => {
        if (!jobToDelete) return;

        try {
            await axios.delete(`http://localhost:5280/api/Job/DeleteJob`, {
                headers,
                params: { id: jobToDelete.jobID }
            });

            setJobs((prev) => prev.filter((j) => j.jobID !== jobToDelete.jobID));
            setJobToDelete(null);
        } catch (err) {
            console.error("Lỗi xoá công việc:", err);
            alert("Không thể xoá công việc. Vui lòng thử lại.");
        }
    };

    const cancelDelete = () => {
        setJobToDelete(null);
    };

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowBackToTop(scrollY > 150);
        };

        if (typeof window !== "undefined") {
            window.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (typeof window !== "undefined") {
                window.removeEventListener("scroll", handleScroll);
            }
        };
    }, []);

    if (shouldShowLoadingOrError) {
        return (
            <div className="job-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    const status4Jobs = jobs.filter((job) => job.status === 4).length;
    console.log(jobs);
    console.log(filteredJobs);

    return (
        <div className="job-management-page">
            {/* HEADER THỐNG KÊ */}
            <div className="job-management-header">
                <div className="job-management-stat">
                    <p className="title">{t("jobs_posted")}</p>
                    <div className="value">
                        {jobs.length} <i className="fa-solid fa-briefcase icon" />
                    </div>
                </div>
                <div className="job-management-stat">
                    <p className="title">{t("jobs_completed")}</p>
                    <div className="value">
                        {status4Jobs} <i className="fa-solid fa-check-circle icon" />
                    </div>
                </div>
                <div className="job-management-stat">
                    <p className="title">{t("housekeepers_waiting")}</p>
                    <div className="value">
                        {housekeepers}{" "}
                        <button className="btn-primary-small">{t("post_now")}</button>
                    </div>
                </div>
            </div>

            {/* BỐ CỤC TRÁI-PHẢI */}
            <div className="job-management-layout">
                <div className="job-management-filters">
                    <label>{t("status")}</label>
                    <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                        <option value="all">{t("all")}</option>
                        <option value="1">{t("job_pending")}</option>
                        <option value="2">{t("job_verified")}</option>
                        <option value="3">{t("job_accepted")}</option>
                        <option value="4">{t("job_completed")}</option>
                        <option value="5">{t("job_expired")}</option>
                        <option value="6">{t("job_canceled")}</option>
                    </select>

                    <label>{t("job_type")}</label>
                    <select value={filter.jobName} onChange={(e) => setFilter({ ...filter, jobName: e.target.value })}>
                        <option value="all">{t("all_job_types")}</option>
                        <option value="Chăm sóc trẻ">{t("babysitting")}</option>
                        <option value="Lau dọn nhà cửa">{t("cleaning")}</option>
                    </select>

                    <label>{t("date")}</label>
                    <input
                        type="date"
                        value={filter.date}
                        onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                    />
                </div>

                <div className="job-management-content">
                    <div className="job-management-tabs">
                        <span className="active-tab">{t("jobs_posted")}</span>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <p>{t("no_jobs_found")}</p>
                    ) : (
                        <div className="job-management-list">
                            {filteredJobs.map((job) => (
                                <div key={job.jobID} className="job-management-card">
                                    <div className="job-management-card-top">
                                        <div className="job-management-left">
                                            <h3 className="job-management-title">{job.title}</h3>
                                            <div className="job-management-info">
                                                <span>📅 {t("posted_days_ago", { days: Math.floor((Date.now() - new Date(job.postedDate)) / 86400000) })}</span>
                                                <span><FaMapMarkerAlt /> {job.location}</span>
                                                <span>
                                                    <FaMoneyBillWave />{" "}
                                                    {job.salary != null ? job.salary.toLocaleString("vi-VN") : "Không rõ"} VND/giờ
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`job-management-status-badge status-${job.status}`}>
                                            {job.status === 1 && t("job_pending")}
                                            {job.status === 2 && t("job_verified")}
                                            {job.status === 3 && t("job_accepted")}
                                            {job.status === 4 && t("job_completed")}
                                            {job.status === 5 && t("job_expired")}
                                            {job.status === 6 && t("job_canceled")}
                                        </div>
                                    </div>

                                    <div className="job-management-actions">
                                        <button className="btn-secondary" onClick={() => navigate(`/family/job/update/${job.jobID}`)}>{t("edit")}</button>
                                        <button className="btn-cancel" onClick={() => handleDeleteClick(job)}>{t("delete")}</button>
                                        <button className="btn-primary" onClick={() => navigate(`/family/job/detail/${job.jobID}`)}>
                                            {job.status === 2 ? t("view_applicants") : t("view_detail")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {jobToDelete && (
                <div className="popup-overlay">
                    <div className="popup-box">
                        <h4>{t("confirm_delete_title")}</h4>
                        <p>{t("confirm_delete_text", { title: jobToDelete.title })}</p>
                        <div className="popup-actions">
                            <button onClick={confirmDelete} className="btn-cancel">{t("confirm")}</button>
                            <button onClick={cancelDelete} className="btn-secondary">{t("cancel")}</button>
                        </div>
                    </div>
                </div>
            )}

            {showBackToTop && (
                <button
                    className={`btn-back-to-top show`}
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <i className="fa-solid fa-arrow-up" /> {t("back_to_top")}
                </button>
            )}
        </div>
    );

};

export default FamilyJobManagementPage;
