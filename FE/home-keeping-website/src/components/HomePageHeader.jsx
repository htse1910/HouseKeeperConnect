import React from 'react';
import HouseKeeper from "./images/homepage-housekeeper.png";
function HomePageHeader() {
    return (
        <div className="container" style={{ height: '400px' }}>
            <div className="row">
                {/* Left Section */}
                <div className="col-md-6 d-flex align-items-start flex-column">
                    <h1
                        className="fw-bold"
                        style={{
                            background: 'linear-gradient(to bottom, #FF7F00, #FFA500, #FFD700)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            marginTop: '40px',
                        }}
                    >
                        GIÁ TRỊ ẤN TƯỢNG <br /> CỦA SỰ NGĂN NẮP
                    </h1>
                    <p className="fw-bold text-muted mt-3">
                        Chúng tôi kết nối gia chủ và các ứng viên giúp việc có <br /> năng lực, trách nhiệm, và trung thực.
                    </p>
                    <div className="mt-4">
                        <button className="btn btn-warning text-white fw-bold me-2 shadow">Tôi muốn tìm giúp việc</button>
                        <button className="btn btn-outline-warning fw-bold shadow">Tôi là người giúp việc</button>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-md-6 d-flex justify-content-center align-items-center">
                    <img
                        src={HouseKeeper}
                        alt="Housekeeper"
                        className="img-fluid rounded"
                        style={{
                            maxHeight: '400px',
                            marginTop: '20px'
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default HomePageHeader;
