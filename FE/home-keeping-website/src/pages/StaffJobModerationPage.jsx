import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import axios from "axios";
import "../assets/styles/Dashboard.css";

const generateFakeJobs = () => {
    const titles = ["Dọn dẹp nhà", "Nấu ăn", "Trông trẻ", "Giặt đồ", "Chăm sóc người lớn tuổi"];
    const areas = ["Quận 1", "Quận 3", "Bình Thạnh", "Tân Bình", "Thủ Đức"];
    return Array.from({ length: 50 }, (_, i) => ({
        id: i + 1,
        title: titles[Math.floor(Math.random() * titles.length)],
        familyName: `Gia đình ${i + 1}`,
        location: areas[Math.floor(Math.random() * areas.length)],
        salary: 150000 + Math.floor(Math.random() * 50000),
        postedDate: new Date(Date.now() - i * 86400000).toISOString(),
    }));
};

const StaffJobModerationPage = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const isDemo = searchParams.get("demo") === "true";

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const recordsPerPage = 10;
    const MAX_VISIBLE_PAGES = 15;
    const [inputPage, setInputPage] = useState("");

    const totalPages = Math.ceil(jobs.length / recordsPerPage);
    const indexOfLast = currentPage * recordsPerPage;
    const indexOfFirst = indexOfLast - recordsPerPage;
    const currentRecords = jobs.slice(indexOfFirst, indexOfLast);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const getPaginationRange = () => {
        if (totalPages <= MAX_VISIBLE_PAGES) return Array.from({ length: totalPages }, (_, i) => i + 1);
        const range = [1];
        const middleStart = Math.max(currentPage - 2, 2);
        const middleEnd = Math.min(currentPage + 2, totalPages - 1);

        if (middleStart > 2) range.push("...");
        for (let i = middleStart; i <= middleEnd; i++) range.push(i);
        if (middleEnd < totalPages - 1) range.push("...");
        range.push(totalPages);
        return range;
    };

    const fetchJobs = () => {
        setLoading(true);
        setError(null);

        if (isDemo) {
            setJobs(generateFakeJobs());
            setLoading(false);
            return;
        }

        const token = localStorage.getItem("authToken");

        axios.get("http://localhost:5280/api/Job/JobList", {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            },
            params: {
                pageNumber: 1,
                pageSize: 100
            }
        })
            .then((response) => {
                const filteredJobs = response.data
                    .filter(job => job.status === 1) // Only jobs pending moderation
                    .map(job => ({
                        id: job.jobID,
                        title: job.jobName,
                        familyName: `Gia đình #${job.familyID}`,
                        location: job.location,
                        salary: job.price,
                        postedDate: job.createdAt
                    }));
                setJobs(filteredJobs);
            })
            .catch((err) => {
                console.error("Error fetching jobs:", err);
                setError("Failed to load jobs.");
            })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        fetchJobs();
    }, [isDemo]);

    const handleApprove = (id) => {
        // Here you'd also call the backend to approve
        setJobs(prev => prev.filter(job => job.id !== id));
    };

    const handleReject = (id) => {
        const reason = prompt(t("enter_reject_reason"));
        if (!reason) return;
        // You could POST `reason` to your API here
        setJobs(prev => prev.filter(job => job.id !== id));
    };

    const handlePageInput = (event) => {
        const value = event.target.value;
        if (/^\d*$/.test(value)) {
            setInputPage(value);
        }
    };

    const handlePageSubmit = (event) => {
        event.preventDefault();
        const pageNumber = parseInt(inputPage, 10);
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            paginate(pageNumber);
        }
        setInputPage("");
    };

    if (loading || error) {
        return (
            <div className="dashboard-container">
                {loading && (
                    <>
                        <span className="icon-loading" />
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        {!isDemo && (
                            <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                                {t("view_demo")}
                            </button>
                        )}
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="dashboard-container">
            <h1>{t("job_moderation_title")} {isDemo ? "(Demo Mode)" : ""}</h1>
            <button className="btn-secondary mb-2" onClick={fetchJobs}>
                {t("refresh")}
            </button>

            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>{t("job_title")}</th>
                        <th>{t("family_name")}</th>
                        <th>{t("location")}</th>
                        <th>{t("salary")}</th>
                        <th>{t("posted_date")}</th>
                        <th>{t("actions")}</th>
                    </tr>
                </thead>
                <tbody>
                    {currentRecords.map((job) => (
                        <tr key={job.id}>
                            <td>{job.id}</td>
                            <td>{job.title}</td>
                            <td>{job.familyName}</td>
                            <td>{job.location}</td>
                            <td>{job.salary.toLocaleString()} VNĐ</td>
                            <td>{new Date(job.postedDate).toLocaleDateString()}</td>
                            <td>
                                <button className="dashboard-btn dashboard-btn-approve" onClick={() => handleApprove(job.id)}>
                                    {t("approve")}
                                </button>
                                <button className="dashboard-btn dashboard-btn-reject" onClick={() => handleReject(job.id)}>
                                    {t("reject")}
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="housekeeper-pagination">
                {totalPages > 15 && (
                    <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1}>
                        &laquo;
                    </button>
                )}

                {getPaginationRange().map((page, index) =>
                    page === "..." ? (
                        <span key={index} className="dots">...</span>
                    ) : (
                        <button
                            key={index}
                            onClick={() => paginate(page)}
                            className={currentPage === page ? "active-page" : ""}
                        >
                            {page}
                        </button>
                    )
                )}

                {totalPages > 15 && (
                    <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages}>
                        &raquo;
                    </button>
                )}

                {totalPages > 15 && (
                    <form onSubmit={handlePageSubmit} className="pagination-input-form">
                        <input
                            type="text"
                            className="pagination-input"
                            value={inputPage}
                            onChange={handlePageInput}
                            placeholder="Go to..."
                        />
                        <button type="submit" className="pagination-go-btn">Go</button>
                    </form>
                )}
            </div>
        </div>
    );
};

export default StaffJobModerationPage;
