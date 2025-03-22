import React from "react";
import { Link } from "react-router-dom";

const CertificatesAndDocuments = () => {
  return (
    <div className="col-md-6 d-flex">
      <div className="card p-4 shadow-sm w-100 h-100">
        <h5 className="fw-bold">Giấy tờ</h5>
        <ul className="list-unstyled">
          <li>
            📄 Giấy xác nhận lý lịch{" "}
            <Link to="/housekeeper/upload-id" className="text-primary">Xem</Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default CertificatesAndDocuments;
