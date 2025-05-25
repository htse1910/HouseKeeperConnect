import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HouseKeeper from "./images/homepage-housekeeper.png";
import { Modal, Button } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePageHeader() {
  const navigate = useNavigate();
  const [animate, setAnimate] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    setAnimate(true);
  }, []);

  const handleImageClick = () => {
    setShowModal(true);
  };

  const handleClose = () => setShowModal(false);
  const handleYes = () => {
    setShowModal(false);
    window.open('https://drive.google.com/drive/folders/1l2RuUtflP9-34i-wJ3qJ2ObgqS2T9xkR?usp=sharing', '_blank');
  };

  return (
    <div className="container py-5">
      <div className="row align-items-center">
        {/* Left */}
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
            <button
              className="btn btn-warning text-white fw-bold px-4 py-2 rounded-pill shadow-sm"
              onClick={() => navigate('/login?role=2')}
            >
              Tôi muốn tìm giúp việc
            </button>
            <button
              className="btn btn-outline-warning fw-bold px-4 py-2 rounded-pill shadow-sm"
              onClick={() => navigate('/login?role=1')}
            >
              Tôi là người giúp việc
            </button>
          </div>
        </div>

        {/* Right */}
        <div className="col-md-6 text-center mt-4 mt-md-0">
          <div
            className={`position-relative d-inline-block overflow-hidden rounded-4 shadow-sm ${animate ? 'fade-in-up' : ''}`}
            onClick={handleImageClick}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{ cursor: 'pointer', maxHeight: '420px' }}
          >
            <img
              src={HouseKeeper}
              alt="Housekeeper"
              className="img-fluid w-100"
              style={{ display: 'block', maxHeight: '420px', objectFit: 'cover' }}
            />
            {hovered && (
              <>
                <div
                  className="position-absolute top-0 start-0 w-100 h-100"
                  style={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    zIndex: 1,
                  }}
                ></div>
                <div
                  className="position-absolute top-50 start-50 translate-middle text-white fw-bold text-center"
                  style={{
                    zIndex: 2,
                    padding: '0 10px',
                    fontSize: '1rem',
                  }}
                >
                  Bạn có muốn tải<br />ứng dụng Android của chúng tôi?
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Tải ứng dụng Android</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có muốn tải ứng dụng Android của chúng tôi không?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Không
          </Button>
          <Button variant="warning" onClick={handleYes}>
            Có
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS Animation */}
      <style>{`
        .fade-in-up {
          opacity: 0;
          transform: translateY(20px);
          animation: fadeInUp 0.8s ease forwards;
        }
        @keyframes fadeInUp {
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}

export default HomePageHeader;
