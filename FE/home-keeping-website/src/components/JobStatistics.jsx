import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const JobStatistics = ({ jobsCount, completedCount, housekeepers }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="row g-4 mb-5">
      {[{
        label: t("job.job.posted"),
        value: jobsCount
      }, {
        label: t("job.job.completed"),
        value: completedCount
      }, {
        label: t("misc.housekeepers_waiting"),
        value: housekeepers,
        button: (
          <button
            className="btn btn-warning mt-3 px-4 fw-semibold"
            onClick={() => navigate("/family/post-job")}
          >
            {t("misc.post_now")}
          </button>
        )
      }].map((stat, idx) => (
        <div key={idx} className="col-md-4">
          <div className="bg-white rounded-4 shadow-sm px-4 py-5 text-center h-100 d-flex flex-column justify-content-center align-items-center">
            <div className="text-muted fs-6 mb-2">{stat.label}</div>
            <div className="display-6 fw-bold text-dark">{stat.value}</div>
            {stat.button}
          </div>
        </div>
      ))}
    </div>
  );
};

export default JobStatistics;
