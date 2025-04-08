import React from 'react';
import HouseKeeper from "./images/homepage-housekeeper.png";

function HomePageHeader() {
  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left Section */}
        <div className="col-md-6">
          <h1
            className="fw-bold display-5 mb-3"
            style={{
              background: 'linear-gradient(to bottom, #FF7F00, #FFA500, #FFD700)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              lineHeight: '1.3',
            }}
          >
            GIÁ TRỊ ẤN TƯỢNG <br /> CỦA SỰ NGĂN NẮP
          </h1>
          <p className="text-muted fs-5 fw-semibold mb-4">
            Chúng tôi kết nối gia chủ và các ứng viên giúp việc có<br />
            năng lực, trách nhiệm và trung thực.
          </p>
          <div className="d-flex flex-wrap gap-3">
            <button className="btn btn-warning text-white fw-bold px-4 py-2 rounded-pill shadow-sm">
              Tôi muốn tìm giúp việc
            </button>
            <button className="btn btn-outline-warning fw-bold px-4 py-2 rounded-pill shadow-sm">
              Tôi là người giúp việc
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-md-6 text-center mt-4 mt-md-0">
          <img
            src={HouseKeeper}
            alt="Housekeeper"
            className="img-fluid rounded-4 shadow-sm"
            style={{ maxHeight: "420px" }}
          />
        </div>
      </div>
    </div>
  );
}

export default HomePageHeader;
