import React, { useState, useEffect } from "react";

export const shouldShowLoadingOrError = (loading, error, t, extraAction = null) => {
  if (loading || error) {
    return (
      <div className="ui-feedback-box">
        {loading && (
          <>
            <span className="icon-loading"></span>
            <p className="ui-loading-text">{t("loading_data")}</p>
          </>
        )}
        {error && (
          <>
            <p className="ui-error-text">
              <span className="icon-error"></span> {error}
            </p>
            {extraAction}
          </>
        )}
      </div>
    );
  }
  return null;
};

export const getPagination = (
  data = [],
  currentPage = 1,
  pageSize = 10,
  maxVisiblePages = 15
) => {
  const totalPages = Math.ceil(data.length / pageSize);
  const indexOfLast = currentPage * pageSize;
  const indexOfFirst = indexOfLast - pageSize;
  const paginatedData = data.slice(indexOfFirst, indexOfLast);

  let pageRange = [];
  if (totalPages <= maxVisiblePages) {
    pageRange = Array.from({ length: totalPages }, (_, i) => i + 1);
  } else {
    const middleStart = Math.max(currentPage - 2, 2);
    const middleEnd = Math.min(currentPage + 2, totalPages - 1);
    pageRange = [1];

    if (middleStart > 2) pageRange.push("...");
    for (let i = middleStart; i <= middleEnd; i++) pageRange.push(i);
    if (middleEnd < totalPages - 1) pageRange.push("...");
    pageRange.push(totalPages);
  }

  return {
    paginatedData,
    pageRange,
    totalPages,
  };
};

// Tách logic lọc job theo filter
export const filterJobs = (jobs = [], filter = {}) => {
  const { status, serviceType, start_date } = filter;

  return jobs.filter((job) => {
    if (status !== "all" && job.status !== parseInt(status)) return false;

    if (
      serviceType !== "all" &&
      (!Array.isArray(job.serviceTypes) || !job.serviceTypes.includes(serviceType))
    ) return false;

    if (start_date) {
      const jobDate = new Date(job.createdDate).setHours(0, 0, 0, 0);
      const filterDate = new Date(start_date).setHours(0, 0, 0, 0);
      if (jobDate < filterDate) return false;
    }

    return true;
  });
};

// Tạo danh sách dịch vụ duy nhất theo kiểu
export const extractServiceTypes = (serviceList = []) => {
  return [...new Set(serviceList.map(s => s.serviceType))];
};

export const useBackToTop = (threshold = 150) => {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setShowBackToTop(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return showBackToTop;
};

export const renderBackToTopButton = (t) => (
  <button
    className={`btn-back-to-top show`}
    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
  >
    <i className="fa-solid fa-arrow-up" /> {t("misc.back_to_top")}
  </button>
);