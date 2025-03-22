import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
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
            jobType: types[Math.floor(Math.random() * types.length)],
            status: statuses[Math.floor(Math.random() * statuses.length)],
            postedDate: new Date(Date.now() - randomDaysAgo * 86400000).toISOString()
        };
    });
};

const FamilyJobManagePage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [filter, setFilter] = useState({ status: "Tất cả", jobType: "Tất cả", date: "" });
    const [activeTab, setActiveTab] = useState("active");

    useEffect(() => {
        if (isDemo) {
            setJobs(generateFakeJobs());
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        const accountID = localStorage.getItem("accountID");
        const authToken = localStorage.getItem("authToken");

        if (!accountID || !authToken) {
            setError("Thiếu thông tin đăng nhập.");
            setLoading(false);
            return;
        }

        const headers = {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json"
        };

        axios.get(`http://localhost:5280/api/Family/GetFamilyByAccountID?id=${accountID}`, { headers })
            .then((res) => {
                const family = res.data;
                if (!family || !family.familyID) throw new Error("Không tìm thấy thông tin Family.");

                axios.get(`http://localhost:5280/api/Job/GetJobsByFamilyID?familyID=${family.familyID}`, { headers })
                    .then((res2) => {
                        setJobs(res2.data || []);
                    })
                    .catch((err) => {
                        console.error("Lỗi khi lấy danh sách công việc:", err);
                        setError("Không thể tải công việc.");
                    })
                    .finally(() => {
                        setLoading(false);
                    });
            })
            .catch((err) => {
                console.error("Lỗi khi lấy Family:", err);
                setError("Không thể tải thông tin người dùng.");
                setLoading(false);
            });
    }, [isDemo]);

    if (loading) {
        return (
            <div className="dashboard-container">
                <span className="icon-loading"></span>
                <p>{t("loading_data")}</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-container">
                <p className="error">❌ {error}</p>
                {!isDemo && (
                    <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                        {t("view_demo")}
                    </button>
                )}
            </div>
        );
    }

    const filteredJobs = jobs.filter(job => {
        const { status, jobType, date } = filter;
        if (status !== "Tất cả" && job.status.toString() !== status) return false;
        if (jobType !== "Tất cả" && job.jobType !== jobType) return false;
        if (date && job.postedDate.slice(0, 10) !== date) return false;

        if (activeTab === "active") return job.status === 0;
        if (activeTab === "hired") return job.status === 1;
        if (activeTab === "completed") return job.status === 2;
        return true;
    });

    return (
        <div className="job-management-page">
            {/* HEADER THỐNG KÊ */}
            <div className="job-management-header">
                <div className="job-management-stat">
                    <p className="title">{t("jobs_posted")}</p>
                    <div className="value">
                        15 <i className="fa-solid fa-briefcase icon" />
                    </div>
                </div>
                <div className="job-management-stat">
                    <p className="title">{t("jobs_completed")}</p>
                    <div className="value">
                        8 <i className="fa-solid fa-check-circle icon" />
                    </div>
                </div>
                <div className="job-management-stat">
                    <p className="title">{t("jobs_waiting")}</p>
                    <div className="value">
                        2M+{" "}
                        <button className="btn-primary-small">{t("post_now")}</button>
                    </div>
                </div>
            </div>

            {/* BỐ CỤC TRÁI-PHẢI */}
            <div className="job-management-layout">
                <div className="job-management-filters">
                    <label>{t("status")}</label>
                    <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                        <option value="Tất cả">{t("all")}</option>
                        <option value="0">{t("recruiting")}</option>
                        <option value="1">{t("hired")}</option>
                        <option value="2">{t("completed")}</option>
                    </select>

                    <label>{t("job_type")}</label>
                    <select value={filter.jobType} onChange={(e) => setFilter({ ...filter, jobType: e.target.value })}>
                        <option value="Tất cả">{t("all_job_types")}</option>
                        <option value="Dọn dẹp">{t("cleaning")}</option>
                        <option value="Nấu ăn">{t("cooking")}</option>
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
                        {["active", "hired", "completed"].map((key) => (
                            <span
                                key={key}
                                className={activeTab === key ? "active-tab" : ""}
                                onClick={() => setActiveTab(key)}
                            >
                                {t(key)}
                            </span>
                        ))}
                    </div>

                    {filteredJobs.length === 0 ? (
                        <p>{t("no_jobs_found")}</p>
                    ) : (
                        <div className="job-management-list">
                            {filteredJobs.map((job) => (
                                <div key={job.jobID} className="job-management-card">
                                    <h3 className="job-management-title">{job.title}</h3>
                                    <div className="job-management-info">
                                        <span>📅 {t("posted_days_ago", { days: Math.floor((Date.now() - new Date(job.postedDate)) / 86400000) })}</span>
                                        <span><FaMapMarkerAlt /> {job.location}</span>
                                        <span><FaMoneyBillWave /> {job.salary.toLocaleString()} VND/giờ</span>
                                    </div>
                                    <div className={`job-management-status status-${job.status}`}>
                                        {job.status === 0 ? t("recruiting") : job.status === 1 ? t("hired") : t("completed")}
                                    </div>
                                    <div className="job-management-actions">
                                        <button className="btn-secondary">{t("edit")}</button>
                                        <button className="btn-cancel">{t("delete")}</button>
                                        <button className="btn-primary">
                                            {job.status === 0 ? t("view_applicants") : t("view_detail")}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

};

export default FamilyJobManagePage;
