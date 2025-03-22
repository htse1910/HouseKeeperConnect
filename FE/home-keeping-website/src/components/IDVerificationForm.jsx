// components/IDVerificationForm.js
import React, { useState } from "react";

const IDVerificationForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    idNumber: "",
    realName: "",
    dateOfBirth: "",
    frontPhoto: null,
    backPhoto: null,
    facePhoto: null,
  });

  const handleChange = (e) => {
    const { id, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData); // Pass form data to parent
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 shadow-sm">
      <div className="mb-3">
        <label htmlFor="idNumber" className="form-label">Số CMND/CCCD</label>
        <input
          type="text"
          className="form-control"
          id="idNumber"
          required
          value={formData.idNumber}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="realName" className="form-label">Họ và tên</label>
        <input
          type="text"
          className="form-control"
          id="realName"
          required
          value={formData.realName}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="dateOfBirth" className="form-label">Ngày sinh</label>
        <input
          type="date"
          className="form-control"
          id="dateOfBirth"
          required
          value={formData.dateOfBirth}
          onChange={handleChange}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="frontPhoto" className="form-label">Ảnh mặt trước CMND/CCCD</label>
        <input
          type="file"
          className="form-control"
          id="frontPhoto"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="backPhoto" className="form-label">Ảnh mặt sau CMND/CCCD</label>
        <input
          type="file"
          className="form-control"
          id="backPhoto"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <div className="mb-3">
        <label htmlFor="facePhoto" className="form-label">Ảnh chân dung kèm CMND</label>
        <input
          type="file"
          className="form-control"
          id="facePhoto"
          accept="image/*"
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" className="btn btn-warning text-white fw-bold">
        Gửi xác minh
      </button>
    </form>
  );
};

export default IDVerificationForm;
