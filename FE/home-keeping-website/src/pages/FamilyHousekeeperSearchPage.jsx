import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import { FaSearch, FaMapMarkerAlt } from "react-icons/fa";

import "../assets/styles/Search.css";
import {
  formatHourlyCurrency,
  formatWorkTypeClass,
  formatWorkTypeLabel,
  formatGender,
  formatSkillName
} from "../utils/formatData";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";

const FamilyHousekeeperSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedSkill, setSelectedSkill] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSalaryOrder, setSelectedSalaryOrder] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authToken = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  useEffect(() => {
    if (!authToken || !accountID) {
      setError(t("error.error_auth"));
      setLoading(false);
      return;
    }

    setLoading(true);

    axios
      .get("${API_BASE_URL}/HouseKeeper/HousekeeperDisplay", {
        headers,
        params: { pageNumber: 1, pageSize: 100 }
      })
      .then(async (res) => {
        const displayList = res.data;

        // For each housekeeper, get their account to check roleID
        const enrichedList = await Promise.all(
          displayList.map(async (hk) => {
            try {
              const accRes = await axios.get("${API_BASE_URL}/Account/GetAccount", {
                params: { id: hk.accountID },
                headers
              });

              // Only include HouseKeeper (roleID === 1)
              if (accRes.data?.roleID === 1) {
                return {
                  ...hk,
                  name: accRes.data.name, // override if needed
                  avatar: hk.localProfilePicture || hk.googleProfilePicture,
                  rating: hk.rating || 0
                };
              }

              return null;
            } catch {
              return null;
            }
          })
        );

        const filteredHK = enrichedList.filter(Boolean); // remove nulls
        setHousekeepers(filteredHK);
      })
      .catch(() => setError(t("error.error_loading")))
      .finally(() => setLoading(false));
  }, []);

  const feedback = shouldShowLoadingOrError(loading, error, t);
  if (feedback) return feedback;

  const filtered = housekeepers
    .filter(
      (h) =>
        h.name?.toLowerCase().includes(searchTerm.trim().toLowerCase()) &&
        h.address?.toLowerCase().includes(location.trim().toLowerCase()) &&
        (selectedSkill === "" || h.skills?.includes(selectedSkill)) &&
        (selectedGender === "" || String(h.gender) === selectedGender) &&
        (selectedWorkType === "" || h.workType === selectedWorkType)
    )
    .sort((a, b) => {
      if (!selectedSalaryOrder) return 0;
      return selectedSalaryOrder === "asc"
        ? a.salary - b.salary
        : b.salary - a.salary;
    });

  return (
    <div className="search-page">
      <div className="search-page-header">
        <div className="search-page-panel">
          <div className="search-page-box">
            <div className="search-page-icon">
              <FaSearch />
            </div>
            <input
              className="search-page-input"
              type="text"
              placeholder={t("misc.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="search-page-filter-row">
            <select
              className="search-page-select"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            >
              <option value="">{t("misc.location")}</option>
              <option value="Hà Nội">Hà Nội</option>
              <option value="TP.HCM">TP.HCM</option>
              <option value="Đà Nẵng">Đà Nẵng</option>
            </select>

            <select
              className="search-page-select"
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
            >
              <option value="">{t("misc.skills")}</option>
              <option value="Cleaning">{t("service.serviceTypeName.Cleaning")}</option>
              <option value="Laundry">{t("service.serviceTypeName.Laundry")}</option>
              <option value="Cooking">{t("service.serviceTypeName.Cooking")}</option>
            </select>

            <select
              className="search-page-select"
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
            >
              <option value="">{t("user.gender")}</option>
              <option value="1">{t("user.male")}</option>
              <option value="2">{t("user.female")}</option>
            </select>

            <select
              className="search-page-select"
              value={selectedSalaryOrder}
              onChange={(e) => setSelectedSalaryOrder(e.target.value)}
            >
              <option value="">{t("misc.salary")}</option>
              <option value="asc">{t("misc.salary_asc")}</option>
              <option value="desc">{t("misc.salary_desc")}</option>
            </select>

            <select
              className="search-page-select"
              value={selectedWorkType}
              onChange={(e) => setSelectedWorkType(e.target.value)}
            >
              <option value="">{t("job.job_type")}</option>
              <option value="Once">{t("job.jobPost.once")}</option>
              <option value="Period">{t("job.jobPost.period")}</option>

            </select>

            <button className="search-page-btn">{t("misc.search")}</button>
          </div>
        </div>
      </div>

      <div className="search-page-result-container">
        {filtered.length > 0 ? (
          filtered.map((h, idx) => (
            <div key={idx} className="search-page-card">
              {h.avatar && (
                <img
                  src={h.avatar}
                  alt={h.name}
                  className="search-page-avatar-img"
                  onError={(e) => {
                    e.target.style.display = "none";
                  }}
                />
              )}

              <h5 className="search-page-title">
                {h.name}
                {h.workType && (
                  <span className={`search-page-badge-type ${formatWorkTypeClass(h.workType)}`}>
                    {formatWorkTypeLabel(h.workType, t)}
                  </span>
                )}
              </h5>

              <p className="search-page-info">
                <FaMapMarkerAlt
                  style={{
                    marginRight: "6px",
                    color: "#FF4136",
                    fontSize: "16px",
                    verticalAlign: "middle",
                    minWidth: "16px"
                  }}
                />
                {h.address}
              </p>

              <p className="search-page-info">
                {Array.from({ length: 5 }, (_, index) => (
                  <span
                    key={index}
                    className={`star-icon ${index < h.rating ? "filled" : ""}`}
                  >
                    ★
                  </span>
                ))}
                {h.rating?.toFixed(1)}
              </p>

              {h.salary > 0 && (
                <p className="search-page-info">
                  <span className="salary-icon">💰</span>
                  {formatHourlyCurrency(h.salary, t)} {t("job.jobPost.salaryUnit")}
                </p>
              )}

              <div className="search-page-skill-tags">
                {h.skills?.map((skill, i) => (
                  <span key={i} className="search-page-skill-tag">
                    {formatSkillName(skill, t)}
                  </span>
                ))}
              </div>

              <div className="search-page-card-actions">
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    if (h.name) {
                      window.location.href = `/messages?search=${encodeURIComponent(h.name)}`;
                    }
                  }}
                  disabled={!h.name}
                >
                  {t("misc.send_message")}
                </button>
                <button
                  className="search-page-detail-btn"
                  onClick={() =>
                    navigate(`/family/housekeeper/profile/${h.accountID}`)
                  }
                >
                  {t("misc.view_profile")}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="search-page-no-result">
            {t("misc.no_jobs_found")}
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilyHousekeeperSearchPage;
