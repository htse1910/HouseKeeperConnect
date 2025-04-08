import React from "react";
import { FaShieldAlt, FaTasks, FaCreditCard } from "react-icons/fa";

function HomePageUsersDesire() {
  const items = [
    {
      icon: <FaShieldAlt size={20} className="text-white" />,
      title: "Chuyên gia đáng tin cậy",
      desc: "Tất cả người giúp việc đều được xác minh vì sự an toàn của bạn",
    },
    {
      icon: <FaTasks size={20} className="text-white" />,
      title: "Dịch vụ tuỳ chỉnh",
      desc: "Điều chỉnh công việc vệ sinh phù hợp với nhu cầu của bạn",
    },
    {
      icon: <FaCreditCard size={20} className="text-white" />,
      title: "Thanh toán an toàn",
      desc: "Phương thức thanh toán nhanh chóng và an toàn",
    },
  ];

  return (
    <section style={{ backgroundColor: "#FFF8EE", padding: "4rem 0" }}>
      <div className="container text-center">
        <h2
          className="fw-bold mb-5"
          style={{
            background: "linear-gradient(to right, #FF8C00, #FFA500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Tại sao bạn yêu cầu chúng tôi?
        </h2>

        <div className="row g-4">
          {items.map((item, index) => (
            <div className="col-md-4" key={index}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div
                  className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                  style={{
                    width: "56px",
                    height: "56px",
                    backgroundColor: "#FFC107",
                  }}
                >
                  {item.icon}
                </div>
                <h5 className="fw-bold mb-2">{item.title}</h5>
                <p className="text-muted mb-0" style={{ fontSize: "0.95rem" }}>
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomePageUsersDesire;
