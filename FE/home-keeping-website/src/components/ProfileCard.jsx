import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";
import "../assets/styles/ProfileCard.css";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const ProfileCard = () => {
  const [name, setName] = useState("Chưa có");
  const [nickname, setNickname] = useState("Chưa có");
  const [gender, setGender] = useState("Chưa có");
  const [workArea, setWorkArea] = useState("Chưa có");
  const [rating, setRating] = useState(0);
  const [photo, setPhoto] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    const housekeeperID = localStorage.getItem("housekeeperID");

    if (!accountID || !authToken || !housekeeperID) return;

    fetch(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNickname(data.nickname?.trim() || "Chưa có");
      })
      .catch((err) => console.error("Lỗi khi lấy nickname:", err));

    fetch(`${API_BASE_URL}/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setName(data.name?.trim() || "Chưa có");

        if (data.gender === 1) setGender("Nam");
        else if (data.gender === 2) setGender("Nữ");
        else setGender("Chưa có");

        setWorkArea(data.address?.trim() || "Chưa có");

        if (data.localProfilePicture) {
          setPhoto(data.localProfilePicture);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy thông tin housekeeper:", err));

    fetch(`${API_BASE_URL}/Rating/GetRatingListByHK?id=${housekeeperID}&pageNumber=1&pageSize=100`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((sum, r) => sum + r.score, 0);
          const avg = total / data.length;
          setRating(avg);
        } else {
          setRating(0);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy đánh giá:", err));
  }, []);

  return (
    <div className="card shadow-sm border-0 p-4">
      <div className="row align-items-center">
        {/* Left Avatar */}
        <div className="col-md-3 text-center mb-4 mb-md-0">
          <div className="position-relative d-inline-block">
            {photo ? (
              <img
                src={photo}
                alt="Profile"
                className="rounded-circle border"
                style={{ width: "120px", height: "120px", objectFit: "cover" }}
              />
            ) : (
              <div
                className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
                style={{ width: "120px", height: "120px", fontSize: "48px" }}
              >
                ?
              </div>
            )}
            <div
              className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-1 border"
              style={{ cursor: "pointer" }}
              title="Cập nhật ảnh"
            >
              <FaCamera size={14} />
            </div>
          </div>
          <div className="fw-semibold mt-3">{name}</div>
        </div>

        {/* Right Content */}
        <div className="col-md-9">
          <div className="d-flex align-items-center mb-3">
            <h5 className="fw-bold mb-0 me-2">Thông tin cá nhân</h5>
            <Link to="/housekeeper/update-id" className="text-decoration-none" title="Chỉnh sửa thông tin">
              <FaEdit className="text-primary" />
            </Link>
          </div>

          {/* Rating */}
          <div className="d-flex align-items-center mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <FaStar
                key={star}
                className={`me-1 ${rating >= star ? "text-warning" : "text-muted"}`}
              />
            ))}
            <span className="ms-2 fw-semibold text-muted">({rating.toFixed(1)})</span>
          </div>

          {/* Profile Info Grid */}
          <div className="row g-3">
            <div className="col-sm-6">
              <div className="text-muted small">Tên thường gọi</div>
              <div className="fw-bold hover-gold">{nickname}</div>
            </div>
            <div className="col-sm-6">
              <div className="text-muted small">Giới tính</div>
              <div className="fw-bold hover-gold">{gender}</div>
            </div>
            <div className="col-sm-12">
              <div className="text-muted small">Khu vực làm việc</div>
              <div className="fw-bold hover-gold">{workArea}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
