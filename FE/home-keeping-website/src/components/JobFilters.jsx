import React from "react";
import { useTranslation } from "react-i18next";

const JobFilters = ({ filter, onFilterChange, jobStatusMap }) => {
  const { t } = useTranslation();

  const handleChange = (key, value) => {
    onFilterChange({ ...filter, [key]: value });
  };

  const jobTypeMap = {
    all: t("filter.filter.all_job_types"),
    1: "Một lần duy nhất",
    2: "Định kỳ"
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <h6 className="fw-semibold mb-4">Bộ Lọc</h6>

      <div className="mb-3">
        <label htmlFor="statusFilter" className="form-label">
          {t("status.status")}
        </label>
        <select
          id="statusFilter"
          className="form-select"
          value={filter.status}
          onChange={(e) => handleChange("status", e.target.value)}
        >
          <option value="all">{t("filter.filter.all")}</option>
          {Object.entries(jobStatusMap).map(([value, label]) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label htmlFor="jobTypeFilter" className="form-label">
          Loại công việc
        </label>
        <select
          id="jobTypeFilter"
          className="form-select"
          value={filter.jobType}
          onChange={(e) => handleChange("jobType", e.target.value)}
        >
          {Object.entries(jobTypeMap).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="startDateFilter" className="form-label">
          {t("filter.filter.start_date")}
        </label>
        <input
          id="startDateFilter"
          type="date"
          className="form-control"
          value={filter.start_date}
          onChange={(e) => handleChange("start_date", e.target.value)}
        />
      </div>
    </div>
  );
};

export default JobFilters;
