import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Profile.css";
import "../assets/styles/icon.css";
import {
    formatDate,
    formatGender
} from "../utils/formatData";
import { useTranslation } from "react-i18next";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed
import { useLocation } from "react-router-dom";

const FamilyHousekeeperViewPage = () => {
    const { t } = useTranslation();
    const { accountID: housekeeperAccountID } = useParams();
    const navigate = useNavigate();

    const [familyID, setFamilyID] = useState(null);
    const [housekeeper, setHousekeeper] = useState(null);
    const [skills, setSkills] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [currentPage, setCurrentPage] = useState(0);
    const [loading, setLoading] = useState(true);
    const [mainError, setMainError] = useState(null);
    const [skillError, setSkillError] = useState(null);
    const [reviewError, setReviewError] = useState(null);
    const reviewsPerPage = 3;

    const token = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");
    const headers = { Authorization: `Bearer ${token}` };
    const location = useLocation();
    const applicantIDs = location.state?.applicantIDs || [];

    useEffect(() => {
        const verifyAndLoad = async () => {
            if (!accountID || !token) {
                setMainError(t("error.error_auth"));
                setLoading(false);
                return;
            }

            try {
                const accRes = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers });
                if (accRes.data.roleID !== 2) {
                    setMainError(t("error.error_auth"));
                    setLoading(false);
                    return;
                }

                const famRes = await axios.get(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${accountID}`, { headers });
                setFamilyID(famRes.data.familyID);
            } catch {
                setMainError(t("error.error_auth"));
                setLoading(false);
                return;
            }

            try {
                const hkRes = await axios.get(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByAccountID?id=${housekeeperAccountID}`, { headers });
                setHousekeeper(hkRes.data);
            } catch {
                setMainError(t("error.error_account"));
                setLoading(false);
                return;
            }

            try {
                const skillMapRes = await axios.get(
                    `${API_BASE_URL}/HousekeeperSkillMapping/GetSkillsByAccountID?accountId=${housekeeperAccountID}`,
                    { headers }
                );

                const skillIDs = Array.isArray(skillMapRes.data)
                    ? skillMapRes.data.map(s => s.houseKeeperSkillID)
                    : [];

                const skillCodes = await Promise.all(
                    skillIDs.map(async (id) => {
                        try {
                            const detail = await axios.get(
                                `${API_BASE_URL}/HouseKeeperSkills/GetHousekeeperSkillById?id=${id}`,
                                { headers }
                            );
                            return detail.data.skillCode || detail.data.name;
                        } catch {
                            return null;
                        }
                    })
                );

                setSkills(skillCodes.filter(Boolean));
            } catch {
                setSkillError(t("error.error_skill"));
            }

            try {
                const ratingRes = await axios.get(
                    `${API_BASE_URL}/Rating/GetRatingListByHK?id=${housekeeperAccountID}&pageNumber=1&pageSize=100`, { headers });

                const enriched = await Promise.all(ratingRes.data.map(async (r) => {
                    try {
                        const fam = await axios.get(`${API_BASE_URL}/Families/GetFamilyByID?id=${r.familyID}`, { headers });
                        const acc = await axios.get(`${API_BASE_URL}/Account/GetAccount?id=${fam.data.accountID}`, { headers });
                        return {
                            reviewerName: acc.data.name,
                            score: r.score,
                            content: r.content,
                            date: r.createAt
                        };
                    } catch {
                        return { ...r, reviewerName: t("misc.anonymous") };
                    }
                }));
                setReviews(enriched);
            } catch {
                setReviewError(t("error.error_review"));
            }

            setLoading(false);
        };

        verifyAndLoad();
    }, [housekeeperAccountID, t]);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const currentReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

    const feedback = shouldShowLoadingOrError(loading, mainError, t, (
        <button className="btn-secondary" onClick={() => navigate(-1)}>
            ← {t("misc.back_to_top")}
        </button>
    ));
    if (feedback) return feedback;
    const alreadyApplied = applicantIDs.includes(Number(housekeeperAccountID));
    
    return (
        <div className="profile-container view-housekeeper-container">
            <div className="view-housekeeper-header-action">
                <button className="btn-secondary" onClick={() => navigate(-1)}>
                    ← {t("misc.back_to_search_housekeeper_page")}
                </button>
                {!alreadyApplied && (
                    <button
                        className="btn-invite"
                        onClick={() =>
                            navigate("/family/invite", { state: { housekeepers: [housekeeper] } })
                        }
                    >
                        🤝 {t("misc.invite_to_work")}
                    </button>
                )}
            </div>

            <div className="profile-header">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <img src={housekeeper.localProfilePicture} alt={housekeeper.name} />
                    </div>
                    <h2 className="profile-name">{housekeeper.name}</h2>
                </div>
                <div className="profile-details">
                    <h1 className="profile-title">{t("misc.personal_info")}</h1>
                    {housekeeper.rating && (
                        <div className="profile-rating">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span key={index} className={`star-icon ${index < Math.round(housekeeper.rating) ? "filled" : ""}`}>★</span>
                            ))}
                            <span className="rating-score">({housekeeper.rating.toFixed(1)})</span>
                        </div>
                    )}
                    <p className="profile-label"><strong>{t("user.gender")}:</strong> {formatGender(housekeeper.gender, t)}</p>
                    <p className="profile-label"><strong>{t("user.address")}:</strong> {housekeeper.address}</p>
                    <p className="profile-label"><strong>Email:</strong> {housekeeper.email}</p>
                    <p className="profile-label"><strong>{t("user.phone")}:</strong> {housekeeper.phone}</p>
                </div>
            </div>

            <div className="profile-content-housekeeper">
                <div className="profile-left">
                    <div className="profile-section">
                        <h2 className="section-title">{t("misc.introduction")}</h2>
                        <p className="profile-introduction">{housekeeper.introduction || t("misc.no_intro")}</p>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">{t("misc.skills")}</h2>
                        {skillError ? (
                            <p className="text-muted">{skillError}</p>
                        ) : skills.length > 0 ? (
                            <div className="skills-list">
                                {skills.map((skill, i) => (
                                    <span key={i} className="skill-item">
                                        {t(`skills.housekeeperSkillName.${skill}`, skill)}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>{t("misc.no_skill")}</p>
                        )}
                    </div>
                </div>

                <div className="profile-right">
                    <div className="profile-section">
                        <h2 className="section-title">{t("job.jobDetail.workingSchedule")}</h2>
                        <div className="schedule-box">
                            {housekeeper.workingDays && housekeeper.slotIDs
                                ? renderWorkingTime(housekeeper.workingDays, housekeeper.slotIDs, t)
                                : t("job.jobDetail.noSchedule")}
                        </div>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">{t("uncategorized.reviews")}</h2>
                        {reviewError ? (
                            <p className="text-muted">{reviewError}</p>
                        ) : reviews.length === 0 ? (
                            <p>{t("misc.no_review")}</p>
                        ) : (
                            <>
                                {currentReviews.map((r, i) => (
                                    <div key={i} className="review-item">
                                        <div className="review-header">
                                            <span className="review-name">{r.reviewerName}</span>
                                            <span className="review-date">{formatDate(r.date)}</span>
                                        </div>
                                        <div className="review-rating">
                                            {Array.from({ length: 5 }).map((_, j) => (
                                                <span key={j} className={j < r.score ? "star filled" : "star"}>★</span>
                                            ))}
                                        </div>
                                        <p className="review-text">{r.content}</p>
                                    </div>
                                ))}
                                <div className="view-housekeeper-pagination">
                                    {currentPage > 0 && (
                                        <button className="btn-secondary" onClick={() => setCurrentPage(p => p - 1)}>
                                            ⬅ {t("pagination.previous")}
                                        </button>
                                    )}
                                    {currentPage < totalPages - 1 && (
                                        <button className="btn-primary" onClick={() => setCurrentPage(p => p + 1)}>
                                            {t("pagination.next")} ➡
                                        </button>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FamilyHousekeeperViewPage;
