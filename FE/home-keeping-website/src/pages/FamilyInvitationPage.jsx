import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../assets/styles/Job.css";
import { toast, ToastContainer } from "react-toastify";
import { renderWorkingTime, formatGender } from "../utils/formatData";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";
import API_BASE_URL from "../config/apiConfig";

const FamilyInvitationPage = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const housekeeper = location.state?.housekeepers?.[0] || null;

  const [jobID, setJobID] = useState("");
  const [jobDetail, setJobDetail] = useState(null);
  const [services, setServices] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const authToken = localStorage.getItem("authToken");
  const accountID = localStorage.getItem("accountID");

  const headers = {
    Authorization: `Bearer ${authToken}`,
    "Content-Type": "application/json"
  };

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/Job/GetJobsByAccountID?accountID=${accountID}&pageNumber=1&pageSize=10`, { headers })
      .then((res) => {
        const list = res.data?.filter((j) => !j.isOffered && (j.status === 2 || j.status === 9)) || [];
        setJobs(list);
      })
      .catch(() => setError(t("error.error_loading")))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!jobID) {
      setJobDetail(null);
      setServices([]);
      return;
    }

    axios
      .get(`${API_BASE_URL}/Job/GetJobDetailByID?id=${jobID}`, { headers })
      .then((res) => {
        const job = res.data;
        setJobDetail(job);

        const fetchServices = job.serviceIDs.map((id) =>
          axios
            .get(`${API_BASE_URL}/Service/GetServiceByID?id=${id}`, { headers })
            .then((res) => res.data)
            .catch(() => null)
        );

        Promise.all(fetchServices).then((results) => {
          setServices(results.filter(Boolean));
        });
      });
  }, [jobID]);

  const getJobStatusText = (status) => {
    const statusMap = {
      1: "pending",
      2: "verified",
      3: "accepted",
      4: "completed",
      5: "expired",
      6: "canceled",
      7: "not_permitted",
      8: "pending_family_confirmation",
      9: "housekeeper_quit"
    };
  
    const key = statusMap[status];
    return key ? t(`job.jobStatus.${key}`) : t("job.job.not_sure");
  };  

  const sendInvitation = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);
  
    const toastId = toast.loading(t("job.jobPost.posting"));
  
    try {
      await axios.put(`${API_BASE_URL}/Job/OfferJob`, null, {
        headers,
        params: {
          jobId: jobID,
          housekeeperId: housekeeper.housekeeperID
        }
      });
  
      toast.update(toastId, {
        render: t("job.jobPost.offer_success"),
        type: "success",
        isLoading: false,
        autoClose: 2000,
        onClose: () => navigate("/family/find-housekeepers")
      });
    } catch (error) {
      toast.update(toastId, {
        render: t("error.unexpected_error"),
        type: "error",
        isLoading: false,
        autoClose: 3000
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleInvite = () => {
    if (!jobID || !housekeeper) {
      toast.warn(t("misc.confirm"));
      return;
    }
    setShowConfirmDialog(true);
  };

  const feedback = shouldShowLoadingOrError(loading, error, t);
  if (feedback) return feedback;

  return (
    <div className="job-posting-container">
      <h2 className="job-posting-title">{t("misc.invite_to_work")}</h2>

      {housekeeper && (
        <div className="job-detail-candidate">
          <img
            src={
              housekeeper.localProfilePicture ||
              housekeeper.googleProfilePicture ||
              housekeeper.avatar ||
              "/avatar0.png"
            }
            alt="avatar"
            className="job-invite-avatar"
            onError={(e) => (e.target.src = "/avatar0.png")}
          />
          <div>
            <h2>{housekeeper.name}</h2>
            {housekeeper.skills?.length > 0 && (
              <div className="job-detail-tags">
                {housekeeper.skills.map((skill, i) => (
                  <span key={i} className="tag">{skill}</span>
                ))}
              </div>
            )}
            <p><strong>{t("user.gender")}:</strong> {formatGender(housekeeper.gender, t)}</p>
            <p><strong>{t("user.address")}:</strong> {housekeeper.address}</p>
            <p><strong>Email:</strong> {housekeeper.email}</p>
            <p><strong>{t("user.phone")}:</strong> {housekeeper.phone}</p>
          </div>
        </div>
      )}

      <div className="mb-3">
        <button className="btn-primary"
          onClick={() => navigate("/family/post-job")}
        >
          {t("misc.create_new_job")}
        </button>
      </div>

      {jobs.length === 0 ? (
        <>
          <p>{t("misc.no_jobs_found")}</p>
        </>
      ) : (
        <>
          <label><strong>{t("misc.choose_job")}:</strong></label>
          <select className="job-posting-input" value={jobID} onChange={(e) => setJobID(e.target.value)}>
            <option value="">-- {t("misc.choose_job")} --</option>
            {jobs.map((j) => (
              <option key={j.jobID} value={j.jobID}>
                {j.jobName} - {j.location}
              </option>
            ))}
          </select>

          {jobDetail && (
            <div className="job-detail-card">
              <h3 className="job-detail-section-title">{t("misc.job_detail")}</h3>
              <p><strong>{t("job.job_title")}:</strong> {jobDetail.jobName}</p>
              <p><strong>{t("status.status")}:</strong> {getJobStatusText(jobDetail.status)}</p>
              <p><strong>{t("misc.location")}:</strong> {jobDetail.location}</p>
              <p><strong>{t("misc.salary")}:</strong> {jobDetail.price?.toLocaleString()} {t("job.jobPost.salaryUnit")}</p>
              <p><strong>{t("job.jobDetail.workingSchedule")}:</strong> {renderWorkingTime(jobDetail.dayofWeek, jobDetail.slotIDs, t)}</p>

              <ul className="job-detail-service-list">
                {Object.entries(
                  services.reduce((acc, s) => {
                    const type = s?.serviceType?.serviceTypeName || "Khác";
                    if (!acc[type]) acc[type] = [];
                    acc[type].push(s);
                    return acc;
                  }, {})
                ).map(([type, list]) => (
                  <li key={type}>
                    <strong>{type}:</strong>
                    <ul>
                      {list.map((s) => (
                        <li key={s.serviceID} className="job-detail-checked-service-item">
                          {s.serviceName}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>

              {jobDetail.specialRequirement && (
                <p><strong>{t("misc.special_requirements")}:</strong> {jobDetail.specialRequirement}</p>
              )}
            </div>
          )}

          <label style={{ marginTop: "20px", fontWeight: "bold" }}>{t("misc.note")}:</label>
          <textarea
            className="job-posting-textarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("misc.note_placeholder")}
            rows={3}
          />

          <button className="btn-primary job-posting-submit-btn" onClick={handleInvite}>
            {t("misc.send_invite")}
          </button>
        </>
      )}

      {showConfirmDialog && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h3>{t("invite.confirm")}</h3>
            <p>{t("invite.invite_confirm_text", {
              name: housekeeper.name,
              job: jobDetail?.jobName || `#${jobID}`
            })}</p>
            <div className="modal-actions">
              <button
                className="btn-secondary"
                onClick={() => setShowConfirmDialog(false)}
                disabled={isSubmitting}
              >
                {t("invite.cancel")}
              </button>
              <button
                className="btn-primary"
                onClick={sendInvitation}
                disabled={isSubmitting}
              >
                {t("invite.confirm")}
              </button>
            </div>
          </div>
        </div>
      )}

      <>

        <ToastContainer
          position="top-right"
          autoClose={2000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="colored"
        />
      </>

    </div>
  );
};

export default FamilyInvitationPage;
