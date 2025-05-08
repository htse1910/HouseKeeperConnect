import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";

const JobCard = ({ job, jobStatusMap, onEdit, onDelete, onView, onCancel }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const daysAgo = Math.floor((Date.now() - new Date(job.createdDate)) / 86400000);

  const jobTypeMap = {
    1: "Một lần duy nhất",
    2: "Định kỳ"
  };

  return (
    <div className="border rounded shadow-sm p-3">
      <div className="d-flex justify-content-between align-items-start">
        <div>
          <h5 className="fw-bold mb-2">{job.jobName}</h5>
          <div className="text-muted small d-flex flex-wrap gap-3">
            <span>
              <FaCalendarCheck className="me-1" />
              {t("job.job.posted_days_ago", { days: daysAgo })}
            </span>
            <span>
              <FaMapMarkerAlt className="me-1" />
              {job.location}
            </span>
            <span>
              <FaMoneyBillWave className="me-1" />
              {job.salary?.toLocaleString("vi-VN") || t("job.job.not_sure")} VNĐ
            </span>
            <span>
              🧾 {jobTypeMap[job.jobType]}
            </span>
          </div>
        </div>
        <span className={`badge ${job.status === 8 ? "bg-info text-dark" : "bg-secondary"}`}>
          {jobStatusMap[job.status]}
        </span>
      </div>

      <div className="mt-3 d-flex gap-2">
        <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(job)}>
          {t("job.job.delete")}
        </button>
        <button className="btn btn-primary btn-sm" onClick={() => onView(job)}>
          {job.status === 2 ? t("job.job.view_applicants") : t("job.job.view_detail")}
        </button>
      </div>

      {job.status === 9 && (
        <button
          className="btn btn-outline-warning btn-sm ms-auto mt-2"
          onClick={() => navigate(`/family/abandoned-jobs?jobID=${job.jobID}`)}
        >
          🧹 Người giúp việc mới
        </button>
      )}
    </div>
  );
};

export default JobCard;
