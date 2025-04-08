import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "../assets/styles/Profile.css";
import "../assets/styles/icon.css";
import { formatDate } from "../utils/formatData";
import { useTranslation } from "react-i18next";

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

    useEffect(() => {
        const verifyAndLoad = async () => {
            if (!accountID || !token) {
                setMainError(t("error_auth"));
                setLoading(false);
                return;
            }

            try {
                const accRes = await axios.get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers });
                if (accRes.data.roleID !== 2) {
                    setMainError(t("error_auth"));
                    setLoading(false);
                    return;
                }

                const famRes = await axios.get(`http://localhost:5280/api/Families/GetFamilyByAccountID?id=${accountID}`, { headers });
                setFamilyID(famRes.data.familyID);
            } catch {
                setMainError(t("error_auth"));
                setLoading(false);
                return;
            }

            try {
                const hkRes = await axios.get(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${housekeeperAccountID}`, { headers });
                setHousekeeper(hkRes.data);
            } catch {
                setMainError(t("error_account"));
                setLoading(false);
                return;
            }

            try {
                const skillMapRes = await axios.get(
                    `http://localhost:5280/api/HousekeeperSkillMapping/GetSkillsByAccountID?accountId=${housekeeperAccountID}`,
                    { headers }
                );

                const skillIDs = Array.isArray(skillMapRes.data)
                    ? skillMapRes.data.map(s => s.houseKeeperSkillID)
                    : [];

                const skillCodes = await Promise.all(
                    skillIDs.map(async (id) => {
                        try {
                            const detail = await axios.get(
                                `http://localhost:5280/api/HouseKeeperSkills/GetHousekeeperSkillById?id=${id}`,
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
                setSkillError(t("error_skill"));
            }

            try {
                const ratingRes = await axios.get(
                    `http://localhost:5280/api/Rating/GetRatingListByHK?id=${housekeeperAccountID}&pageNumber=1&pageSize=100`, { headers });

                const enriched = await Promise.all(ratingRes.data.map(async (r) => {
                    try {
                        const fam = await axios.get(`http://localhost:5280/api/Families/GetFamilyByID?id=${r.familyID}`, { headers });
                        const acc = await axios.get(`http://localhost:5280/api/Account/GetAccount?id=${fam.data.accountID}`, { headers });
                        return {
                            reviewerName: acc.data.name,
                            score: r.score,
                            content: r.content,
                            date: r.createAt
                        };
                    } catch {
                        return { ...r, reviewerName: t("anonymous") };
                    }
                }));
                setReviews(enriched);
            } catch {
                setReviewError(t("error_review"));
            }

            setLoading(false);
        };

        verifyAndLoad();
    }, [housekeeperAccountID, t]);

    const totalPages = Math.ceil(reviews.length / reviewsPerPage);
    const currentReviews = reviews.slice(currentPage * reviewsPerPage, (currentPage + 1) * reviewsPerPage);

    if (loading || mainError) {
        return (
            <div className="profile-container">
                {loading && (
                    <div className="view-housekeeper-loading">
                        <span className="icon-loading" />
                        <p>{t("loading_data")}</p>
                    </div>
                )}
                {mainError && (
                    <div className="view-housekeeper-error">
                        <p>❌ {mainError}</p>
                        <button className="btn-secondary" onClick={() => navigate(-1)}>
                            ← {t("back_to_top")}
                        </button>
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="profile-container view-housekeeper-container">
            <button className="btn-secondary mb-3" onClick={() => navigate(-1)}>← {t("back_to_search_housekeeper_page")}</button>

            <div className="profile-header">
                <div className="profile-avatar-section">
                    <div className="profile-avatar">
                        <img src={housekeeper.localProfilePicture} alt={housekeeper.name} />
                    </div>
                    <h2 className="profile-name">{housekeeper.name}</h2>
                </div>
                <div className="profile-details">
                    <h1 className="profile-title">{t("personal_info")}</h1>
                    {housekeeper.rating && (
                        <div className="profile-rating">
                            {Array.from({ length: 5 }).map((_, index) => (
                                <span key={index} className={`star-icon ${index < Math.round(housekeeper.rating) ? "filled" : ""}`}>★</span>
                            ))}
                            <span className="rating-score">({housekeeper.rating.toFixed(1)})</span>
                        </div>
                    )}
                    <p className="profile-label"><strong>{t("gender")}:</strong> {housekeeper.gender === 1 ? t("male") : t("female")}</p>
                    <p className="profile-label"><strong>{t("address")}:</strong> {housekeeper.address}</p>
                    <p className="profile-label"><strong>Email:</strong> {housekeeper.email}</p>
                    <p className="profile-label"><strong>{t("phone")}:</strong> {housekeeper.phone}</p>
                </div>
            </div>

            <div className="profile-content-housekeeper">
                <div className="profile-left">
                    <div className="profile-section">
                        <h2 className="section-title">{t("introduction")}</h2>
                        <p className="profile-introduction">{housekeeper.introduction || t("no_intro")}</p>
                    </div>

                    <div className="profile-section">
                        <h2 className="section-title">{t("skills")}</h2>
                        {skillError ? (
                            <p className="text-muted">{skillError}</p>
                        ) : skills.length > 0 ? (
                            <div className="skills-list">
                                {skills.map((skill, i) => (
                                    <span key={i} className="skill-item">
                                        {t(`houseKeeperSkillName.${skill}`, skill)}
                                    </span>
                                ))}
                            </div>
                        ) : (
                            <p>{t("no_skill")}</p>
                        )}
                    </div>
                </div>

                <div className="profile-right">
                    <div className="profile-section">
                        <h2 className="section-title">{t("reviews")}</h2>
                        {reviewError ? (
                            <p className="text-muted">{reviewError}</p>
                        ) : reviews.length === 0 ? (
                            <p>{t("no_review")}</p>
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
                                            ⬅ {t("previous")}
                                        </button>
                                    )}
                                    {currentPage < totalPages - 1 && (
                                        <button className="btn-primary" onClick={() => setCurrentPage(p => p + 1)}>
                                            {t("next")} ➡
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
