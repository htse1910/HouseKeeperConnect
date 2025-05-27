import React, { useState, useEffect } from "react";
import {
  FaSearch,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaClock,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/FindJobsPage.css";
import API_BASE_URL from "../config/apiConfig";

function FindJobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);

  // const [filters, setFilters] = useState({ location: "", jobType: "", salary: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const jobsPerPage = 9;
  const authToken = localStorage.getItem("authToken");
  const [isSearching, setIsSearching] = useState(false);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const hcmDistricts = [
    "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
    "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh",
    "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú",
    "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè",
    "Thành phố Thủ Đức"
  ];

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const [countRes, jobsRes] = await Promise.all([
        fetch(`${API_BASE_URL}/Job/CountVerifiedJobs`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
        fetch(`${API_BASE_URL}/Job/JobList?pageNumber=${page}&pageSize=${jobsPerPage}`, {
          headers: { Authorization: `Bearer ${authToken}` },
        }),
      ]);

      const totalCount = await countRes.json();
      const jobData = await jobsRes.json();

      setTotalJobs(totalCount);
      setJobs(jobData);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, [page]);

  const maxPage = Math.ceil(totalJobs / jobsPerPage);

  const handleSearchTermChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    if (!term.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }
    const hintList = jobs
      .filter((job) => job.jobName?.toLowerCase().includes(term.toLowerCase()))
      .map((job) => job.jobName);
    const uniqueHints = [...new Set(hintList)].slice(0, 5);
    setSuggestions(uniqueHints);
    setShowSuggestions(true);
  };

  const getJobTypeLabel = (type) => (type === 1 ? "Ngắn hạn" : type === 2 ? "Định kỳ" : "Không xác định");
  const getJobStatusLabel = (status) => {
    switch (status) {
      case 1: return "Đang chờ duyệt";
      case 2: return "Đã duyệt";
      case 3: return "Đã nhận";
      case 4: return "Hoàn thành";
      case 5: return "Hết hạn";
      case 6: return "Đã hủy";
      default: return "Không xác định";
    }
  };

  const fetchAllJobsForSearch = async () => {
    setSearchLoading(true);
    try {
      const countRes = await fetch(`${API_BASE_URL}/Job/CountVerifiedJobs`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const totalCount = await countRes.json();

      const allJobsRes = await fetch(`${API_BASE_URL}/Job/JobList?pageNumber=1&pageSize=${totalCount}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      const allJobs = await allJobsRes.json();

      const matched = allJobs.filter((job) =>
        job.jobName?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredJobs(matched);
      setIsSearching(true);
    } catch (error) {
      console.error("Failed to fetch all jobs for search:", error);
      setFilteredJobs([]);
      setIsSearching(true);
    } finally {
      setSearchLoading(false);
    }
  };

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
              placeholder="Tìm kiếm công việc theo tên..."
              value={searchTerm}
              onChange={handleSearchTermChange}
              onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            />
            <button
              className="btn btn-warning px-4"
              onClick={fetchAllJobsForSearch}
            >
              {searchLoading ? "Đang tìm..." : "Tìm kiếm"}
            </button>
          </div>
          {isSearching && (
            <div className="text-end mt-2">
              <button
                className="btn btn-outline-secondary btn-sm"
                onClick={() => {
                  setIsSearching(false);
                  setSearchTerm("");
                  setFilteredJobs([]);
                  setPage(1); // reset to page 1 after clearing search
                }}
              >
                Xóa tìm kiếm
              </button>
            </div>
          )}
          {showSuggestions && suggestions.length > 0 && (
            <ul className="list-group position-absolute w-100 z-3 mt-1 rounded shadow-sm">
              {suggestions.map((suggestion, index) => (
                <li
                  key={index}
                  className="list-group-item list-group-item-action"
                  onMouseDown={() => {
                    setSearchTerm(suggestion);
                    setShowSuggestions(false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {suggestion}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="w-75 mt-3">
          {/* <div className="row g-2">
            <div className="col-md-4 col-lg-3">
              <select className="form-select" value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })}>
                <option value="">Tất cả địa điểm</option>
                {hcmDistricts.map((d, i) => <option key={i} value={d}>{d}</option>)}
              </select>
            </div>
            <div className="col-md-4 col-lg-3">
              <select className="form-select" value={filters.jobType} onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}>
                <option value="">Tất cả loại</option>
                <option value="fulltime">Một lần duy nhất</option>
                <option value="parttime">Định kỳ</option>
              </select>
            </div>
            <div className="col-md-4 col-lg-3">
              <select className="form-select" value={filters.salary} onChange={(e) => setFilters({ ...filters, salary: e.target.value })}>
                <option value="">Tất cả mức lương</option>
                <option value="500-1000">500k - 1M</option>
                <option value="1000-1500">1M - 1.5M</option>
                <option value="1500-2500">1.5M - 2.5M</option>
                <option value="2500+">Trên 2.5M</option>
              </select>
            </div>
            <div className="col-md-12 col-lg-3">
              <button className="btn btn-outline-primary w-100" onClick={() => setPage(1)}>Áp dụng bộ lọc</button>
            </div>
          </div> */}
        </div>
      </div>

      <div className="container py-4">
        {loading || searchLoading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-3">Đang tải công việc...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-muted py-5">Không tìm thấy công việc phù hợp.</div>
        ) : (
          <>
            <p className="text-muted text-center mb-4">
              Tổng số công việc hiện giờ: <strong>{totalJobs}</strong>
            </p>
            <div className="row justify-content-center g-4">
              {(isSearching ? filteredJobs : jobs).map((job) => (
                <div key={job.jobID} className="col-md-6 col-lg-4 d-flex">
                  <div className="card job-card shadow-sm p-3 border-0 flex-fill rounded-4 position-relative">
                    <span className="position-absolute top-0 end-0 bg-warning text-dark fw-bold px-3 py-1 rounded-bottom-start">
                      #{job.jobID}
                    </span>
                    <div className="card-body d-flex flex-column">
                      <h5 className="fw-bold text-primary mb-2">{job.jobName}</h5>
                      <p className="mb-1"><FaMapMarkerAlt className="me-1 text-muted" /> <strong>Địa điểm:</strong> {job.location ?? "Chưa cập nhật"}</p>
                      {job.detailLocation && (
                        <p className="mb-1 text-muted ms-4"><em>{job.detailLocation}</em></p>
                      )}
                      <p className="mb-1"><FaMoneyBillWave className="me-1 text-muted" /> <strong>Lương:</strong> {job.price?.toLocaleString()} VND</p>
                      <p className="mb-1"><FaClock className="me-1 text-muted" /> <strong>Trạng thái:</strong> {getJobStatusLabel(job.status)}</p>
                      <p className="mb-3"><strong>Loại:</strong> {getJobTypeLabel(job.jobType)}</p>
                      <Link to={`/job/${job.jobID}`} className="btn btn-outline-warning mt-auto fw-bold">
                        Xem chi tiết
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {!isSearching && (
              <div className="d-flex justify-content-between align-items-center mt-4">
                <button
                  className="btn btn-outline-secondary rounded-pill px-4"
                  disabled={page <= 1}
                  onClick={() => setPage((prev) => prev - 1)}
                >
                  <FaChevronLeft className="me-2" />
                  Trang trước
                </button>
                <span className="text-muted">Trang {page} / {maxPage}</span>
                <button
                  className="btn btn-outline-primary rounded-pill px-4"
                  disabled={page >= maxPage}
                  onClick={() => setPage((prev) => prev + 1)}
                >
                  Trang sau
                  <FaChevronRight className="ms-2" />
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default FindJobsPage;
