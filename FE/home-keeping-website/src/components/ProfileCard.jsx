import React, { useEffect, useState } from "react";
import { FaStar, FaMapMarkerAlt, FaEdit, FaCheckCircle, FaTimesCircle, FaExclamationTriangle } from "react-icons/fa";
import { Link } from "react-router-dom";

const ProfileCard = () => {
  const [fullName, setFullName] = useState("...");
  const [location, setLocation] = useState("...");
  const [rating, setRating] = useState(0);
  const [isVerified, setIsVerified] = useState(false);
  const [jobCompleted, setJobCompleted] = useState(0);
  const [jobsApplied, setJobsApplied] = useState(0);
  const [profilePhoto, setProfilePhoto] = useState(null); // Store Base64 Image
  const [hasUploadedID, setHasUploadedID] = useState(false); // Track if ID images exist
  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    // Fetch account details (Full Name)
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setFullName(data.name || "Không có thông tin");
      })
      .catch((error) => console.error("Lỗi khi lấy dữ liệu tài khoản:", error));

    // Fetch housekeeper details (Location, Rating, Verification, Jobs)
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (!res.ok) {
          setHasUploadedID(false); // No response means no ID uploaded
          return null;
        }
        return res.json();
      })
      .then((data) => {
        if (data) {
          setLocation(data.location || "Chưa cập nhật");
          setRating(data.rating || 0);
          setIsVerified(data.isVerified || false);
          setJobCompleted(data.jobCompleted || 0);
          setJobsApplied(data.jobsApplied || 0);
          setHasUploadedID(true); // If we have data, assume ID has been uploaded
        }
      })
      .catch((error) => {
        console.error("Lỗi khi lấy dữ liệu người giúp việc:", error);
        setHasUploadedID(false);
      });

    // Fetch profile picture from ListHousekeeperPending API
    fetch(`http://localhost:5280/api/HouseKeeper/ListHousekeeperPending`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const housekeeper = data.find((hk) => hk.housekeeperID === parseInt(accountID));
        if (housekeeper?.frontPhoto) {
          setProfilePhoto(`data:image/png;base64,${housekeeper.facePhoto}`);
        }
      })
      .catch((error) => console.error("Lỗi khi lấy ảnh hồ sơ:", error));
  }, [accountID, authToken]);

  return (
    <div className="card p-4 shadow-sm d-flex flex-column flex-md-row align-items-center justify-content-between">
      <div className="d-flex align-items-center">
        <img
          src={profilePhoto || "/default-profile.png"}
          alt="Profile"
          className="rounded-circle me-3"
          width="100"
          height="100"
        />
        <div>
          <h4 className="fw-bold">{fullName}</h4>
          <div className="d-flex align-items-center">
            {[...Array(5)].map((_, i) => (
              <FaStar key={i} className={i < rating ? "text-warning" : "text-muted"} />
            ))}
            <span className="ms-2 text-muted">({rating.toFixed(1)})</span>
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
        {/* Edit Profile Button */}
        <Link to={`/housekeeper/profile/update/${accountID}`} className="btn btn-outline-secondary">
          <FaEdit className="me-2" /> Chỉnh Sửa Tài Khoản
        </Link>

        {/* Conditional ID Upload / Update Button */}
        {!hasUploadedID ? (
          <div>
            <div className="alert alert-warning d-flex align-items-center">
              <FaExclamationTriangle className="me-2" />
              Bạn chưa đăng ảnh lên
            </div>
            <Link to="/housekeeper/upload-id" className="btn btn-warning">
              Đăng ảnh lên
            </Link>
          </div>
        ) : (
          <Link to="/housekeeper/update-id" className="btn btn-primary">
            Cập nhật thông tin chi tiết
          </Link>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
