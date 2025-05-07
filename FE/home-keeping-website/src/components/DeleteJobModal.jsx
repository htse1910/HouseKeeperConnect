import React from "react";

const DeleteJobModal = ({ job, onConfirm, onCancel }) => {
  if (!job) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Gửi yêu cầu xoá công việc</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>Bạn có chắc muốn gửi yêu cầu <strong>xóa công việc</strong> này không?</p>
            <p><strong>Loại yêu cầu:</strong> Job (2)</p>
            <p><strong>Nội dung:</strong><br />
              Please delete the job <strong>{job.jobName}</strong>, ID: <strong>{job.jobID}</strong>
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onConfirm}>
              Gửi yêu cầu
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              Huỷ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobModal;
