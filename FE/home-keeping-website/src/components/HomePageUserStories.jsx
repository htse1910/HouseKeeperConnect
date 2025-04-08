import React from 'react';

function HomePageUserStories() {
  const stories = [
    {
      name: "Nguyễn Thu Hà",
      type: "Gia đình",
      avatar: "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      content: "Tôi đã tìm được người giúp việc tuyệt vời chỉ sau 2 ngày đăng tin! Dịch vụ rất chuyên nghiệp và đáng tin cậy.",
      rating: 5
    },
    {
      name: "Trần Việt Tú",
      type: "Người giúp việc",
      avatar: "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      content: "PCHWF giúp tôi có thu nhập ổn định hàng tháng. Tôi tìm được những gia đình tuyệt vời để làm việc.",
      rating: 5
    },
    {
      name: "Phạm Văn Đức",
      type: "Gia đình",
      avatar: "https://i.pinimg.com/736x/fc/04/73/fc047347b17f7df7ff288d78c8c281cf.jpg",
      content: "Dịch vụ tuyệt vời! Tôi đã giới thiệu PCHWF cho nhiều bạn bè và họ đều rất hài lòng với trải nghiệm này.",
      rating: 5
    }
  ];

  return (
    <section style={{ backgroundColor: '#FFF8F0', padding: '4rem 0' }}>
      <div className="container text-center">
        <h2
          className="fw-bold mb-2"
          style={{
            background: "linear-gradient(to right, #FF8C00, #FFA500)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Câu chuyện từ người dùng
        </h2>
        <p className="text-muted mb-5">
          Khám phá những trải nghiệm thực tế từ các gia đình và người giúp việc đã tin tưởng sử dụng dịch vụ của chúng tôi
        </p>

        <div className="row g-4">
          {stories.map((s, i) => (
            <div className="col-md-4" key={i}>
              <div className="bg-white rounded-4 shadow-sm p-4 h-100">
                <div className="d-flex align-items-center mb-3">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="rounded-circle me-3"
                    style={{ width: '56px', height: '56px', objectFit: 'cover' }}
                  />
                  <div className="text-start">
                    <h5 className="fw-bold mb-0">{s.name}</h5>
                    <small className="text-muted">{s.type}</small>
                  </div>
                </div>
                <p className="text-muted fst-italic">"{s.content}"</p>
                <div className="text-warning fs-5">
                  {'★'.repeat(s.rating)}{'☆'.repeat(5 - s.rating)}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <button className="btn btn-warning text-white fw-bold rounded-pill px-4 shadow-sm">
            Xem thêm đánh giá →
          </button>
        </div>
      </div>
    </section>
  );
}

export default HomePageUserStories;
