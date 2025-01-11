function HomePage() {
    return (
      <div>
        {/* Hero Section */}
        <section className="bg-light py-5">
          <div className="container text-center text-lg-start">
            <div className="row align-items-center">
              <div className="col-lg-6">
                <h1 className="fw-bold text-orange">
                  GIÁ TRỊ ẤN TƯỢNG <br /> CỦA SỰ NGĂN NẮP
                </h1>
                <p className="text-muted">
                  Chúng tôi kết nối gia chủ và các ứng viên giúp việc có năng lực, trách nhiệm, và trung thực.
                </p>
                <div className="mt-4">
                  <button className="btn btn-warning text-white me-2">Tìm người giúp việc</button>
                  <button className="btn btn-outline-warning">Tôi là người giúp việc</button>
                </div>
              </div>
              <div className="col-lg-6">
                <img
                  src="https://png.pngtree.com/png-clipart/20200701/original/pngtree-cleaning-girl-sweeping-the-floor-png-image_5414419.jpg"
                  alt="Helping Hands"
                  className="img-fluid rounded shadow"
                />
              </div>
            </div>
          </div>
        </section>
  
       
      </div>
    );
  }
  
  export default HomePage;
  