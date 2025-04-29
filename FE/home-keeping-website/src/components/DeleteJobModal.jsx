import React from "react";
import { useTranslation } from "react-i18next";

const DeleteJobModal = ({ job, onConfirm, onCancel }) => {
  const { t } = useTranslation();

  if (!job) return null;

  return (
    <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{t("popup.popup.confirm_delete_title")}</h5>
            <button type="button" className="btn-close" onClick={onCancel}></button>
          </div>
          <div className="modal-body">
            <p>{t("popup.popup.confirm_delete_text", { title: job.jobName })}</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-danger" onClick={onConfirm}>
              {t("confirm")}
            </button>
            <button className="btn btn-secondary" onClick={onCancel}>
              {t("cancel")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteJobModal;
