import React from "react";
import "../assets/styles/LandingPage.css";
import cleaningImage from "../assets/images/cleaning.jpg";

function LandingPage() {
    return (
        <div className="landing-page">
            {/* Hero Section */}
            <section className="hero">
                <div className="hero-content">
                    <h1>
                        <span className="highlight">GIÁ TRỊ ẤN TƯỢNG</span> <br />
                        CỦA SỰ NGĂN NẮP
                    </h1>
                    <p>
                        Chúng tôi kết nối gia chủ và các ứng viên giúp việc có năng lực,
                        trách nhiệm, và trung thực.
                    </p>
                    <div className="hero-buttons">
                        <button className="btn-primary">Tôi muốn tìm giúp việc</button>
                        <button className="btn-secondary">Tôi là người giúp việc</button>
                    </div>
                </div>
                <div className="hero-image">
                    <img src={cleaningImage} alt="Cleaning Service" />
                </div>
            </section>

            {/* Why Choose Us */}
            <section className="why-choose-us">
                <h2>Tại sao bạn yêu cầu chúng tôi?</h2>
                <div className="features">
                    <div className="feature">
                        <span className="icon">🛡️</span>
                        <h3>Chuyên gia đáng tin cậy</h3>
                        <p>
                            Tất cả người giúp việc đều được xác minh vì sự an toàn của bạn.
                        </p>
                    </div>
                    <div className="feature">
                        <span className="icon">⚙️</span>
                        <h3>Dịch vụ tùy chỉnh</h3>
                        <p>Điều chỉnh công việc vệ sinh phù hợp với nhu cầu của bạn.</p>
                    </div>
                    <div className="feature">
                        <span className="icon">💳</span>
                        <h3>Thanh toán an toàn</h3>
                        <p>Phương thức thanh toán nhanh chóng và an toàn.</p>
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="how-it-works">
                <h2>PCHWF Hoạt động như thế nào?</h2>
                <div className="steps">
                    <div className="step">
                        <span className="step-number">1</span>
                        <h3>Đăng ký tài khoản</h3>
                        <p>Tạo tài khoản miễn phí trong vài phút với thông tin cơ bản.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">2</span>
                        <h3>Xác thực thông tin</h3>
                        <p>Hoàn thành xác minh danh tính để đảm bảo an toàn cho cộng đồng.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">3</span>
                        <h3>Kết nối đối tác</h3>
                        <p>Tìm kiếm và kết nối với đối tác phù hợp nhất với nhu cầu của bạn.</p>
                    </div>
                    <div className="step">
                        <span className="step-number">4</span>
                        <h3>Thanh toán & Đánh giá</h3>
                        <p>Hoàn tất thanh toán an toàn và chia sẻ đánh giá trải nghiệm của bạn.</p>
                    </div>
                </div>
            </section>
            {/* Testimonials Section */}
            <section className="testimonials">
                <h2>Câu chuyện từ người dùng</h2>
                <p>
                    Khám phá những trải nghiệm thực tế từ các gia đình và người giúp việc đã tin tưởng sử dụng dịch vụ của chúng tôi
                </p>
                <div className="testimonial-cards">
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img src={require("../assets/images/avatar1.png")} alt="User" />
                            <div>
                                <h3>Nguyễn Thu Hà</h3>
                                <span>Gia đình</span>
                            </div>
                        </div>
                        <p>
                            "Tôi đã tìm được người giúp việc tuyệt vời chỉ sau 2 ngày đăng tin! Dịch vụ
                            rất chuyên nghiệp và đáng tin cậy."
                        </p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img src={require("../assets/images/avatar2.png")} alt="User" />
                            <div>
                                <h3>Trần Việt Tú</h3>
                                <span>Người giúp việc</span>
                            </div>
                        </div>
                        <p>
                            "PCHWF giúp tôi có thêm thu nhập ổn định hàng tháng. Tôi đã tìm được những
                            gia đình tuyệt vời để làm việc."
                        </p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                    <div className="testimonial-card">
                        <div className="testimonial-header">
                            <img src={require("../assets/images/avatar3.png")} alt="User" />
                            <div>
                                <h3>Phạm Văn Đức</h3>
                                <span>Gia đình</span>
                            </div>
                        </div>
                        <p>
                            "Dịch vụ tuyệt vời! Tôi đã giới thiệu PCHWF cho nhiều bạn bè và họ đều rất
                            hài lòng với trải nghiệm này."
                        </p>
                        <div className="stars">⭐⭐⭐⭐⭐</div>
                    </div>
                </div>
                <div className="testimonial-button-wrapper">
                    <button className="testimonial-button">
                        Xem thêm đánh giá
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    );
}

export default LandingPage;