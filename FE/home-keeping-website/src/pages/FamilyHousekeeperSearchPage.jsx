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

const FamilyHousekeeperSearchPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [selectedGender, setSelectedGender] = useState("");
  const [selectedSalaryOrder, setSelectedSalaryOrder] = useState("");
  const [selectedWorkType, setSelectedWorkType] = useState("");
  const [housekeepers, setHousekeepers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const cardsPerPage = 6;
  const authToken = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json",
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

  const getSkillsByAccountID = async (accountID) => {
    try {
      const res = await axios.get(`${API_BASE_URL}/HousekeeperSkillMapping/GetSkillsByAccountID`, {
        headers,
        params: { accountId: accountID },
      });

      const skills = await Promise.all(
        res.data.map(async (mapping) => {
          try {
            const skillRes = await axios.get(`${API_BASE_URL}/HouseKeeperSkills/GetHousekeeperSkillById`, {
              headers,
              params: { id: mapping.houseKeeperSkillID },
            });
            return skillRes.data?.name;
          } catch {
            return null;
          }
        })
      );

      return skills.filter(Boolean);
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!authToken || !accountID) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const hkRes = await axios.get(`${API_BASE_URL}/HouseKeeper/HousekeeperDisplay`, {
          headers,
          params: { pageNumber: 1, pageSize: 100 },
        });

        const enriched = await Promise.all(
          hkRes.data.map(async (hk) => {
            try {
              const acc = await axios.get(`${API_BASE_URL}/Account/GetAccount`, {
                headers,
                params: { id: hk.accountID },
              });

              if (acc.data?.roleID !== 1) return null;

              const [rating, skills] = await Promise.all([
                getAverageRating(hk.housekeeperID),
                getSkillsByAccountID(hk.accountID),
              ]);

              return {
                ...hk,
                name: acc.data.name,
                avatar:
                  hk.localProfilePicture?.trim() !== ""
                    ? hk.localProfilePicture
                    : hk.googleProfilePicture,
                rating,
                skills,
              };
            } catch {
              return null;
            }
          })
        );

        setHousekeepers(enriched.filter(Boolean));
      } catch {
        // silent fail
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const normalize = (s) => (s ?? "").toLowerCase().trim();

  const filtered = housekeepers
    .filter((h) => {
      const matchesName = normalize(h.name).includes(normalize(searchTerm));
      const matchesLocation = !location || normalize(h.address).includes(normalize(location));
      const matchesGender = !selectedGender || String(h.gender) === selectedGender;
      const matchesWorkType = !selectedWorkType || String(h.workType) === selectedWorkType;
      return matchesName && matchesLocation && matchesGender && matchesWorkType;
    })
    .sort((a, b) => {
      if (selectedSalaryOrder === "asc") return a.salary - b.salary;
      if (selectedSalaryOrder === "desc") return b.salary - a.salary;
      return 0;
    });

  const maxPage = Math.ceil(filtered.length / cardsPerPage);
  const paginated = filtered.slice((currentPage - 1) * cardsPerPage, currentPage * cardsPerPage);

  const getWorkTypeLabel = (type) =>
    type === 1 ? "Một lần duy nhất" : type === 2 ? "Định kỳ" : "Không rõ";

  const getWorkTypeClass = (type) =>
    type === 1 ? "bg-info text-white" : type === 2 ? "bg-success text-white" : "bg-secondary text-white";

  return (
    <div className="container-fluid p-0">
      <div className="d-flex flex-column align-items-center justify-content-center bg-light py-5">
        <div className="position-relative w-75">
          <div className="input-group shadow-sm rounded mb-2">
            <span className="input-group-text bg-white border-end-0 px-3">
              <FaSearch className="text-muted" />
            </span>
            <input
              type="text"
              className="form-control border-start-0 py-3"
              placeholder="Tìm kiếm người giúp việc..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="w-75 mt-3">
          <div className="row g-2">
            
            <div className="col-md-3">
              <select className="form-select" value={selectedGender} onChange={(e) => { setSelectedGender(e.target.value); setCurrentPage(1); }}>
                <option value="">Tất cả giới tính</option>
                <option value="1">Nam</option>
                <option value="2">Nữ</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={selectedSalaryOrder} onChange={(e) => { setSelectedSalaryOrder(e.target.value); setCurrentPage(1); }}>
                <option value="">Mức lương</option>
                <option value="asc">Tăng dần</option>
                <option value="desc">Giảm dần</option>
              </select>
            </div>
            <div className="col-md-3">
              <select className="form-select" value={selectedWorkType} onChange={(e) => { setSelectedWorkType(e.target.value); setCurrentPage(1); }}>
                <option value="">Tất cả loại</option>
                <option value="1">Một lần duy nhất</option>
                <option value="2">Định kỳ</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-3">Đang tải người giúp việc...</p>
          </div>
        ) : paginated.length === 0 ? (
          <div className="text-center text-muted py-5">Không tìm thấy người giúp việc phù hợp.</div>
        ) : (
          <>
            <p className="text-muted text-center mb-4">
              Tổng số người giúp việc hiện giờ: <strong>{filtered.length}</strong>
            </p>
            <div className="row justify-content-center g-4">
              {paginated.map((h) => (
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
