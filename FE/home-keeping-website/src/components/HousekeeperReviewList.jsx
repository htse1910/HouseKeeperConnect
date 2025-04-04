import React, { useEffect, useState } from "react";

const HousekeeperReviewList = () => {
  const [reviews, setReviews] = useState([]);
  const housekeeperID = localStorage.getItem("housekeeperID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(`http://localhost:5280/api/Rating/GetRatingListByHK?id=${housekeeperID}&pageNumber=1&pageSize=100`, {
          headers: { Authorization: `Bearer ${authToken}` },
        });
        const ratingList = await res.json();

        const enrichedReviews = await Promise.all(
          ratingList.map(async (r) => {
            try {
              const familyRes = await fetch(`http://localhost:5280/api/Families/GetFamilyByID?id=${r.familyID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              });
              const family = await familyRes.json();

              const accRes = await fetch(`http://localhost:5280/api/Account/GetAccount?id=${family.accountID}`, {
                headers: { Authorization: `Bearer ${authToken}` },
              });
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

        // Sort by date (newest first)
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
    <div className="card shadow-sm p-3" style={{ maxHeight: "300px", overflowY: "auto" }}>
      <h5 className="fw-bold mb-3">📣 Đánh giá gần đây</h5>

      {reviews.length === 0 ? (
        <p className="text-muted">Chưa có đánh giá nào.</p>
      ) : (
        reviews.map((r) => (
          <div key={r.ratingID} className="d-flex align-items-start mb-3">
            <img
              src={r.profilePicture}
              alt={r.reviewerName}
              className="rounded-circle me-3"
              style={{ width: "40px", height: "40px", objectFit: "cover" }}
            />
            <div className="flex-grow-1">
              <div className="d-flex justify-content-between">
                <div className="fw-semibold">{r.reviewerName}</div>
                <small className="text-muted">{formatDate(r.createAt)}</small>
              </div>
              <div className="text-muted small">{r.content}</div>
            </div>
            <span className="badge bg-warning text-dark ms-2">{r.score}/5</span>
          </div>
        ))
      )}
    </div>
  );
};

export default HousekeeperReviewList;
