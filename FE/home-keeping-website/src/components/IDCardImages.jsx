import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";

const IDCardImages = () => {
  const [frontPhoto, setFrontPhoto] = useState(null);
  const [backPhoto, setBackPhoto] = useState(null);
  const [facePhoto, setFacePhoto] = useState(null);
  const [showImages, setShowImages] = useState(false);

  const [frontRotation, setFrontRotation] = useState(0);
  const [backRotation, setBackRotation] = useState(0);
  const [faceRotation, setFaceRotation] = useState(0);

  const accountID = localStorage.getItem("accountID");
  const authToken = localStorage.getItem("authToken");

  useEffect(() => {
    if (!accountID || !authToken) return;

    fetch(`http://localhost:5280/api/HouseKeeper/GetHousekeeperByAccountID?id=${accountID}`, {
      headers: { Authorization: `Bearer ${authToken}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.frontPhoto) setFrontPhoto(data.frontPhoto);
        if (data.backPhoto) setBackPhoto(data.backPhoto);
        if (data.facePhoto) setFacePhoto(data.facePhoto);
      })
      .catch((err) => console.error("Lỗi khi lấy ảnh CMND:", err));
  }, [accountID, authToken]);

  const toggleImages = () => setShowImages(!showImages);

  const rotateLeft = (current) => (current - 90 + 360) % 360;
  const rotateRight = (current) => (current + 90) % 360;

  return (
    <div className="card p-4 shadow-sm mt-4 border-0">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h5 className="fw-bold mb-0">Hình ảnh CMND</h5>
        <Button variant="outline-primary" size="sm" onClick={toggleImages}>
          {showImages ? "Ẩn hình ảnh" : "Hiện hình ảnh"}
        </Button>
      </div>

      {showImages && (frontPhoto || backPhoto || facePhoto) ? (
        <div className="row g-4">
          {/* Mặt trước */}
          <div className="col-md-4">
            <div className="card h-100 p-3 border-0 shadow-sm">
              <div className="fw-semibold mb-2 text-center">Mặt trước</div>
              {frontPhoto ? (
                <>
                  <img
                    src={frontPhoto}
                    alt="CMND mặt trước"
                    className="img-fluid rounded border"
                    style={{
                      maxHeight: "320px",
                      width: "100%",
                      objectFit: "contain",
                      transform: `rotate(${frontRotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => setFrontRotation(rotateLeft(frontRotation))}>
                      ⏪ Xoay trái 90°
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => setFrontRotation(rotateRight(frontRotation))}>
                      ⏩ Xoay phải 90°
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted text-center">Chưa có ảnh mặt trước</p>
              )}
            </div>
          </div>

          {/* Mặt sau */}
          <div className="col-md-4">
            <div className="card h-100 p-3 border-0 shadow-sm">
              <div className="fw-semibold mb-2 text-center">Mặt sau</div>
              {backPhoto ? (
                <>
                  <img
                    src={backPhoto}
                    alt="CMND mặt sau"
                    className="img-fluid rounded border"
                    style={{
                      maxHeight: "320px",
                      width: "100%",
                      objectFit: "contain",
                      transform: `rotate(${backRotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => setBackRotation(rotateLeft(backRotation))}>
                      ⏪ Xoay trái 90°
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => setBackRotation(rotateRight(backRotation))}>
                      ⏩ Xoay phải 90°
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted text-center">Chưa có ảnh mặt sau</p>
              )}
            </div>
          </div>

          {/* Ảnh khuôn mặt */}
          <div className="col-md-4">
            <div className="card h-100 p-3 border-0 shadow-sm">
              <div className="fw-semibold mb-2 text-center">Ảnh khuôn mặt</div>
              {facePhoto ? (
                <>
                  <img
                    src={facePhoto}
                    alt="Ảnh khuôn mặt"
                    className="img-fluid rounded border"
                    style={{
                      maxHeight: "320px",
                      width: "100%",
                      objectFit: "contain",
                      transform: `rotate(${faceRotation}deg)`,
                      transition: "transform 0.3s ease",
                    }}
                  />
                  <div className="d-flex justify-content-center gap-2 mt-2">
                    <Button size="sm" variant="outline-secondary" onClick={() => setFaceRotation(rotateLeft(faceRotation))}>
                      ⏪ Xoay trái 90°
                    </Button>
                    <Button size="sm" variant="outline-secondary" onClick={() => setFaceRotation(rotateRight(faceRotation))}>
                      ⏩ Xoay phải 90°
                    </Button>
                  </div>
                </>
              ) : (
                <p className="text-muted text-center">Chưa có ảnh khuôn mặt</p>
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
