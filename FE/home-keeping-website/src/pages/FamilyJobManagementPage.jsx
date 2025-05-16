import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useFamilyJobs from "../hooks/useFamilyJobs";
import "bootstrap/dist/css/bootstrap.min.css";
import { useBackToTop, renderBackToTopButton } from "../utils/uiHelpers";
import API_BASE_URL from "../config/apiConfig";
import { toast } from "react-toastify";
import { FaMapMarkerAlt, FaMoneyBillWave, FaCalendarCheck } from "react-icons/fa";

const FamilyJobManagementPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [jobDates, setJobDates] = useState({});

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");
  const [jobToReassign, setJobToReassign] = useState(null);
  const [totalPostedJobs, setTotalPostedJobs] = useState(null);
  const [paginatedJobs, setPaginatedJobs] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 6;
  const [currentPage, setCurrentPage] = useState(1);

  const {
    jobs,
    housekeepers,
    loading,
    error,
    isNoProfile,
    isNoJob,
    setJobs,
  } = useFamilyJobs({ accountID, authToken, t });

  useEffect(() => {
    if (!authToken || !accountID) return;

    const headers = {
      Authorization: `Bearer ${authToken}`
    };

    axios.get(`${API_BASE_URL}/Job/CountJobsByAccountID?accountID=${accountID}`, { headers })
      .then(res => {
        setTotalPostedJobs(res.data || 0);
      })
      .catch(err => {
        console.error("Failed to fetch job count:", err);
        setTotalPostedJobs(0);
      });
  }, [accountID, authToken]);

  useEffect(() => {
    if (!authToken || !accountID) return;

    const headers = { Authorization: `Bearer ${authToken}` };

    const fetchJobs = async () => {
      try {
        const [countRes, jobRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/Job/CountJobsByAccountID?accountID=${accountID}`, { headers }),
          axios.get(`${API_BASE_URL}/Job/GetJobsByAccountID?accountId=${accountID}&pageNumber=${currentPage}&pageSize=${pageSize}`, { headers })
        ]);

        const totalJobs = countRes.data;
        setTotalPages(Math.ceil(totalJobs / pageSize));
        setPaginatedJobs(jobRes.data || []);
      } catch (err) {
        console.error("Lỗi khi fetch jobs:", err);
        setPaginatedJobs([]);
      }
    };

    fetchJobs();
  }, [accountID, authToken, currentPage]);

  useEffect(() => {
    const headers = { Authorization: `Bearer ${authToken}` };

    const missingJobs = paginatedJobs.filter(job => !jobDates[job.jobID]);

    if (missingJobs.length === 0) return;

    const fetchMissingDates = async () => {
      try {
        const results = await Promise.all(
          missingJobs.map(job =>
            axios.get(`${API_BASE_URL}/Job/GetJobDetailByID?id=${job.jobID}`, { headers })
              .then(res => ({ jobID: job.jobID, startDate: res.data.startDate, endDate: res.data.endDate }))
              .catch(() => null)
          )
        );

        const updated = {};
        results.forEach(item => {
          if (item) {
            updated[item.jobID] = {
              startDate: item.startDate,
              endDate: item.endDate
            };
          }
        });

        setJobDates(prev => ({ ...prev, ...updated }));
      } catch (err) {
        console.error("Failed to fetch job dates:", err);
      }
    };

    fetchMissingDates();
  }, [paginatedJobs, authToken]);

  const [jobToDelete, setJobToDelete] = useState(null);
  const showBackToTop = useBackToTop();


  const jobsPerPage = 5;
  const [gotoPage, setGotoPage] = useState("");

  const jobStatusMap = useMemo(() => ({
    1: t("job.job_pending"),
    2: t("job.job_verified"),
    3: t("job.job_accepted"),
    4: t("job.job_completed"),
    5: t("job.job_expired"),
    6: t("job.job_canceled"),
    7: "Không được phép",
    8: "Chờ gia đình xác nhận",
    9: "Người giúp việc bỏ",
    10: "Công việc được tạo lại"
  }), [t]);

  const serviceTypes = useMemo(
    () => Array.from(new Set(jobs.flatMap(job => job.serviceTypes || []))),
    [jobs]
  );

  // const filteredJobs = jobs.filter((job) => {
  //   const matchStatus = filter.status === "all" || job.status?.toString() === filter.status;
  //   const matchJobType = filter.jobType === "all" || job.jobType?.toString() === filter.jobType;
  //   const matchStartDate = !filter.start_date || new Date(job.startDate).toISOString().split("T")[0] === filter.start_date;
  //   return matchStatus && matchJobType && matchStartDate;
  // });


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
      navigate("/family/support-requests");
    } catch (err) {
      console.error("Lỗi gửi yêu cầu xoá:", err);
      toast.error("❌ Không thể gửi yêu cầu xoá.");
    }
  };

  // const handleCancelJob = async (jobID) => {
  //   try {
  //     await axios.post(`${API_BASE_URL}/Job/CancelJob`, null, {
  //       headers: { Authorization: `Bearer ${authToken}` },
  //       params: { jobId: jobID, accountId: accountID },
  //     });
  //     toast.success("✅ Đã huỷ công việc.");
  //     setJobs(prev => prev.map(j => j.jobID === jobID ? { ...j, status: 6 } : j));
  //   } catch (err) {
  //     console.error("Lỗi khi huỷ công việc:", err);
  //     toast.error("❌ Không thể huỷ công việc.");
  //   }
  // };

  const renderDeleteModal = () => {
    if (!jobToDelete) return null;
    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Gửi yêu cầu xoá công việc</h5>
              <button type="button" className="btn-close" onClick={() => setJobToDelete(null)}></button>
            </div>
            <div className="modal-body">
              <p>Bạn có chắc muốn gửi yêu cầu <strong>xóa công việc</strong> này không?</p>
              <p><strong>Loại yêu cầu:</strong> Công việc (2)</p>
              <p><strong>Nội dung:</strong><br />
                Hãy xóa công việc <strong>{jobToDelete.jobName}</strong>, ID: <strong>{jobToDelete.jobID}</strong>
              </p>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" onClick={confirmDelete}>Gửi yêu cầu</button>
              <button className="btn btn-secondary" onClick={() => setJobToDelete(null)}>Huỷ</button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const parseDMY = (dmy) => {
    if (!dmy) return null;
    const [day, month, year] = dmy.split("/").map(Number);
    const date = new Date(year, month - 1, day);
    return isNaN(date) ? null : date;
  };


  const renderReassignModal = () => {
    if (!jobToReassign) return null;

    return (
      <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Người giúp việc mới</h5>
              <button type="button" className="btn-close" onClick={() => setJobToReassign(null)}></button>
            </div>
            <div className="modal-body">
              <p>Bạn muốn tìm người giúp việc mới theo cách nào?</p>
            </div>
            <div className="modal-footer d-flex flex-column align-items-stretch gap-2">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => navigate("/family/find-housekeepers")}
              >
                🔍 Tự tìm người giúp việc
              </button>
              <button
                className="btn btn-warning w-100 text-white"
                onClick={() => {
                  navigate(`/family/abandoned-jobs?jobID=${jobToReassign.jobID}`);
                  setJobToReassign(null);
                }}
              >
                ⚙️ Để hệ thống tìm giúp
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderJobCard = (job) => {
    console.log("🛠 Job data:", job);
    const rawDate = job.createdDate || job.createdAt;
    const created = rawDate ? new Date(rawDate) : null;
    const daysAgo = created instanceof Date && !isNaN(created)
      ? Math.floor((Date.now() - created) / 86400000)
      : null;
    console.log("🔍 job.createdDate:", job.createdDate);
    console.log("🕓 daysAgo:", daysAgo);


    const jobTypeMap = { 1: "Một lần duy nhất", 2: "Định kỳ" };
    const statusClassMap = {
      1: "bg-warning text-dark", 2: "bg-info text-dark", 3: "bg-primary",
      4: "bg-success", 5: "bg-secondary", 6: "bg-danger", 7: "bg-dark",
      8: "bg-warning text-dark", 9: "bg-danger", 10: "bg-info"
    };

    return (
      <div key={job.jobID} className="border rounded shadow-sm p-3 mb-3 position-relative">
        <div className="d-flex justify-content-between align-items-start">
          <div>
            <h5 className="fw-bold mb-2">{job.jobName}</h5>
            <div className="text-muted small d-flex flex-wrap gap-3">
              <span>
                <FaCalendarCheck className="me-1" />
                {daysAgo !== null
                  ? t("job.job.posted_days_ago", { days: daysAgo })
                  : "Không rõ"}
              </span>
              <span><FaMapMarkerAlt className="me-1" />{job.location}</span>
              <span><FaMoneyBillWave className="me-1" />{job.price?.toLocaleString("vi-VN") || t("job.job.not_sure")} VNĐ</span>
              <span>🧾 {jobTypeMap[job.jobType]}</span>
              <span>
                📅{" "}
                {jobDates[job.jobID]?.startDate
                  ? new Date(jobDates[job.jobID].startDate).toLocaleDateString("vi-VN")
                  : "?"}
                {" - "}
                {jobDates[job.jobID]?.endDate
                  ? new Date(jobDates[job.jobID].endDate).toLocaleDateString("vi-VN")
                  : "?"}
              </span>
            </div>
          </div>
          {jobStatusMap[job.status] && (
            <span className={`badge ${statusClassMap[job.status] || "bg-secondary"}`}>
              {jobStatusMap[job.status]}
            </span>
          )}
        </div>
        <div className="mt-3 d-flex gap-2">
          {!([4, 6, 8, 9].includes(job.status)) && (
            <button className="btn btn-outline-danger btn-sm" onClick={() => setJobToDelete(job)}>
              {t("Hủy")}
            </button>
          )}

          <button className="btn btn-warning btn-sm text-white" onClick={() =>
            navigate(`/family/job/detail/${job.jobID}`, { state: { createdDate: job.createdDate } })
          }>
            {job.status === 2 ? t("job.job.view_applicants") : t("job.job.view_detail")}
          </button>
        </div>

        {job.status === 10 && (
          <button
            className="btn btn-outline-warning btn-sm ms-auto mt-2"
            onClick={() => setJobToReassign(job)}
          >
            🧹 Người giúp việc mới
          </button>
        )}
        <div className="position-absolute bottom-0 end-0 text-muted small p-2">#{job.jobID}</div>
      </div>
    );
  };

  return (
    <div className="container my-4">
      <div className="row g-4 mb-5">
        {[{
          label: t("job.job.posted"),
          value: totalPostedJobs ?? "-"
        }, {
          label: t("job.job.completed"),
          value: jobs.filter(j => j.status === 4).length
        }, {
          label: t("misc.housekeepers_waiting"),
          value: housekeepers,
          button: (
            <button className="btn btn-warning mt-3 px-4 fw-semibold" onClick={() => navigate("/family/post-job")}>
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

      <div className="row">

        <div className="col-12">
          {loading || error ? (
            <div className="alert alert-info">{t("misc.loading_data")}</div>
          ) : paginatedJobs.length === 0 ? (
            <div className="alert alert-warning">
              {isNoProfile ? t("job.no_family_profile") : isNoJob ? t("job.no_jobs_yet") : t("misc.no_jobs_found")}
            </div>
          ) : (
            <div>
              {paginatedJobs.map(renderJobCard)}

              <div className="d-flex justify-content-center align-items-center gap-2 mt-4 flex-wrap">
                <button
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                  onClick={() => setCurrentPage(p => Math.max(p - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <span className="me-1">⬅️</span> Trước
                </button>

                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => {
                    const pageNum = parseInt(e.target.value);
                    if (!isNaN(pageNum) && pageNum >= 1 && pageNum <= totalPages) {
                      setCurrentPage(pageNum);
                    }
                  }}
                  className="form-control form-control-sm text-center"
                  style={{ width: "60px" }}
                />

                <span className="small">/ {totalPages}</span>

                <button
                  className="btn btn-sm btn-outline-secondary d-flex align-items-center"
                  onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Sau <span className="ms-1">➡️</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {renderDeleteModal()}
      {renderReassignModal()}
      {showBackToTop && renderBackToTopButton(t)}
    </div>
  );
};

export default FamilyJobManagementPage;