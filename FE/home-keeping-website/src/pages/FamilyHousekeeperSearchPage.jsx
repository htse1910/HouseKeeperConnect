import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaStar,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import API_BASE_URL from "../config/apiConfig";
import { getSkillMap } from "../utils/skillUtils";

const FamilyHousekeeperSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalHousekeepers, setTotalHousekeepers] = useState(0);

  const cardsPerPage = 6;
  const authToken = localStorage.getItem("authToken");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
  };

  const handleFullSearch = async () => {
    if (!searchTerm.trim()) return;

    setLoading(true);
    try {
      const skillMap = await getSkillMap();
      const res = await axios.get(`${API_BASE_URL}/Account/TotalAccount`, { headers });
      const total = res.data.totalHousekeepers;
      const totalPages = Math.ceil(total / cardsPerPage);

      const allResults = [];

      for (let page = 1; page <= totalPages; page++) {
        const hkRes = await axios.get(`${API_BASE_URL}/HouseKeeper/HousekeeperDisplay`, {
          headers,
          params: { pageNumber: page, pageSize: cardsPerPage },
        });

        const enriched = await Promise.all(
          hkRes.data.map(async (hk) => {
            const rating = await getAverageRating(hk.housekeeperID);
            const skills = (hk.skillIDs || []).map((id) => skillMap[id]).filter(Boolean);
            return {
              ...hk,
              avatar:
                hk.localProfilePicture?.trim() !== ""
                  ? hk.localProfilePicture
                  : hk.googleProfilePicture,
              rating,
              skills,
            };
          })
        );

        allResults.push(...enriched);
      }

      const normalize = (s) => (s ?? "").toLowerCase().trim();
      const results = allResults.filter((h) =>
        normalize(h.name).includes(normalize(searchTerm))
      );

      setHousekeepers(results);
      setTotalHousekeepers(results.length);
      setCurrentPage(1);
    } catch (err) {
      console.error("Search failed", err);
      setHousekeepers([]);
    } finally {
      setLoading(false);
    }
  };

  const getAverageRating = async (housekeeperID) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Rating/GetRatingListByHK`, {
        headers,
        params: { id: housekeeperID, pageNumber: 1, pageSize: 1000 },
      });
      const ratings = res.data || [];
      if (ratings.length === 0) return 0;
      const total = ratings.reduce((sum, r) => sum + (r.score || 0), 0);
      return total / ratings.length;
    } catch {
      return 0;
    }
  };

  const fetchTotalHousekeepers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/Account/TotalAccount`, { headers });
      setTotalHousekeepers(res.data.totalHousekeepers);
    } catch {
      setTotalHousekeepers(0);
    }
  };

  const fetchPageData = async (page) => {
    setLoading(true);
    try {
      const skillMap = await getSkillMap();
      const hkRes = await axios.get(`${API_BASE_URL}/HouseKeeper/HousekeeperDisplay`, {
        headers,
        params: { pageNumber: page, pageSize: cardsPerPage },
      });

      const enriched = await Promise.all(
        hkRes.data.map(async (hk) => {
          const rating = await getAverageRating(hk.housekeeperID);
          const skills = (hk.skillIDs || []).map((id) => skillMap[id]).filter(Boolean);

          return {
            ...hk,
            avatar:
              hk.localProfilePicture?.trim() !== ""
                ? hk.localProfilePicture
                : hk.googleProfilePicture,
            rating,
            skills,
          };
        })
      );

      setHousekeepers(enriched);
    } catch {
      setHousekeepers([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authToken) return;
    fetchTotalHousekeepers();
  }, []);

  useEffect(() => {
    if (!authToken) return;
    fetchPageData(currentPage);
  }, [currentPage]);

  const normalize = (s) => (s ?? "").toLowerCase().trim();

  const filtered = housekeepers.filter((h) =>
    normalize(h.name).includes(normalize(searchTerm))
  );

  const maxPage = Math.ceil(totalHousekeepers / cardsPerPage);

  const getWorkTypeLabel = (type) =>
    type === 1 ? "Một lần duy nhất" : type === 2 ? "Định kỳ" : "Không rõ";

  const getWorkTypeClass = (type) =>
    type === 1 ? "bg-info text-white" : type === 2 ? "bg-success text-white" : "bg-secondary text-white";

  return (
    <div className="container-fluid p-0">
      {/* Search Input */}
      <div className="d-flex flex-column align-items-center justify-content-center bg-light py-5">
        <div className="position-relative w-75">
          <div className="input-group shadow-sm rounded mb-2">
            <span className="input-group-text bg-white border-end-0 px-3">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 border-end-0 py-3"
              placeholder="Tìm kiếm người giúp việc..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="btn btn-outline-primary px-4" onClick={handleFullSearch}>
              Tìm kiếm
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="container py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-3">Đang tải người giúp việc...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center text-muted py-5">Không tìm thấy người giúp việc phù hợp.</div>
        ) : (
          <>
            <p className="text-muted text-center mb-4">
              Tổng số người giúp việc hiện giờ: <strong>{totalHousekeepers}</strong>
            </p>
            <div className="row justify-content-center g-4">
              {filtered.map((h) => (
                <div key={h.accountID} className="col-md-6 col-lg-4 d-flex">
                  <div className="card shadow-sm p-3 border-0 flex-fill rounded-4 position-relative">
                    <span className="position-absolute top-0 end-0 bg-warning text-dark fw-bold px-3 py-1 rounded-bottom-start">
                      #{h.housekeeperID}
                    </span>
                    <div className="card-body d-flex flex-column align-items-center text-center">
                      {h.avatar ? (
                        <img src={h.avatar} alt={h.name} className="rounded-circle mb-3" style={{ width: 80, height: 80, objectFit: "cover" }} />
                      ) : (
                        <div className="rounded-circle bg-secondary text-white d-flex justify-content-center align-items-center mb-3" style={{ width: 80, height: 80, fontSize: "32px" }}>
                          {h.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <span className={`badge ${getWorkTypeClass(h.workType)} mb-2`}>
                        {getWorkTypeLabel(h.workType)}
                      </span>
                      <h5 className="fw-bold text-primary mb-2">{h.name}</h5>
                      <p className="mb-1"><FaMapMarkerAlt className="me-2 text-muted" /> {h.address ?? "Không rõ địa chỉ"}</p>
                      <div className="mb-2">
                        {Array.from({ length: 5 }, (_, i) => (
                          <FaStar key={i} className={i < Math.round(h.rating) ? "text-warning" : "text-muted"} />
                        ))}
                        <span className="ms-2 text-muted">{h.rating?.toFixed(1)}</span>
                      </div>
                      {Array.isArray(h.skills) && h.skills.length > 0 && (
                        <div className="mb-2">
                          {h.skills.map((skill, i) => (
                            <span key={i} className="badge bg-light text-dark me-1">{skill}</span>
                          ))}
                        </div>
                      )}
                      <div className="d-flex gap-2 mt-3">
                        <button className="btn btn-outline-secondary" onClick={() => window.location.assign(`/messages?search=${h.name}`)}>
                          {t("misc.send_message")}
                        </button>
                        <button className="btn btn-outline-warning fw-bold" onClick={() => navigate(`/family/housekeeper/profile/${h.accountID}`)}>
                          {t("misc.view_profile")}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <button className="btn btn-outline-secondary rounded-pill px-4" disabled={currentPage <= 1} onClick={() => setCurrentPage((prev) => prev - 1)}>
                <FaChevronLeft className="me-2" /> Trang trước
              </button>
              <span className="text-muted">Trang {currentPage} / {maxPage}</span>
              <button className="btn btn-outline-primary rounded-pill px-4" disabled={currentPage >= maxPage} onClick={() => setCurrentPage((prev) => prev + 1)}>
                Trang sau <FaChevronRight className="ms-2" />
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FamilyHousekeeperSearchPage;
