import React, { useState } from "react";
import {
  FaIdCard,
  FaIdBadge,
  FaUserCheck,
  FaUpload
} from "react-icons/fa";

const IDVerificationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    frontPhoto: null,
    backPhoto: null,
    facePhoto: null,
  });

  const handleChange = (e) => {
    const { id, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : null,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 border-0 shadow-sm">
      <div className="mb-4">
        <label htmlFor="frontPhoto" className="form-label fw-semibold">
          <FaIdCard className="me-2 text-primary" />
          Ảnh mặt trước CMND/CCCD
        </label>
        <input
          type="file"
          className="form-control"
          id="frontPhoto"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="backPhoto" className="form-label fw-semibold">
          <FaIdBadge className="me-2 text-primary" />
          Ảnh mặt sau CMND/CCCD
        </label>
        <input
          type="file"
          className="form-control"
          id="backPhoto"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-4">
        <label htmlFor="facePhoto" className="form-label fw-semibold">
          <FaUserCheck className="me-2 text-primary" />
          Ảnh chân dung kèm CMND
        </label>
        <input
          type="file"
          className="form-control"
          id="facePhoto"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <div className="text-end">
        <button
          type="submit"
          className="btn btn-warning text-white fw-semibold rounded-pill px-4"
        >
          <FaUpload className="me-2" />
          Gửi xác minh
        </button>
      </div>
    </form>
  );
};

export default IDVerificationForm;
