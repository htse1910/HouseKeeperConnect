import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const IDCardImages = () => {
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [showImages, setShowImages] = useState(false);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.frontPhoto) {
          setFrontPhoto(`data:image/jpeg;base64,${data.frontPhoto}`);
        }
        if (data.backPhoto) {
          setBackPhoto(`data:image/jpeg;base64,${data.backPhoto}`);
        }
        if (data.facePhoto) {
          setFacePhoto(`data:image/jpeg;base64,${data.facePhoto}`);
        }
      })
      .catch((err) => console.error("Lỗi khi lấy ảnh CMND:", err));
  }, [accountID, authToken]);

  const toggleImages = () => {
    setShowImages(!showImages);
  };

  return (
    <div className="card p-4 shadow-sm mt-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0">Hình ảnh CMND</h5>
        <button className="btn btn-outline-primary btn-sm" onClick={toggleImages}>
          {showImages ? "Ẩn hình ảnh" : "Hiện hình ảnh"}
        </button>
      </div>

      {showImages && (frontPhoto || backPhoto || facePhoto) ? (
        <div className="row">
          {/* Mặt trước */}
          <div className="col-md-4 mb-3">
            <div className="card h-100 p-3 text-center">
              <p className="fw-semibold mb-2">Mặt trước</p>
              {frontPhoto ? (
                <img
                  src={frontPhoto}
                  alt="CMND mặt trước"
                  className="rounded shadow-sm border mx-auto"
                  style={{
                    width: "240px",
                    height: "auto",
                    transform: "rotate(270deg)",
                  }}
                />
              ) : (
                <p className="text-muted">Chưa có ảnh mặt trước</p>
              )}
            </div>
          </div>

          {/* Mặt sau */}
          <div className="col-md-4 mb-3">
            <div className="card h-100 p-3 text-center">
              <p className="fw-semibold mb-2">Mặt sau</p>
              {backPhoto ? (
                <img
                  src={backPhoto}
                  alt="CMND mặt sau"
                  className="rounded shadow-sm border mx-auto"
                  style={{
                    width: "240px",
                    height: "auto",
                    transform: "rotate(270deg)",
                  }}
                />
              ) : (
                <p className="text-muted">Chưa có ảnh mặt sau</p>
              )}
            </div>
          </div>

          {/* Ảnh khuôn mặt */}
          <div className="col-md-4 mb-3">
            <div className="card h-100 p-3 text-center">
              <p className="fw-semibold mb-2">Ảnh khuôn mặt</p>
              {facePhoto ? (
                <img
                  src={facePhoto}
                  alt="Ảnh khuôn mặt"
                  className="rounded shadow-sm border mx-auto"
                  style={{
                    width: "240px",
                    height: "auto",
                  }}
                />
              ) : (
                <p className="text-muted">Chưa có ảnh khuôn mặt</p>
              )}
            </div>
          </div>
        </div>
      ) : !showImages ? (
        <p className="text-muted">Hình ảnh đang được ẩn</p>
      ) : (
        <p className="text-muted">Chưa có hình ảnh CMND</p>
      )}
    </div>
  );
};

export default IDCardImages;
