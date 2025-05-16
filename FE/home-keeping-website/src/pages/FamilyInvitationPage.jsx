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
      .get(`${API_BASE_URL}/Job/GetJobsByAccountID?accountID=${accountID}&pageNumber=1&pageSize=1000`, { headers })
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
    <div className="container py-4">
      <h2 className="text-center mb-4">{t("misc.invite_to_work")}</h2>

      {housekeeper && (
        <div className="card shadow-sm border-0 p-4 mb-4 position-relative">
          <span className="position-absolute top-0 end-0 bg-warning text-dark fw-bold px-3 py-1 rounded-bottom-start">
            #{housekeeper.housekeeperID}
          </span>
          <div className="row align-items-center">
            <div className="col-md-3 text-center mb-3 mb-md-0">
              <div className="position-relative d-inline-block">
                <img
                  src={
                    housekeeper.localProfilePicture ||
                    housekeeper.googleProfilePicture ||
                    housekeeper.avatar ||
                    "/avatar0.png"
                  }
                  alt="avatar"
                  className="rounded-circle border"
                  style={{ width: "100px", height: "100px", objectFit: "cover" }}
                  onError={(e) => (e.target.src = "/avatar0.png")}
                />
              </div>
              <div className="fw-semibold mt-2">{housekeeper.name}</div>
            </div>
            <div className="col-md-9">
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="text-muted small">{t("user.gender")}</div>
                  <div className="fw-bold">{formatGender(housekeeper.gender, t)}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">{t("user.address")}</div>
                  <div className="fw-bold">{housekeeper.address}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">Email</div>
                  <div className="fw-bold">{housekeeper.email}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">{t("user.phone")}</div>
                  <div className="fw-bold">{housekeeper.phone}</div>
                </div>
                {housekeeper.skills?.length > 0 && (
                  <div className="col-12">
                    <div className="text-muted small">{t("user.skills")}</div>
                    <div className="d-flex flex-wrap gap-2">
                      {housekeeper.skills.map((skill, i) => (
                        <span key={i} className="badge bg-secondary">{skill}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="mb-4">
        <button className="btn btn-warning" onClick={() => navigate("/family/create-direct-job", {
          state: {
            housekeeper: {
              housekeeperID: housekeeper.housekeeperID,
              name: housekeeper.name,
            }
          }
        })}>
          {t("misc.create_new_job")}
        </button>
      </div>

      {jobs.length === 0 ? (
        <p>{t("misc.no_jobs_found")}</p>
      ) : (
        <>
          <div className="mb-3">
            <label className="form-label fw-bold">{t("misc.choose_job")}:</label>
            <select
              className="form-select"
              value={jobID}
              onChange={(e) => setJobID(e.target.value)}
            >
              <option value="">-- {t("misc.choose_job")} --</option>
              {jobs.map((j) => (
                <option key={j.jobID} value={j.jobID}>
                  {j.jobName} - {j.location}
                </option>
              ))}
            </select>
          </div>

          {jobDetail && (
            <div className="card shadow-sm border-0 p-4 mb-4">
              <h5 className="fw-bold mb-3">{t("misc.job_detail")}</h5>
              <div className="row g-3">
                <div className="col-sm-6">
                  <div className="text-muted small">{t("job.job_title")}</div>
                  <div className="fw-bold">{jobDetail.jobName}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">{t("status.status")}</div>
                  <div className="fw-bold">{getJobStatusText(jobDetail.status)}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">{t("misc.location")}</div>
                  <div className="fw-bold">{jobDetail.location}</div>
                </div>
                <div className="col-sm-6">
                  <div className="text-muted small">{t("misc.salary")}</div>
                  {/* <div className="fw-bold">{jobDetail.price?.toLocaleString()} {t("job.jobPost.salaryUnit")}</div> */}
                  <div className="fw-bold">{jobDetail.price?.toLocaleString()} VND</div>
                </div>
                <div className="col-12">
                  <div className="text-muted small">{t("job.jobDetail.workingSchedule")}</div>
                  <div className="fw-bold">
                    {renderWorkingTime(jobDetail.dayofWeek, jobDetail.slotIDs, t)}
                  </div>
                </div>
                {services.length > 0 && (
                  <div className="col-12">
                    <div className="text-muted small">Dịch vụ</div>
                    <ul className="list-unstyled mb-0">
                      {Object.entries(
                        services.reduce((acc, s) => {
                          const type = s?.serviceType?.serviceTypeName || "Khác";
                          if (!acc[type]) acc[type] = [];
                          acc[type].push(s);
                          return acc;
                        }, {})
                      ).map(([type, list]) => (
                        <li key={type}>
                          <strong>{type}:</strong>{" "}
                          {list.map((s) => s.serviceName).join(", ")}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {jobDetail.specialRequirement && (
                  <div className="col-12">
                    <div className="text-muted small">{t("misc.special_requirements")}</div>
                    <div className="fw-bold">{jobDetail.specialRequirement}</div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="mb-3">
            <label className="form-label fw-bold">{t("misc.note")}:</label>
            <textarea
              className="form-control"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder={t("misc.note_placeholder")}
              rows={3}
            />
          </div>

          <button className="btn btn-primary" onClick={handleInvite}>
            {t("misc.send_invite")}
          </button>
        </>
      )}

      {showConfirmDialog && (
        <div className="modal d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">{t("invite.confirm")}</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowConfirmDialog(false)}
                ></button>
              </div>
              <div className="modal-body">
                <p>
                  {t("invite.invite_confirm_text", {
                    name: housekeeper.name,
                    job: jobDetail?.jobName || `#${jobID}`,
                  })}
                </p>
              </div>
              <div className="modal-footer">
                <button
                  className="btn btn-secondary"
                  onClick={() => setShowConfirmDialog(false)}
                  disabled={isSubmitting}
                >
                  {t("invite.cancel")}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={sendInvitation}
                  disabled={isSubmitting}
                >
                  {t("invite.confirm")}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
    </div>
  );
};

export default FamilyInvitationPage;
