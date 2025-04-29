import React from "react";
import { useTranslation } from "react-i18next";

const JobFilters = ({ filter, onFilterChange, jobStatusMap, serviceTypes }) => {
  const { t } = useTranslation();

  const handleChange = (key, value) => {
    onFilterChange({ ...filter, [key]: value });
  };

  return (
    <div className="bg-white rounded-4 shadow-sm p-4">
      <h6 className="fw-semibold mb-4">{t("filterTitle") || t("filter.filter")}</h6>

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
        <label htmlFor="serviceTypeFilter" className="form-label">
          {t("job.job.type")}
        </label>
        <select
          id="serviceTypeFilter"
          className="form-select"
          value={filter.serviceType}
          onChange={(e) => handleChange("serviceType", e.target.value)}
        >
          <option value="all">{t("filter.filter.all_job_types")}</option>
          {serviceTypes.map((type) => (
            <option key={type} value={type}>
              {t(`serviceTypeName.${type}`, type)}
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
