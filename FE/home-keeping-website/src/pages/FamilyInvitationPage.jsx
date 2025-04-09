import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import "../assets/styles/Job.css";
import { renderWorkingTime, formatGender } from "../utils/formatData";
import { shouldShowLoadingOrError } from "../utils/uiHelpers";

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

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json"
    };

    useEffect(() => {
        axios
            .get(`http://localhost:5280/api/Job/GetJobsByAccountID?accountID=${accountID}&pageNumber=1&pageSize=10`, { headers })
            .then((res) => {
                const list = res.data?.filter((j) => !j.isOffered && j.status === 1) || [];
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
            .get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, { headers })
            .then((res) => {
                const job = res.data;
                setJobDetail(job);

                const fetchServices = job.serviceIDs.map((id) =>
                    axios
                        .get(`http://localhost:5280/api/Service/GetServiceByID?id=${id}`, { headers })
                        .then((res) => res.data)
                        .catch(() => null)
                );

                Promise.all(fetchServices).then((results) => {
                    setServices(results.filter(Boolean));
                });
            });
    }, [jobID]);

    const handleInvite = async () => {
        if (!jobID || !housekeeper) {
            alert(t("misc.confirm"));
            return;
        }

        const confirmed = window.confirm(`${t("misc.confirm")} " mời " ${housekeeper.name} "?"`);
        if (!confirmed) return;

        try {
            await axios.put("http://localhost:5280/api/Job/OfferJob", null, {
                headers,
                params: {
                    jobId: jobID,
                    housekeeperId: housekeeper.housekeeperID
                }
            });

            alert("🎉 " + t("job.jobPost.offer_success"));
            navigate("/family/find-housekeepers");
        } catch (err) {
            console.error(err);
            alert(t("error.unexpected_error"));
        }
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
                        <label><strong>{housekeeper.name}</strong> ({housekeeper.gender})</label>
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

            {jobs.length === 0 ? (
                <>
                    <p>{t("misc.no_jobs_found")}</p>
                    <button className="btn-primary" onClick={() => navigate("/family/post-job")}>
                        {t("misc.create_new_job")}
                    </button>
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
                        <div className="job-detail-card" style={{ marginTop: "24px" }}>
                            <h3 className="job-detail-section-title">{t("misc.job_detail")}</h3>
                            <p><strong>{t("job.job_title")}:</strong> {jobDetail.jobName}</p>
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
        </div>
    );
};

export default FamilyInvitationPage;
