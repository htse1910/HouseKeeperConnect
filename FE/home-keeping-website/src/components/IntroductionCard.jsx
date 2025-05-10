import React from "react";
import "../assets/styles/ProfileIntroduction.css";

const IntroductionCard = ({ introduction }) => {
  const isEmpty = !introduction || introduction.trim() === "";

  return (
    <div className="card p-4 shadow-sm mt-4 border-0" style={{ borderRadius: "1rem" }}>
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h5 className="fw-bold mb-0" style={{ fontSize: "1.25rem" }}>📝 Giới thiệu</h5>
      </div>
      <p
        className={`mt-2 mb-0 intro-text ${isEmpty ? "text-muted" : "hover-gold"}`}
        style={{ fontSize: "1.05rem" }}
      >
        {isEmpty ? "Chưa có" : introduction.trim()}
      </p>
    </div>
  );
};

export default IntroductionCard;
