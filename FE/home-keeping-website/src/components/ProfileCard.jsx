import React, { useEffect, useState } from "react";
import { FaStar, FaEdit, FaCamera } from "react-icons/fa";
import { Link } from "react-router-dom";

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
    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");
    const housekeeperID = localStorage.getItem("housekeeperID");

    if (!accountID || !authToken || !housekeeperID) return;

    // Get nickname
    fetch(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        setNickname(data.nickname?.trim() || "Chưa có");
      })
      .catch((err) => console.error("Lỗi khi lấy nickname:", err));

    // Get Housekeeper info
    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
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

    // ✅ Fetch all ratings for this housekeeperID
    fetch(`http://localhost:5280/api/Rating/GetRatingListByHK?id=${housekeeperID}&pageNumber=1&pageSize=100`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          const total = data.reduce((sum, r) => sum + r.score, 0);
          const avg = total / data.length;
          console.log("⭐ Total reviews:", data.length, "Avg score:", avg);
          setRating(avg);
        } else {
          setRating(0);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy đánh giá:", err));
  }, []);


  return (
    <div className="d-flex align-items-center p-4 border rounded shadow-sm bg-white">
      {/* Left Avatar */}
      <div className="position-relative me-4 text-center">
        <div className="position-relative">
          {photo ? (
            <img
              src={photo}
              alt="Profile"
              className="rounded-circle"
              style={{ width: "100px", height: "100px", objectFit: "cover" }}
            />
          ) : (
            <div
              className="bg-secondary text-white rounded-circle d-flex align-items-center justify-content-center"
              style={{ width: "100px", height: "100px", fontSize: "40px" }}
            >
              ?
            </div>
          )}

          <div
            className="position-absolute bottom-0 end-0 bg-warning rounded-circle p-1"
            style={{ cursor: "pointer" }}
          >
            <FaCamera />
          </div>
        </div>
        <div className="mt-2 fw-semibold">{name}</div>
      </div>

      {/* Right Info */}
      <div>
        <h5 className="fw-bold mb-2">
          Thông tin cá nhân{" "}
          <Link to="/housekeeper/update-id">
            <FaEdit style={{ cursor: "pointer" }} />
          </Link>
        </h5>

        <div className="d-flex align-items-center mb-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              className={rating >= star ? "text-warning" : "text-muted"}
            />
          ))}
          <span className="ms-2">({rating.toFixed(1)})</span>
        </div>

        <p className="mb-1">
          <strong>Tên thường gọi:</strong> {nickname}
        </p>
        <p className="mb-1">
          <strong>Giới tính:</strong> {gender}
        </p>
        <p className="mb-0">
          <strong>Khu vực làm việc:</strong> {workArea}
        </p>
      </div>
    </div>
  );
};

export default ProfileCard;
