import React, { useState, useEffect } from "react";
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaUser } from "react-icons/fa";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../assets/styles/FindJobsPage.css";

function FindJobsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ location: "", jobType: "", salary: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const [allJobs, setAllJobs] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const jobsPerPage = 9;

  const authToken = localStorage.getItem("authToken");

  const hcmDistricts = [
    "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
    "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh",
    "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú",
    "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè",
    "Thành phố Thủ Đức"
  ];

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
        const listRes = await fetch("http://localhost:5280/api/Job/JobList", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authToken}`,
          },
        });

        const jobList = await listRes.json();
        const verifiedJobs = jobList.filter((job) => job.status === 2);

        const detailedJobs = await Promise.all(
          verifiedJobs.map(async (job) => {
            const detailRes = await fetch(`http://localhost:5280/api/Job/GetJobDetailByID?id=${job.jobID}`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${authToken}`,
              },
            });
            return await detailRes.json();
          })
        );

        setAllJobs(detailedJobs);
        setJobs(detailedJobs);
      } catch (err) {
        console.error("Error fetching job details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleSearch = () => {
    if (!searchTerm.trim()) {
      setJobs(allJobs);
      return;
    }

    fetch(`http://localhost:5280/api/Job/SearchJob?name=${encodeURIComponent(searchTerm)}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setJobs(data);
        setCurrentPage(1);
      })
      .catch((err) => console.error("Search error:", err));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyFilter = () => {
    let filtered = [...allJobs];

    if (filters.location) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.jobType) {
      const type = filters.jobType === "fulltime" ? 1 : 2;
      filtered = filtered.filter((job) => job.jobType === type);
    }

    if (filters.salary) {
      filtered = filtered.filter((job) => {
        const salary = job.price || 0;
        switch (filters.salary) {
          case "500-1000": return salary >= 500000 && salary <= 1000000;
          case "1000-1500": return salary > 1000000 && salary <= 1500000;
          case "1500-2500": return salary > 1500000 && salary <= 2500000;
          case "2500+": return salary > 2500000;
          default: return true;
        }
      });
    }

    setJobs(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const getJobTypeLabel = (type) => (type === 1 ? "Full-time" : type === 2 ? "Part-time" : "Không xác định");
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

  return (
    <div className="container-fluid p-0">
      {/* Search & Filters */}
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: "#ffedd5", minHeight: "240px" }}>
        <div className="input-group w-75 shadow-sm mb-3">
          <span className="input-group-text bg-white border-end-0 px-3">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 py-3"
            placeholder="Nhập từ khóa công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button className="btn btn-warning px-4" onClick={handleSearch}>Tìm kiếm</button>
        </div>

        <div className="w-75">
          <div className="row g-2">
            <div className="col-3">
              <select className="form-select" name="location" value={filters.location} onChange={handleFilterChange}>
                <option value="">Tất cả địa điểm</option>
                {hcmDistricts.map((district, idx) => (
                  <option key={idx} value={district}>{district}</option>
                ))}
              </select>
            </div>
            <div className="col-3">
              <select className="form-select" name="jobType" value={filters.jobType} onChange={handleFilterChange}>
                <option value="">Tất cả loại</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
              </select>
            </div>
            <div className="col-3">
              <select className="form-select" name="salary" value={filters.salary} onChange={handleFilterChange}>
                <option value="">Tất cả mức lương</option>
                <option value="500-1000">500k - 1M</option>
                <option value="1000-1500">1M - 1.5M</option>
                <option value="1500-2500">1.5M - 2.5M</option>
                <option value="2500+">Trên 2.5M</option>
              </select>
            </div>
            <div className="col-3">
              <button className="btn btn-outline-primary w-100" onClick={handleApplyFilter}>
                Áp dụng bộ lọc
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Job Listings */}
      <div className="container py-4">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status" />
            <p className="mt-3">Đang tải công việc...</p>
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center text-muted py-5">
            Không tìm thấy công việc phù hợp.
          </div>
        ) : (
          <>
            <div className="row justify-content-center">
              {jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job) => (
                <div key={job.jobID} className="col-md-4 fade-in">
                  <div className="card shadow-sm p-3 mb-4 border-0 job-card">
                    <div className="card-body">
                      <h5 className="fw-bold">{job.jobName}</h5>
                      <p><FaUser className="me-1 text-muted" /> Gia đình ID: {job.familyID}</p>
                      <p><FaMapMarkerAlt className="me-1 text-muted" /> Địa điểm: {job.location ?? "Chưa cập nhật"}</p>
                      <p><FaMoneyBillWave className="me-1 text-muted" /> Mức lương: {job.price?.toLocaleString()} VND</p>
                      <p><FaClock className="me-1 text-muted" /> Trạng thái: {getJobStatusLabel(job.status)}</p>
                      <p>Loại: {getJobTypeLabel(job.jobType)}</p>
                      <Link to={`/job/${job.jobID}`} className="btn btn-outline-warning w-100 mt-3">Xem chi tiết</Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="d-flex justify-content-center">
              <Pagination>
                <Pagination.Prev onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, i) => (
                  <Pagination.Item key={i + 1} active={i + 1 === currentPage} onClick={() => setCurrentPage(i + 1)}>
                    {i + 1}
                  </Pagination.Item>
                ))}
                <Pagination.Next onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default FindJobsPage;
