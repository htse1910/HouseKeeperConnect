import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFamilyJobs from "../hooks/useFamilyJobs";
import "bootstrap/dist/css/bootstrap.min.css";
import { useBackToTop, renderBackToTopButton } from "../utils/uiHelpers";
import API_BASE_URL from "../config/apiConfig";
import { toast } from "react-toastify";
import JobStatistics from "../components/JobStatistics";
import JobFilters from "../components/JobFilters";
import JobList from "../components/JobList";
import DeleteJobModal from "../components/DeleteJobModal";

const FamilyJobManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  const {
    jobs,
    housekeepers,
    loading,
    error,
    isNoProfile,
    isNoJob,
    setJobs,
  } = useFamilyJobs({ accountID, authToken, t });

  const [filter, setFilter] = useState({ status: "all", serviceType: "all", start_date: "" });
  const [jobToDelete, setJobToDelete] = useState(null);
  const showBackToTop = useBackToTop();

  const jobStatusMap = useMemo(() => ({
    1: t("job.job_pending"),
    2: t("job.job_verified"),
    3: t("job.job_accepted"),
    4: t("job.job_completed"),
    5: t("job.job_expired"),
    6: t("job.job_canceled"),
    8: t("job.job_pending_family_confirmation"),
    9: "Người giúp việc bỏ"
  }), [t]);

  const serviceTypes = useMemo(
    () => Array.from(new Set(jobs.flatMap(job => job.serviceTypes || []))),
    [jobs]
  );

  const filteredJobs = jobs.filter(job => {
    const { status, serviceType, start_date } = filter;
    if (status !== "all" && job.status !== parseInt(status)) return false;
    if (serviceType !== "all" && (!Array.isArray(job.serviceTypes) || !job.serviceTypes.includes(serviceType))) return false;
    if (start_date && new Date(job.createdDate).setHours(0, 0, 0, 0) < new Date(start_date).setHours(0, 0, 0, 0)) return false;
    return true;
  });

  const confirmDelete = async () => {
    if (!jobToDelete) return;

    const content = `Please delete the job ${jobToDelete.jobName}, ID: ${jobToDelete.jobID}`;
    const formData = new FormData();
    formData.append("Picture", "");

    const query = new URLSearchParams({
      RequestedBy: accountID,
      Type: 2,
      Content: content
    });

    try {
      await axios.post(`${API_BASE_URL}/SupportRequest/AddSupportRequest?${query}`, formData, {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      });
      toast.success("✅ Đã gửi yêu cầu xoá công việc.");
      setJobToDelete(null);
      navigate("/family/support-requests"); // <-- add this
    } catch (err) {
      console.error("Lỗi gửi yêu cầu xoá:", err);
      toast.error("❌ Không thể gửi yêu cầu xoá.");
    }
  };

  const handleCancelJob = async (jobID) => {
    try {
      await axios.post(`${API_BASE_URL}/Job/CancelJob`, null, {
        headers: { Authorization: `Bearer ${authToken}` },
        params: { jobId: jobID, accountId: accountID },
      });
      toast.success("✅ Đã huỷ công việc.");
      setJobs(prev => prev.map(j => j.jobID === jobID ? { ...j, status: 6 } : j));
    } catch (err) {
      console.error("Lỗi khi huỷ công việc:", err);
      toast.error("❌ Không thể huỷ công việc.");
    }
  };

  return (
    <div className="container my-4">
      <JobStatistics
        jobsCount={jobs.length}
        completedCount={jobs.filter(j => j.status === 4).length}
        housekeepers={housekeepers}
      />

      <div className="row">
        <div className="col-md-4 mb-4">
          <JobFilters
            filter={filter}
            onFilterChange={setFilter}
            jobStatusMap={jobStatusMap}
            serviceTypes={serviceTypes}
          />
        </div>

        <div className="col-md-8">
          {loading || error ? (
            <div className="alert alert-info">{t("misc.loading_data")}</div>
          ) : filteredJobs.length === 0 ? (
            <div className="alert alert-warning">
              {isNoProfile ? t("job.no_family_profile") : isNoJob ? t("job.no_jobs_yet") : t("misc.no_jobs_found")}
            </div>
          ) : (
            <div style={{ maxHeight: "700px", overflowY: "auto" }}>
              <JobList
                jobs={filteredJobs}
                jobStatusMap={jobStatusMap}
                onEdit={(id) => navigate(`/family/job/update/${id}`)}
                onDelete={setJobToDelete}
                onView={(job) => navigate(`/family/job/detail/${job.jobID}`, { state: { createdDate: job.createdDate } })}
                onCancel={handleCancelJob}
              />
            </div>
          )}
        </div>
      </div>

      <DeleteJobModal
        job={jobToDelete}
        onConfirm={confirmDelete}
        onCancel={() => setJobToDelete(null)}
      />

      {showBackToTop && renderBackToTopButton(t)}
    </div>
  );
};

export default FamilyJobManagementPage;