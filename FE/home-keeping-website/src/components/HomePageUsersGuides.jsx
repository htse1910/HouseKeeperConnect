import React from 'react';
import {
  FaUserPlus,
  FaQuestionCircle,
  FaHandshake,
  FaStar
} from 'react-icons/fa';

function HomePageUsersGuides() {
  const steps = [
    {
      icon: <FaUserPlus size={28} className="text-white" />,
      title: "Đăng ký tài khoản",
      desc: "Tạo tài khoản miễn phí trong vài phút với thông tin cơ bản của bạn",
    },
    {
      icon: <FaQuestionCircle size={28} className="text-white" />,
      title: "Xác thực thông tin",
      desc: "Hoàn thành xác minh danh tính để đảm bảo an toàn cho cộng đồng",
    },
    {
      icon: <FaHandshake size={28} className="text-white" />,
      title: "Kết nối đối tác",
      desc: "Tìm kiếm và kết nối với đối tác phù hợp nhất với nhu cầu của bạn",
    },
    {
      icon: <FaStar size={28} className="text-white" />,
      title: "Thanh toán & Đánh giá",
      desc: "Hoàn tất thanh toán an toàn và chia sẻ đánh giá trải nghiệm của bạn",
    }
  ];

  return (
    <section style={{ backgroundColor: '#FFFDF9', padding: '4rem 0' }}>
      <div className="container text-center">
        <h2
          className="fw-bold mb-3"
          style={{
            background: 'linear-gradient(to right, #FF8C00, #FFA500)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          PCHWF Hoạt động như thế nào?
        </h2>
        <p className="text-muted mb-5">
          Quy trình đơn giản, hiệu quả để bắt đầu sử dụng nền tảng của chúng tôi
        </p>

        <div className="row g-4">
          {steps.map((step, index) => (
            <div className="col-md-3" key={index}>
              <div className="card border-0 shadow-sm rounded-4 p-4 h-100">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "#FFC107",
                  }}
                >
                  {step.icon}
                </div>
                <h5 className="fw-bold mb-2">{step.title}</h5>
                <p className="text-muted small mb-0">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePageUsersGuides;
