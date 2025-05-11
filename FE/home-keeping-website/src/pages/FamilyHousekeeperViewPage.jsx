import React, { useEffect, useState } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import {
  formatDate,
  formatGender
} from "../utils/formatData";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";
import API_BASE_URL from "../config/apiConfig";

const FamilyHousekeeperViewPage = () => {
  const { t } = useTranslation();
  const { accountID: housekeeperAccountID } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");
  const headers = { Authorization: `Bearer ${token}` };
  const applicantIDs = location.state?.applicantIDs || [];

  const [housekeeper, setHousekeeper] = useState(null);
  const [skills, setSkills] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mainError, setMainError] = useState(null);
  const [skillError, setSkillError] = useState(null);
  const [reviewError, setReviewError] = useState(null);
  const [currentPage, setCurrentPage] = useState(0);
  const reviewsPerPage = 3;
  const [averageScore, setAverageScore] = useState(null);

  useEffect(() => {
    const verifyAndLoad = async () => {
      if (!accountID || !token) {
        setMainError(t("error.error_auth"));
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByAccountID?id=${housekeeperAccountID}`, { headers });
        setHousekeeper(res.data);
      } catch {
        setMainError(t("error.error_account"));
        setLoading(false);
        return;
      }

      try {
        const skillRes = await axios.get(`${API_BASE_URL}/HousekeeperSkillMapping/GetSkillsByAccountID?accountId=${housekeeperAccountID}`, { headers });
        const ids = Array.isArray(skillRes.data) ? skillRes.data.map(s => s.houseKeeperSkillID) : [];

        const names = await Promise.all(
          ids.map(async (id) => {
            try {
              const res = await axios.get(`${API_BASE_URL}/HouseKeeperSkills/GetHousekeeperSkillById?id=${id}`, { headers });
              return res.data.skillCode || res.data.name;
            } catch {
              return null;
            }
          })
        );
        setSkills(names.filter(Boolean));
      } catch {
        setSkillError(t("error.error_skill"));
      }

      try {
        const ratingRes = await axios.get(`${API_BASE_URL}/Rating/GetRatingListByHK?id=${housekeeperAccountID}&pageNumber=1&pageSize=100`, { headers });
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
        if (enriched.length > 0) {
          const total = enriched.reduce((sum, r) => sum + r.score, 0);
          const avg = total / enriched.length;
          setAverageScore(avg);
        }
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
    <button className="btn btn-secondary" onClick={() => navigate(-1)}>
      ← {t("misc.back_to_top")}
    </button>
  ));
  if (feedback) return feedback;

  const alreadyApplied = applicantIDs.includes(Number(housekeeperAccountID));

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <button className="btn btn-outline-secondary" onClick={() => navigate(-1)}>
          ← {t("misc.back_to_search_housekeeper_page")}
        </button>
        {!alreadyApplied && (
          <button
            className="btn btn-warning shadow-sm fw-bold text-dark"
            onClick={() => navigate("/family/invite", { state: { housekeepers: [housekeeper] } })}
          >
            🤝 {t("misc.invite_to_work")}
          </button>
        )}
      </div>

      <div className="card mb-4 p-4 shadow rounded-4 border-info border-2">
        <div className="row g-4 align-items-center">
          <div className="col-md-3 text-center">
            <img
              src={housekeeper.localProfilePicture}
              alt={housekeeper.name}
              className="img-fluid rounded-circle border border-3 border-primary"
              style={{ width: "130px", height: "130px", objectFit: "cover" }}
            />
            <h5 className="mt-3 fw-bold text-primary-emphasis">{housekeeper.name}</h5>
          </div>

          <div className="col-md-9">
            <h5 className="fw-bold mb-3 text-primary">{t("misc.personal_info")}</h5>

            {/* Ratings */}
            <div className="mb-3">
              {housekeeper.rating !== undefined && (
                <div className="mb-1">
                  <strong className="text-success">{t("misc.profile_rating")}:</strong>{" "}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={`text-warning ${index < Math.round(housekeeper.rating) ? "" : "text-muted"}`}>★</span>
                  ))}
                  <span className="ms-2 text-muted">({housekeeper.rating.toFixed(1)})</span>
                </div>
              )}

              {averageScore !== null && (
                <div>
                  <strong className="text-info">{t("Đánh giá")}:</strong>{" "}
                  {Array.from({ length: 5 }).map((_, index) => (
                    <span key={index} className={`text-warning ${index < Math.round(averageScore) ? "" : "text-muted"}`}>★</span>
                  ))}
                  <span className="ms-2 text-muted">({averageScore.toFixed(1)})</span>
                </div>
              )}
            </div>

            {/* Info */}
            <p className="mb-1"><strong className="text-success">{t("user.gender")}:</strong> {formatGender(housekeeper.gender, t)}</p>
            <p className="mb-1"><strong className="text-success">{t("user.address")}:</strong> {housekeeper.address}</p>
            <p className="mb-1"><strong className="text-success">Email:</strong> {housekeeper.email}</p>
            <p className="mb-0"><strong className="text-success">{t("user.phone")}:</strong> {housekeeper.phone}</p>
          </div>
        </div>
      </div>

      <div className="card mb-4 p-4 shadow rounded-4 border-secondary-subtle">
        <h5 className="fw-bold mb-3 text-info">📝 {t("misc.introduction")}</h5>
        <p className="fst-italic text-dark-emphasis">{housekeeper.introduction || t("misc.no_intro")}</p>
      </div>

      <div className="card mb-4 p-4 shadow rounded-4 border-success-subtle">
        <h5 className="fw-bold mb-3 text-success">🛠 {t("misc.skills")}</h5>
        {skillError ? (
          <p className="text-muted">{skillError}</p>
        ) : skills.length > 0 ? (
          <div className="d-flex flex-wrap gap-2">
            {skills.map((skill, i) => (
              <span key={i} className="badge bg-success-subtle text-dark-emphasis border border-success rounded-pill px-3 py-2">
                {t(`skills.housekeeperSkillName.${skill}`, skill)}
              </span>
            ))}
          </div>
        ) : (
          <p>{t("misc.no_skill")}</p>
        )}
      </div>

      <div className="card mb-5 p-4 shadow rounded-4 border-warning-subtle">
        <h5 className="fw-bold mb-3 text-warning">⭐ {t("uncategorized.reviews")}</h5>
        {reviewError ? (
          <p className="text-muted">{reviewError}</p>
        ) : reviews.length === 0 ? (
          <p>{t("misc.no_review")}</p>
        ) : (
          <>
            {currentReviews.map((r, i) => (
              <div key={i} className="mb-4 border-bottom pb-3">
                <div className="d-flex justify-content-between">
                  <strong className="text-dark-emphasis">{r.reviewerName}</strong>
                  <small className="text-muted">{formatDate(r.date)}</small>
                </div>
                <div className="text-warning mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <span key={j} className={j < r.score ? "" : "text-muted"}>★</span>
                  ))}
                </div>
                <p className="text-dark-emphasis">{r.content}</p>
              </div>
            ))}
            <div className="d-flex justify-content-between">
              {currentPage > 0 && (
                <button className="btn btn-outline-secondary" onClick={() => setCurrentPage(p => p - 1)}>
                  ⬅ {t("pagination.previous")}
                </button>
              )}
              {currentPage < totalPages - 1 && (
                <button className="btn btn-primary" onClick={() => setCurrentPage(p => p + 1)}>
                  {t("pagination.next")} ➡
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FamilyHousekeeperViewPage;