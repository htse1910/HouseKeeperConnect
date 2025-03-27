import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave } from "react-icons/fa";
import axios from "axios";
import useFamilyJobs from "../hooks/useFamilyJobs"; // ✅ Nhớ import hook mới
import "../assets/styles/Job.css";

const FamilyJobManagementPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const {
        jobs,
        services,
        jobServices,
        housekeepers,
        loading,
        error,
        isNoProfile,
        isNoJob,
        setJobs
    } = useFamilyJobs({ isDemo, accountID, authToken, t });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split("T")[0];

    const [filter, setFilter] = useState({
        status: "all",
        jobName: "all",
        start_date: defaultDate
    });
    
    const [jobToDelete, setJobToDelete] = useState(null);
    const [showBackToTop, setShowBackToTop] = useState(false);

    const text = {
        jobsPosted: t("job.posted"),
        jobsCompleted: t("job.completed"),
        jobType: t("job.type"),
        all: t("filter.all"),
        allJobTypes: t("filter.all_job_types"),
        noJobsYet: t("no_jobs_yet"),
        noJobsFound: t("no_jobs_found"),
        noProfile: t("no_family_profile"),
        confirmDeleteTitle: t("popup.confirm_delete_title"),
        confirmDeleteText: (title) => t("popup.confirm_delete_text", { title }),
        backToTop: t("back_to_top"),
        viewApplicants: t("job.view_applicants"),
        viewDetail: t("job.view_detail"),
    };

    const jobStatusMap = React.useMemo(() => ({
        1: t("job_pending"),
        2: t("job_verified"),
        3: t("job_accepted"),
        4: t("job_completed"),
        5: t("job_expired"),
        6: t("job_canceled"),
    }), [t]);

    const shouldShowLoadingOrError = loading || error;

    const filteredJobs = jobs.filter(job => {
        const { status, jobName, date } = filter;
        if (status !== "all" && job.status !== parseInt(status)) return false;
        if (jobName !== "all" && !job.jobTypeList?.includes(jobName)) return false;
        if (date && job.createdDate.slice(0, 10) !== date) return false;
        return true;
    });

    const handleDeleteClick = (job) => setJobToDelete(job);

    const confirmDelete = async () => {
        if (!jobToDelete) return;

        try {
            await axios.delete(`http://localhost:5280/api/Job/DeleteJob`, {
                headers: {
                    Authorization: `Bearer ${authToken}`,
                    "Content-Type": "application/json"
                },
                params: { id: jobToDelete.jobID }
            });

            setJobs((prev) => prev.filter((j) => j.jobID !== jobToDelete.jobID));
            setJobToDelete(null);
        } catch (err) {
            console.error("Lỗi xoá công việc:", err);
            alert(t("job.delete_failed"));
        }
    };

    const cancelDelete = () => setJobToDelete(null);

    useEffect(() => {
        const handleScroll = () => {
            const scrollY = window.scrollY;
            setShowBackToTop(scrollY > 150);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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
                    <p className="title">{text.jobsPosted}</p>
                    <div className="value">
                        {jobs.length} <i className="fa-solid fa-briefcase icon" />
                    </div>
                </div>
                <div className="job-management-stat">
                    <p className="title">{text.jobsCompleted}</p>
                    <div className="value">
                        {status4Jobs} <i className="fa-solid fa-check-circle icon" />
                    </div>
                </div>
                <div className="job-management-stat">
                    <p className="title">{t("housekeepers_waiting")}</p>
                    <div className="value">
                        {housekeepers}{" "}
                        <button className="btn-primary-small" onClick={() => navigate("/job-posting")}>
                            {t("post_now")}
                        </button>
                    </div>
                </div>
            </div>

            {/* BỐ CỤC TRÁI-PHẢI */}
            <div className="job-management-layout">
                <div className="job-management-filters">
                    <label>{t("status")}</label>
                    <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                        <option value="all">{text.all}</option>
                        {Object.entries(jobStatusMap).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <label>{text.jobType}</label>
                    <select
                        value={filter.jobName}
                        onChange={(e) => setFilter({ ...filter, jobName: e.target.value })}
                    >
                        <option value="all">{text.allJobTypes}</option>
                        {services.map((s) => (
                            <option key={s.serviceID} value={s.serviceName}>
                                {s.serviceName}
                            </option>
                        ))}
                    </select>

                    <label>{t("filter.start_date")}</label>
                    <input
                        type="date"
                        value={filter.start_date}
                        onChange={(e) => setFilter({ ...filter, date: e.target.value })}
                    />
                </div>

                <div className="job-management-content">
                    <div className="job-management-tabs">
                        <span className="active-tab">{text.jobsPosted}</span>
                    </div>

                    {filteredJobs.length === 0 ? (
                        <>
                            {isNoProfile ? (
                                <p>{text.noProfile}</p>
                            ) : isNoJob ? (
                                <p>{text.noJobsYet}</p>
                            ) : (
                                <p>{text.noJobsFound}</p>
                            )}
                        </>
                    ) : (
                        <div className="job-management-list">
                            {filteredJobs.map((job) => (
                                <div key={job.jobID} className="job-management-card">
                                    <div className="job-management-card-top">
                                        <div className="job-management-left">
                                            <h3 className="job-management-title">{job.jobName}</h3>
                                            <div className="job-management-info">
                                                <span>📅 {t("job.posted_days_ago", { days: Math.floor((Date.now() - new Date(job.createdDate)) / 86400000) })}</span>
                                                <span><FaMapMarkerAlt /> {job.location}</span>
                                                <span>
                                                    <FaMoneyBillWave />{" "}
                                                    {job.salary != null ? job.salary.toLocaleString("vi-VN") : t("job.not_sure")} VND/giờ
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`job-management-status-badge status-${job.status}`}>
                                            {jobStatusMap[job.status]}
                                        </div>
                                    </div>

                                    <div className="job-management-actions">
                                        <button className="btn-secondary" onClick={() => navigate(`/family/job/update/${job.jobID}`)}>{t("job.edit")}</button>
                                        <button className="btn-cancel" onClick={() => handleDeleteClick(job)}>{t("job.delete")}</button>
                                        <button className="btn-primary" onClick={() => navigate(`/family/job/detail/${job.jobID}`)}>
                                            {job.status === 2 ? text.viewApplicants : text.viewDetail}
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
                        <h4>{text.confirmDeleteTitle}</h4>
                        <p>{text.confirmDeleteText(jobToDelete.jobName)}</p>
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
                    <i className="fa-solid fa-arrow-up" /> {text.backToTop}
                </button>
            )}
        </div>
    );

};

export default FamilyJobManagementPage;
