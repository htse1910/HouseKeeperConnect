import React, { useEffect, useState } from "react";
import { FaUser, FaStar, FaMapMarkerAlt, FaEdit, FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const [fullName, setFullName] = useState("...");
  const [location, setLocation] = useState("...");
  const [rating, setRating] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(0);
  const [jobsApplied, setJobsApplied] = useState(0);
  const [housekeeperID, setHousekeeperID] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(null);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    // Fetch account details
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName(data.name || "Không có thông tin");
      })
      .catch((error) =>
        console.error("Lỗi khi lấy dữ liệu tài khoản:", error)
      );

    // ✅ Replaced with GetHousekeeperListByAccountID
    fetch(
      `http://localhost:5280/api/HouseKeeper/GetHousekeeperListByAccountID?id=${accountID}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      }
    )
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data) {
          setHousekeeperID(data.housekeeperID);
          localStorage.setItem("housekeeperID", data.housekeeperID);
          setRating(data.rating ?? 0);
          setIsVerified(data.isVerified ?? false);
          setJobCompleted(data.jobCompleted ?? 0);
          setJobsApplied(data.jobsApplied ?? 0);
        }
      })
      .catch((error) =>
        console.error("Lỗi khi lấy dữ liệu người giúp việc:", error)
      );

    // Fetch profile picture
    fetch(`http://localhost:5280/api/HouseKeeper/ListHousekeeperPending`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const housekeeper = data.find(
          (hk) => hk.housekeeperID === parseInt(accountID)
        );
        if (housekeeper?.frontPhoto) {
          setProfilePhoto(`data:image/png;base64,${housekeeper.facePhoto}`);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy ảnh hồ sơ:", error));
  }, [accountID, authToken]);

  return (
    <div className="card p-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        {profilePhoto ? (
          <img
            src={profilePhoto}
            alt="Profile"
            className="rounded-circle me-3"
            width="100"
            height="100"
          />
        ) : (
          <div
            className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center me-3"
            style={{ width: "100px", height: "100px", fontSize: "40px" }}
          >
            <FaUser />
          </div>
        )}
        <div>
          <h4 className="fw-bold">{fullName}</h4>

          <p className="mb-0"><strong>Mã Người giúp việc:</strong> {housekeeperID ?? "Chưa có"}</p>

          <div className="d-flex align-items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={i < rating ? "text-warning" : "text-muted"}
              />
            ))}
            <span className="ms-2 text-muted">({rating?.toFixed(1)})</span>
          </div>

          <p className="mb-0">
            <FaMapMarkerAlt className="text-danger me-2" />
            <strong>Khu vực làm việc:</strong> {location}
          </p>
          <p className="mb-0">
            <strong>Công việc đã hoàn thành:</strong> {jobCompleted}
          </p>
          <p className="mb-0">
            <strong>Công việc đã ứng tuyển:</strong> {jobsApplied}
          </p>
          <p className="mb-0">
            <strong>Trạng thái xác minh:</strong>{" "}
            {isVerified ? (
              <span className="text-success">
                <FaCheckCircle /> Đã xác minh
              </span>
            ) : (
              <span className="text-danger">
                <FaTimesCircle /> Chưa xác minh
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Buttons Section */}
      <div className="d-flex flex-column gap-2 mt-3">
        <Link
          to={`/housekeeper/profile/update/${accountID}`}
          className="btn btn-outline-secondary"
        >
          <FaEdit className="me-2" /> Chỉnh Sửa Tài Khoản
        </Link>
      </div>
    </div>
  );
};

export default ProfileCard;
