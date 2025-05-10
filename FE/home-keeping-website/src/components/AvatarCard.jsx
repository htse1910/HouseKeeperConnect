import React from "react";
import "../assets/styles/ProfileIntroduction.css";

const AvatarCard = ({ family, mapGender, defaultAvatar }) => {
    return (
        <div
            className="card shadow-sm border-0 px-5 py-4 mb-4"
            style={{ borderRadius: "1.25rem", fontSize: "1.15rem" }}
        >
            <div className="d-flex align-items-center">
                {/* Avatar Section */}
                <div className="position-relative me-4 text-center">
                    <img
                        src={family?.localProfilePicture || family?.googleProfilePicture || defaultAvatar}
                        alt="Avatar"
                        className="rounded-circle"
                        style={{ width: "120px", height: "120px", objectFit: "cover" }}
                    />
                    <span
                        className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-1"
                        title="Đổi ảnh đại diện"
                        style={{
                            cursor: "pointer",
                            fontSize: "0.75rem",
                            border: "2px solid white"
                        }}
                    >
                        📷
                    </span>
                    <div className="fw-bold mt-3" style={{ fontSize: "1.2rem" }}>
                        {family?.name || "Không có tên"}
                    </div>
                </div>

                {/* Info Section */}
                <div className="flex-grow-1 ms-4 w-100 d-flex flex-column justify-content-start">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                        <div className="text-muted" style={{ fontSize: "1rem" }}>
                            Thông tin cá nhân
                        </div>
                        <a
                            href="/family/profile/update"
                            className="btn btn-sm btn-outline-primary"
                            style={{ fontSize: "0.85rem" }}
                            title="Chỉnh sửa hồ sơ"
                        >
                            ✏️ Chỉnh sửa
                        </a>
                    </div>
                    <div className="mb-3">
                        <div className="text-muted" style={{ fontSize: "0.95rem" }}>Tên thường gọi</div>
                        <div className="fw-bold text-uppercase intro-text hover-gold">
                            {family?.nickname || "Chưa có"}
                        </div>
                    </div>

                    <div className="mb-3">
                        <div className="text-muted" style={{ fontSize: "0.95rem" }}>Khu vực làm việc</div>
                        <div className="fw-bold intro-text hover-gold">
                            {family?.address || "Chưa có"}
                        </div>
                    </div>

                    <div>
                        <div className="text-muted" style={{ fontSize: "0.95rem" }}>Giới tính</div>
                        <div className="fw-bold intro-text hover-gold">
                            {mapGender(family?.gender)}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AvatarCard;