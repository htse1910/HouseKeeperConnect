import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";
import axios from "axios";
import useFamilyJobs from "../hooks/useFamilyJobs";
import "bootstrap/dist/css/bootstrap.min.css";
import { useBackToTop, renderBackToTopButton } from "../utils/uiHelpers";
import { getPagination } from "../utils/uiHelpers";
import Pagination from "../components/Pagination";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const FamilyJobManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const {
    jobs,
    services,
    housekeepers,
    loading,
    error,
    isNoProfile,
    isNoJob,
    setJobs
  } = useFamilyJobs({ accountID, authToken, t });

  const shouldShowLoadingOrError = loading || error;

  const [filter, setFilter] = useState({ status: "all", serviceType: "all", start_date: "" });
  const showBackToTop = useBackToTop();
  const [jobToDelete, setJobToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [inputPage, setInputPage] = useState("");
  const pageSize = 6;

  const jobStatusMap = useMemo(() => ({
    1: t("job.job_pending"),
    2: t("job.job_verified"),
    3: t("job.job_accepted"),
    4: t("job.job_completed"),
    5: t("job.job_expired"),
    6: t("job.job_canceled"),
    8: t("job.job_pending_family_confirmation")
  }), [t]);

  const serviceTypes = useMemo(() => Array.from(new Set(jobs.flatMap(job => job.serviceTypes || []))), [jobs]);

  const filteredJobs = jobs.filter(job => {
    const { status, serviceType, start_date } = filter;
    if (status !== "all" && job.status !== parseInt(status)) return false;
    if (serviceType !== "all" && (!Array.isArray(job.serviceTypes) || !job.serviceTypes.includes(serviceType))) return false;
    if (start_date && new Date(job.createdDate).setHours(0, 0, 0, 0) < new Date(start_date).setHours(0, 0, 0, 0)) return false;
    return true;
  });

  const { paginatedData, pageRange, totalPages } = getPagination(filteredJobs, currentPage, pageSize);

  useEffect(() => { setCurrentPage(1); }, [filter]);

  const confirmDelete = async () => {
    if (!jobToDelete) return;
    try {
      await axios.delete(`${API_BASE_URL}/Job/DeleteJob`, {
        headers: { Authorization: `Bearer ${authToken}`, "Content-Type": "application/json" },
        params: { id: jobToDelete.jobID }
      });
      setJobs(prev => prev.filter(j => j.jobID !== jobToDelete.jobID));
      setJobToDelete(null);
    } catch (err) {
      console.error("Lỗi xoá công việc:", err);
      alert(t("job.delete_failed"));
    }
  };

  const status4Jobs = jobs.filter((job) => job.status === 4).length;

  return (
    <div className="container my-4">
      <div className="mb-4 row text-center">
        <div className="col-md-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h6 className="text-muted">{t("job.job.posted")}</h6>
            <h4 className="fw-bold">{jobs.length}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h6 className="text-muted">{t("job.job.completed")}</h6>
            <h4 className="fw-bold">{status4Jobs}</h4>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 bg-light rounded shadow-sm">
            <h6 className="text-muted">{t("misc.housekeepers_waiting")}</h6>
            <h4 className="fw-bold">{housekeepers}</h4>
            <button className="btn btn-sm btn-primary mt-2" onClick={() => navigate("/family/post-job")}>{t("misc.post_now")}</button>
          </div>
        </div>
      </div>

      <div className="row">
        {/* Filter Section */}
        <div className="col-md-4 mb-4">
          <div className="p-3 border rounded shadow-sm">
            <label className="form-label">{t("status.status")}</label>
            <select className="form-select mb-3" value={filter.status} onChange={e => setFilter({ ...filter, status: e.target.value })}>
              <option value="all">{t("filter.filter.all")}</option>
              {Object.entries(jobStatusMap).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>

            <label className="form-label">{t("job.job.type")}</label>
            <select className="form-select mb-3" value={filter.serviceType} onChange={e => setFilter({ ...filter, serviceType: e.target.value })}>
              <option value="all">{t("filter.filter.all_job_types")}</option>
              {serviceTypes.map(type => (
                <option key={type} value={type}>{t(`serviceTypeName.${type}`, type)}</option>
              ))}
            </select>

            <label className="form-label">{t("filter.filter.start_date")}</label>
            <input
              type="date"
              className="form-control"
              value={filter.start_date}
              onChange={(e) => setFilter({ ...filter, start_date: e.target.value })}
            />
          </div>
        </div>

        {/* Job List */}
        <div className="col-md-8">
          {shouldShowLoadingOrError ? (
            <div className="alert alert-info">{t("misc.loading_data")}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="alert alert-warning">
              {isNoProfile ? t("job.no_family_profile") : isNoJob ? t("job.no_jobs_yet") : t("misc.no_jobs_found")}
            </div>
          ) : (
            <div className="d-flex flex-column gap-3">
              {paginatedData.map(job => (
                <div key={job.jobID} className="border rounded shadow-sm p-3">
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <h5 className="fw-bold mb-2">{job.jobName}</h5>
                      <div className="text-muted small d-flex flex-wrap gap-3">
                        <span><FaCalendarCheck className="me-1" /> {t("job.job.posted_days_ago", { days: Math.floor((Date.now() - new Date(job.createdDate)) / 86400000) })}</span>
                        <span><FaMapMarkerAlt className="me-1" /> {job.location}</span>
                        <span><FaMoneyBillWave className="me-1" /> {job.salary?.toLocaleString("vi-VN") || t("job.job.not_sure")} VNĐ/giờ</span>
                      </div>
                    </div>
                    <span className={`badge ${job.status === 8 ? "bg-info text-dark" : "bg-secondary"}`}>{jobStatusMap[job.status]}</span>
                  </div>
                  <div className="mt-3 d-flex gap-2">
                    <button className="btn btn-outline-secondary btn-sm" onClick={() => navigate(`/family/job/update/${job.jobID}`)}>{t("job.job.edit")}</button>
                    <button className="btn btn-outline-danger btn-sm" onClick={() => setJobToDelete(job)}>{t("job.job.delete")}</button>
                    <button className="btn btn-primary btn-sm" onClick={() => navigate(`/family/job/detail/${job.jobID}`, { state: { createdDate: job.createdDate } })}>
                      {job.status === 2 ? t("job.job.view_applicants") : t("job.job.view_detail")}
                    </button>
                  </div>
                </div>
              ))}

              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                pageRange={pageRange}
                inputPage={inputPage}
                onPageChange={(page) => setCurrentPage(page)}
                onPageInput={(e) => setInputPage(e.target.value)}
                onPageSubmit={(e) => {
                  e.preventDefault();
                  const page = parseInt(inputPage);
                  if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    setCurrentPage(page);
                    setInputPage("");
                  }
                }}
              />
            </div>
          )}
        </div>
      </div>

      {jobToDelete && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("popup.popup.confirm_delete_title")}</h5>
                <button type="button" className="btn-close" onClick={() => setJobToDelete(null)}></button>
              </div>
              <div className="modal-body">
                <p>{t("popup.popup.confirm_delete_text", { title: jobToDelete.jobName })}</p>
              </div>
              <div className="modal-footer">
                <button className="btn btn-danger" onClick={confirmDelete}>{t("confirm")}</button>
                <button className="btn btn-secondary" onClick={() => setJobToDelete(null)}>{t("cancel")}</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showBackToTop && renderBackToTopButton(t)}
    </div>
  );
};

export default FamilyJobManagementPage;