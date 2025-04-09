import React from "react";
import { useTranslation } from "react-i18next";

const Pagination = ({
  currentPage,
  totalPages,
  pageRange,
  onPageChange,
  onPageInput,
  onPageSubmit,
  inputPage
}) => {
  const { t } = useTranslation();

  return (
    <div className="pagination-container">
      {totalPages > 1 && (
        <>
          <button
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="pagination-btn"
          >
            &laquo; {t("pagination.previous")}
          </button>

          {pageRange.map((page, index) =>
            page === "..." ? (
              <span key={index} className="pagination-dots">...</span>
            ) : (
              <button
                key={index}
                onClick={() => onPageChange(page)}
                className={`pagination-btn ${currentPage === page ? "active-page" : ""}`}
              >
                {page}
              </button>
            )
          )}

          <button
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="pagination-btn"
          >
            {t("pagination.next")} &raquo;
          </button>

          <form onSubmit={onPageSubmit} className="pagination-form">
            <input
              type="text"
              className="pagination-input"
              value={inputPage}
              onChange={onPageInput}
              placeholder={t("pagination.go_to_placeholder")}
            />
            <button type="submit" className="pagination-go-btn">
              {t("pagination.go")}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default Pagination;
