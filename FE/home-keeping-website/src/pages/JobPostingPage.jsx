import React, { useState } from "react";
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock, FaUserCircle, FaStar } from "react-icons/fa";
import { Pagination } from "react-bootstrap";
import { Link } from "react-router-dom";

function JobPostingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({ location: "", skills: "", gender: "", salary: "" });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  const housekeepers = [
    {
      id: 1,
      name: "Nguyễn Trường",
      location: "Hà Nội",
      rating: 4.5,
      salary: "150,000 VND/giờ",
      posted: "2 ngày trước",
      type: "Full-time",
      typeColor: "#ffcc99",
      skills: ["Dọn dẹp", "Giặt ủi"],
    },
    {
      id: 2,
      name: "Lý Mai",
      location: "Hà Nội",
      rating: 4.0,
      salary: "150,000 VND/giờ",
      posted: "4 ngày trước",
      type: "Part-time",
      typeColor: "#99bbff",
      skills: ["Dọn dẹp", "Giặt ủi"],
    },
    {
      id: 3,
      name: "Nguyễn Hưng",
      location: "Hà Nội",
      rating: 4.2,
      salary: "150,000 VND/giờ",
      posted: "1 ngày trước",
      type: "Contract",
      typeColor: "#99ffcc",
      skills: ["Dọn dẹp", "Giặt ủi"],
    },
  ];

  const totalPages = Math.ceil(housekeepers.length / jobsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container-fluid p-0">
      {/* Search Bar Section */}
      <div className="d-flex flex-column align-items-center justify-content-center py-4" style={{ backgroundColor: "#ffedd5" }}>
        <div className="input-group w-75 shadow-sm mb-3">
          <span className="input-group-text bg-white border-end-0 px-3">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 py-3"
            placeholder="Nhập từ khóa hoặc tên người giúp việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters & Search Button in the Same Row (Equal Width as Search Bar) */}
        <div className="w-75">
          <div className="d-flex gap-2">
            <select className="form-select flex-grow-1" name="location" value={filters.location} onChange={handleFilterChange}>
              <option value="">Địa điểm</option>
              <option value="Hanoi">Hà Nội</option>
              <option value="HCM">Hồ Chí Minh</option>
            </select>
            <select className="form-select flex-grow-1" name="skills" value={filters.skills} onChange={handleFilterChange}>
              <option value="">Kỹ năng</option>
              <option value="cleaning">Dọn dẹp</option>
              <option value="laundry">Giặt ủi</option>
            </select>
            <select className="form-select flex-grow-1" name="gender" value={filters.gender} onChange={handleFilterChange}>
              <option value="">Giới tính</option>
              <option value="male">Nam</option>
              <option value="female">Nữ</option>
            </select>
            <select className="form-select flex-grow-1" name="salary" value={filters.salary} onChange={handleFilterChange}>
              <option value="">Mức lương</option>
              <option value="below5m">Dưới 5 triệu</option>
              <option value="5m-10m">5-10 triệu</option>
            </select>
            <button className="btn btn-warning flex-grow-1">Tìm kiếm</button>
          </div>
        </div>
      </div>

      {/* Housekeeper Listings Section */}
      <div className="container py-4">
        <div className="row justify-content-center">
          {housekeepers.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((worker) => (
            <div key={worker.id} className="col-md-4 d-flex">
              <div className="card shadow-sm p-3 mb-4 border-0 w-100 d-flex flex-column h-100">
                <div className="card-body d-flex flex-column align-items-center text-center">

                  {/* Account Icon */}
                  <FaUserCircle size={60} className="text-muted mb-2" />

                  {/* Job Info */}
                  <h5 className="fw-bold">{worker.name}</h5>
                  <p className="text-muted d-flex align-items-center justify-content-center">
                    <FaMapMarkerAlt className="text-muted me-1" /> {worker.location}
                  </p>

                  {/* Star Rating */}
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    {[...Array(5)].map((_, i) => (
                      <FaStar key={i} className={i < worker.rating ? "text-warning" : "text-muted"} />
                    ))}
                    <span className="ms-2 text-muted">({worker.rating.toFixed(1)})</span>
                  </div>

                  {/* Salary */}
                  <p className="mb-2 d-flex align-items-center justify-content-center">
                    <FaMoneyBillWave className="text-muted me-1" /> {worker.salary}
                  </p>

                  {/* Skills Badges */}
                  <div className="d-flex justify-content-center gap-2 mb-3">
                    {worker.skills.map((skill, index) => (
                      <span key={index} className="badge px-3 py-2" style={{ backgroundColor: "#ffedd5", borderRadius: "20px" }}>
                        {skill}
                      </span>
                    ))}
                  </div>

                  {/* Job Type Badge */}
                  <span className="badge text-dark fw-bold px-3 py-2 mb-3" style={{ backgroundColor: worker.typeColor, borderRadius: "20px" }}>
                    {worker.type}
                  </span>

                  {/* Spacer to Push Buttons to Bottom */}
                  <div className="flex-grow-1"></div>

                  {/* Buttons */}
                  <div className="d-flex justify-content-between w-100 mt-2">
                    <button className="btn btn-warning w-50 fw-bold py-2">Mời làm việc</button>
                    <Link to={`/housekeeper/${worker.id}`} className="btn btn-outline-warning w-50 fw-bold py-2">Xem chi tiết</Link>
                  </div>

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
      </div>
    </div>
  );
}

export default JobPostingPage;
