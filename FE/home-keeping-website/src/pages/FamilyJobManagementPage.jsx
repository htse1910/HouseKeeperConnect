import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";
import axios from "axios";
import useFamilyJobs from "../hooks/useFamilyJobs";
import "../assets/styles/Job.css";
import { useBackToTop, renderBackToTopButton } from "../utils/uiHelpers";
import { getPagination } from "../utils/uiHelpers";
import Pagination from "../components/Pagination";

const FamilyJobManagementPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const {
        jobs,
        services,
        housekeepers,
        loading,
        error,
        isNoProfile,
        isNoJob,
        setJobs
    } = useFamilyJobs({ accountID, authToken, t });

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const defaultDate = tomorrow.toISOString().split("T")[0];

    const [filter, setFilter] = useState({
        status: "all",
        serviceType: "all",
        start_date: ""
    });

    const showBackToTop = useBackToTop();
    const [jobToDelete, setJobToDelete] = useState(null);

    const text = {
        jobsPosted: t("job.job.posted"),
        jobsCompleted: t("job.job.completed"),
        jobType: t("job.job.type"),
        all: t("filter.filter.all"),
        allJobTypes: t("filter.filter.all_job_types"),
        noJobsYet: t("job.no_jobs_yet"),
        noJobsFound: t("misc.no_jobs_found"),
        noProfile: t("job.no_family_profile"),
        confirmDeleteTitle: t("popup.popup.confirm_delete_title"),
        confirmDeleteText: (title) => t("popup.popup.confirm_delete_text", { title }),
        backToTop: t("misc.back_to_top"),
        viewApplicants: t("job.job.view_applicants"),
        viewDetail: t("job.job.view_detail"),
    };

    const jobStatusMap = React.useMemo(() => ({
        1: t("job.job_pending"),
        2: t("job.job_verified"),
        3: t("job.job_accepted"),
        4: t("job.job_completed"),
        5: t("job.job_expired"),
        6: t("job.job_canceled"),
    }), [t]);

    const serviceList = [
        { serviceID: 1, key: "RoomCleaning", serviceType: "Cleaning" },
        { serviceID: 2, key: "BathroomSanitization", serviceType: "Cleaning" },
        { serviceID: 3, key: "WindowCleaning", serviceType: "Cleaning" },
        { serviceID: 4, key: "DustRemoval", serviceType: "Cleaning" },
        { serviceID: 5, key: "MoppingFloor", serviceType: "Cleaning" },

        { serviceID: 6, key: "WashAndFold", serviceType: "Laundry" },
        { serviceID: 7, key: "IroningClothes", serviceType: "Laundry" },
        { serviceID: 8, key: "DryCleaning", serviceType: "Laundry" },
        { serviceID: 9, key: "CurtainCleaning", serviceType: "Laundry" },
        { serviceID: 10, key: "BeddingCleaning", serviceType: "Laundry" },

        { serviceID: 11, key: "DailyMealPrep", serviceType: "Cooking" },
        { serviceID: 12, key: "VegetarianCooking", serviceType: "Cooking" },
        { serviceID: 13, key: "BabyFoodPrep", serviceType: "Cooking" },
        { serviceID: 14, key: "SpecialDietCooking", serviceType: "Cooking" },
        { serviceID: 15, key: "PartyCooking", serviceType: "Cooking" },

        { serviceID: 16, key: "InfantCare", serviceType: "Childcare" },
        { serviceID: 17, key: "HomeworkHelp", serviceType: "Childcare" },
        { serviceID: 18, key: "SchoolPickup", serviceType: "Childcare" },
        { serviceID: 19, key: "PlaytimeSupervision", serviceType: "Childcare" },
        { serviceID: 20, key: "BedtimeRoutine", serviceType: "Childcare" },

        { serviceID: 21, key: "MedicationReminder", serviceType: "ElderlyCare" },
        { serviceID: 22, key: "Companionship", serviceType: "ElderlyCare" },
        { serviceID: 23, key: "MobilityAssistance", serviceType: "ElderlyCare" },
        { serviceID: 24, key: "MealFeeding", serviceType: "ElderlyCare" },
        { serviceID: 25, key: "PersonalHygiene", serviceType: "ElderlyCare" },

        { serviceID: 26, key: "LawnMowing", serviceType: "Gardening" },
        { serviceID: 27, key: "WeedRemoval", serviceType: "Gardening" },
        { serviceID: 28, key: "PlantWatering", serviceType: "Gardening" },
        { serviceID: 29, key: "GardenCleanup", serviceType: "Gardening" },
        { serviceID: 30, key: "TreePruning", serviceType: "Gardening" },

        { serviceID: 31, key: "DogWalking", serviceType: "PetCare" },
        { serviceID: 32, key: "PetFeeding", serviceType: "PetCare" },
        { serviceID: 33, key: "PetBathing", serviceType: "PetCare" },
        { serviceID: 34, key: "LitterCleaning", serviceType: "PetCare" },
        { serviceID: 35, key: "PetSitting", serviceType: "PetCare" },

        { serviceID: 36, key: "WeeklyGroceries", serviceType: "GroceryShopping" },
        { serviceID: 37, key: "UrgentPurchase", serviceType: "GroceryShopping" },
        { serviceID: 38, key: "PrescriptionPickup", serviceType: "GroceryShopping" },
        { serviceID: 39, key: "MarketShopping", serviceType: "GroceryShopping" },
        { serviceID: 40, key: "SupermarketRun", serviceType: "GroceryShopping" },

        { serviceID: 41, key: "DailyDishwashing", serviceType: "Dishwashing" },
        { serviceID: 42, key: "EventCleanup", serviceType: "Dishwashing" },
        { serviceID: 43, key: "DeepSinkCleaning", serviceType: "Dishwashing" },
        { serviceID: 44, key: "UtensilSterilization", serviceType: "Dishwashing" },
        { serviceID: 45, key: "KitchenCleaning", serviceType: "Dishwashing" },

        { serviceID: 46, key: "ExteriorWash", serviceType: "CarWash" },
        { serviceID: 47, key: "InteriorVacuum", serviceType: "CarWash" },
        { serviceID: 48, key: "FullCarWash", serviceType: "CarWash" },
        { serviceID: 49, key: "WaxPolishing", serviceType: "CarWash" },
        { serviceID: 50, key: "TireShine", serviceType: "CarWash" }
    ];

    const shouldShowLoadingOrError = loading || error;

    const filteredJobs = jobs.filter(job => {
        const { status, serviceType, start_date } = filter;

        if (status !== "all" && job.status !== parseInt(status)) return false;

        if (
            serviceType !== "all" &&
            (!Array.isArray(job.serviceTypes) ||
                !job.serviceTypes.includes(serviceType))
        ) return false;

        if (start_date) {
            const jobDate = new Date(job.createdDate).setHours(0, 0, 0, 0);
            const filterDate = new Date(start_date).setHours(0, 0, 0, 0);
            if (jobDate < filterDate) return false;
        }

        return true;
    });


    const handleViewDetail = (job) => {
        navigate(`/family/job/detail/${job.jobID}`, {
            state: {
                createdDate: job.createdDate
            }
        });
    };

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

    const [currentPage, setCurrentPage] = useState(1);
    const [inputPage, setInputPage] = useState("");
    const pageSize = 6;

    const {
        paginatedData,
        pageRange,
        totalPages
    } = getPagination(filteredJobs, currentPage, pageSize);

    useEffect(() => {
        setCurrentPage(1);
    }, [filter]);

    if (shouldShowLoadingOrError) {
        return (
            <div className="job-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("misc.loading_data")}</p>
                    </>
                )}
            </div>
        );
    }

    const status4Jobs = jobs.filter((job) => job.status === 4).length;

    console.log("SERVICE TYPE FILTER:", filter.serviceType);
    console.log("JOB SERVICE TYPES:", jobs.map(j => ({ id: j.jobID, serviceTypes: j.serviceTypes })));

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
                    <p className="title">{t("misc.housekeepers_waiting")}</p>
                    <div className="value">
                        {housekeepers}{" "}
                        <button className="btn-primary-small" onClick={() => navigate("/family/post-job")}>
                            {t("misc.post_now")}
                        </button>
                    </div>
                </div>
            </div>

            {/* BỐ CỤC TRÁI-PHẢI */}
            <div className="job-management-layout">
                <div className="job-management-filters">
                    <label>{t("status.status")}</label>
                    <select value={filter.status} onChange={(e) => setFilter({ ...filter, status: e.target.value })}>
                        <option value="all">{text.all}</option>
                        {Object.entries(jobStatusMap).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <label>{text.jobType}</label>
                    <select
                        value={filter.serviceType}
                        onChange={(e) => setFilter({ ...filter, serviceType: e.target.value })}
                    >
                        <option value="all">{text.allJobTypes}</option>
                        {[...new Set(serviceList.map(s => s.serviceType))].map(type => (
                            <option key={type} value={type}>
                                {t(`serviceTypeName.${type}`, type)}
                            </option>
                        ))}
                    </select>

                    <label>{t("filter.filter.start_date")}</label>
                    <input
                        type="date"
                        value={filter.start_date}
                        onChange={(e) => setFilter({ ...filter, start_date: e.target.value })}
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
                            {paginatedData.map((job) => (
                                <div key={job.jobID} className="job-management-card">
                                    <div className="job-management-card-top">
                                        <div className="job-management-left">
                                            <h3 className="job-management-title">{job.jobName}</h3>
                                            <div className="job-management-info">
                                                <span>
                                                    <FaCalendarCheck />{" "}
                                                    {t("job.job.posted_days_ago", { days: Math.floor((Date.now() - new Date(job.createdDate)) / 86400000) })}
                                                </span>
                                                <span>
                                                    <FaMapMarkerAlt />{" "}
                                                    {job.location}
                                                </span>
                                                <span>
                                                    <FaMoneyBillWave />{" "}
                                                    {job.salary != null ? job.salary.toLocaleString("vi-VN") : t("job.job.not_sure")} VNĐ/giờ
                                                </span>
                                            </div>
                                        </div>

                                        <div className={`job-management-status-badge status-${job.status}`}>
                                            {jobStatusMap[job.status]}
                                        </div>
                                    </div>

                                    <div className="job-management-actions">
                                        <button className="btn-secondary" onClick={() => navigate(`/family/job/update/${job.jobID}`)}>{t("job.job.edit")}</button>
                                        <button className="btn-cancel" onClick={() => handleDeleteClick(job)}>{t("job.job.delete")}</button>
                                        <button className="btn-primary" onClick={() => handleViewDetail(job)}>
                                            {job.status === 2 ? text.viewApplicants : text.viewDetail}
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        pageRange={pageRange}
                        inputPage={inputPage}
                        onPageChange={(page) => setCurrentPage(page)}
                        onPageInput={(e) => setInputPage(e.target.value)}
                        onPageSubmit={(e) => {
                            e.preventDefault();
                            const page = parseInt(inputPage);
                            if (!isNaN(page) && page >= 1 && page <= totalPages) {
                                setCurrentPage(page);
                                setInputPage("");
                            }
                        }}
                    />
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

            {showBackToTop && renderBackToTopButton(t)}
        </div>
    );

};

export default FamilyJobManagementPage;
