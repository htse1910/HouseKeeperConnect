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

  const [filter, setFilter] = useState({
    status: "all",
    jobType: "all",
    start_date: ""
  });
  const [jobToDelete, setJobToDelete] = useState(null);
  const showBackToTop = useBackToTop();

  const jobStatusMap = useMemo(() => ({
    1: t("job.job_pending"),               // Pending
    2: t("job.job_verified"),              // Verified
    3: t("job.job_accepted"),              // Accepted
    4: t("job.job_completed"),             // Completed
    5: t("job.job_expired"),               // Expired
    6: t("job.job_canceled"),              // Canceled
    7: "Không được phép",                  // NotPermitted
    8: "Chờ gia đình xác nhận",            // PendingFamilyConfirmation
    9: "Người giúp việc bỏ",               // HousekeeperQuitJob
    10: "Đã được giao lại công việc"        // ReAssignedJob
  }), [t]);

  const serviceTypes = useMemo(
    () => Array.from(new Set(jobs.flatMap(job => job.serviceTypes || []))),
    [jobs]
  );

  const filteredJobs = jobs.filter((job) => {
    const matchStatus = filter.status === "all" || job.status?.toString() === filter.status;
    const matchJobType = filter.jobType === "all" || job.jobType?.toString() === filter.jobType;
    const matchStartDate = !filter.start_date || new Date(job.startDate).toISOString().split("T")[0] === filter.start_date;
    return matchStatus && matchJobType && matchStartDate;
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