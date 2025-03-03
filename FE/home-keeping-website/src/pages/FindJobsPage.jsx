import React, { useState } from 'react';
import { FaSearch, FaMapMarkerAlt, FaMoneyBillWave, FaClock } from 'react-icons/fa';
import { Pagination } from 'react-bootstrap';
import { Link } from 'react-router-dom';

function FindJobsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ location: '', jobType: '', salary: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 3;

  const jobs = [
    {
      id: 1,
      title: 'Dọn dẹp nhà cửa',
      employer: 'Gia đình Nguyễn Văn A',
      location: 'Quận 1, TP.HCM',
      salary: '150,000 VND/giờ',
      posted: '3 ngày trước',
      type: 'Full-time',
      typeColor: '#ffcc99',
    },
    {
      id: 2,
      title: 'Giúp việc theo giờ',
      employer: 'Gia đình Trần Thị B',
      location: 'Quận 7, TP.HCM',
      salary: '200,000 VND/giờ',
      posted: '1 ngày trước',
      type: 'Part-time',
      typeColor: '#99bbff',
    },
    {
      id: 3,
      title: 'Dọn dẹp văn phòng',
      employer: 'Công ty XYZ',
      location: 'Quận 3, TP.HCM',
      salary: '180,000 VND/giờ',
      posted: '5 ngày trước',
      type: 'Contract',
      typeColor: '#99ffcc',
    },
  ];

  const totalPages = Math.ceil(jobs.length / jobsPerPage);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container-fluid p-0">
      {/* Top Section with Search Bar */}
      <div className="d-flex flex-column align-items-center justify-content-center" style={{ backgroundColor: '#ffedd5', minHeight: '220px' }}>
        {/* Search Bar */}
        <div className="input-group w-75 shadow-sm mb-3">
          <span className="input-group-text bg-white border-end-0 px-3">
            <FaSearch className="text-muted" />
          </span>
          <input
            type="text"
            className="form-control border-start-0 py-3"
            placeholder="Nhập từ khóa hoặc tên công việc..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Filters Section */}
        <div className="w-75">
          <div className="row g-2">
            <div className="col-3">
              <select className="form-select w-100" name="location" value={filters.location} onChange={handleFilterChange}>
                <option value="">Địa điểm</option>
                <option value="Hanoi">Hà Nội</option>
                <option value="HCM">Hồ Chí Minh</option>
              </select>
            </div>
            <div className="col-3">
              <select className="form-select w-100" name="jobType" value={filters.jobType} onChange={handleFilterChange}>
                <option value="">Loại công việc</option>
                <option value="fulltime">Full-time</option>
                <option value="parttime">Part-time</option>
              </select>
            </div>
            <div className="col-3">
              <select className="form-select w-100" name="salary" value={filters.salary} onChange={handleFilterChange}>
                <option value="">Mức lương</option>
                <option value="below5m">Dưới 5 triệu</option>
                <option value="5m-10m">5-10 triệu</option>
              </select>
            </div>
            <div className="col-3">
              <button className="btn text-white w-100" style={{ backgroundColor: '#ff9900' }}>Tìm kiếm</button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section - Job Listings */}
      <div className="container py-4">
        <div className="row justify-content-center">
          {jobs.slice((currentPage - 1) * jobsPerPage, currentPage * jobsPerPage).map((job) => (
            <div key={job.id} className="col-md-4">
              <div className="card shadow-sm p-3 mb-4 border-0">
                <div className="card-body">
                  <h5 className="fw-bold">{job.title}</h5>
                  <p className="text-muted">{job.employer}</p>
                  <p className="mb-1"><FaMapMarkerAlt className="text-muted" /> {job.location}</p>
                  <p className="mb-1"><FaMoneyBillWave className="text-muted" /> {job.salary}</p>
                  <p className="mb-1"><FaClock className="text-muted" /> {job.posted}</p>
                  <span className="badge text-white" style={{ backgroundColor: job.typeColor }}>
                    {job.type}
                  </span>
                  <Link to={`/job/${job.id}`} className="btn btn-outline-warning w-100 mt-3">Xem chi tiết</Link>
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

export default FindJobsPage;
