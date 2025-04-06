import React, { useEffect, useState } from "react";
import "../assets/styles/HousekeeperReviewList.css";

const HousekeeperReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `http://localhost:5280/api/Rating/GetRatingListByHK?id=${housekeeperID}&pageNumber=1&pageSize=100`,
          {
            headers: { Authorization: `Bearer ${authToken}` },
          }
        );
        const ratingList = await res.json();

        const enrichedReviews = await Promise.all(
          ratingList.map(async (r) => {
            try {
              const familyRes = await fetch(
                `http://localhost:5280/api/Families/GetFamilyByID?id=${r.familyID}`,
                {
                  headers: { Authorization: `Bearer ${authToken}` },
                }
              );
              const family = await familyRes.json();

              const accRes = await fetch(
                `http://localhost:5280/api/Account/GetAccount?id=${family.accountID}`,
                {
                  headers: { Authorization: `Bearer ${authToken}` },
                }
              );
              const account = await accRes.json();

              return {
                ...r,
                reviewerName: account.name,
                profilePicture: account.localProfilePicture,
              };
            } catch {
              return { ...r, reviewerName: "Không rõ", profilePicture: null };
            }
          })
        );

        enrichedReviews.sort((a, b) => new Date(b.createAt) - new Date(a.createAt));
        setReviews(enrichedReviews);
      } catch (err) {
        console.error("Lỗi khi tải đánh giá:", err);
      }
    };

    if (housekeeperID && authToken) fetchReviews();
  }, [housekeeperID, authToken]);

  const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">📣 Đánh giá gần đây</h5>
      </div>

      <div className="review-scroll-area p-1">
        {reviews.length === 0 ? (
          <p className="text-muted text-center mb-0">Chưa có đánh giá nào.</p>
        ) : (
          reviews.map((r) => (
            <div
              key={r.ratingID}
              className="d-flex align-items-start mb-3 p-3 rounded shadow-sm bg-light"
            >
              <img
                src={r.profilePicture || "/default-avatar.png"}
                alt={r.reviewerName}
                className="rounded-circle me-3 border"
                style={{ width: "48px", height: "48px", objectFit: "cover" }}
              />
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <span className="fw-semibold text-dark">{r.reviewerName}</span>
                  <small className="text-muted">{formatDate(r.createAt)}</small>
                </div>
                <div className="text-muted small">{r.content}</div>
              </div>
              <span className="badge bg-warning text-dark ms-3 align-self-start">
                {r.score}/5
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HousekeeperReviewList;
