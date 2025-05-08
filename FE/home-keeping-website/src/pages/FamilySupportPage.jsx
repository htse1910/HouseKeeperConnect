import React, { useState, useEffect } from "react";
import "../assets/styles/Support.css";
import { useTranslation } from "react-i18next";
import API_BASE_URL from "../config/apiConfig";
import { formatDateTimeISO } from "../utils/formatData";

const FamilySupportPage = () => {
  const { t } = useTranslation();

  const [supportRequests, setSupportRequests] = useState([]);
  const [formData, setFormData] = useState({ subject: "", content: "" });
  const [accountId, setAccountId] = useState(null);
  const [authToken, setAuthToken] = useState("");

  useEffect(() => {
    const uid = localStorage.getItem("accountID");
    const token = localStorage.getItem("authToken");
    if (uid && token) {
      setAccountId(uid);
      setAuthToken(token);
      fetchSupportRequests(uid, token);
    }
  }, []);

  const fetchSupportRequests = async (uid, token) => {
    try {
      const response = await fetch(
        `${API_BASE_URL}/SupportRequest/GetSupportRequestByAccount?id=${uid}&pageNumber=1&pageSize=20`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      setSupportRequests(data || []);
    } catch (err) {
      console.error("Lỗi khi tải yêu cầu hỗ trợ:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.subject || !formData.content || !accountId || !authToken) return;

    const form = new FormData();
    const query = new URLSearchParams({
      RequestedBy: accountId,
      Type: 1,
      Content: `${formData.subject} - ${formData.content}`,
    });

    try {
      const response = await fetch(`${API_BASE_URL}/SupportRequest/AddSupportRequest?${query}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
        body: form,
      });

      if (response.ok) {
        setFormData({ subject: "", content: "" });
        fetchSupportRequests(accountId, authToken);
      } else {
        console.error("Gửi thất bại");
      }
    } catch (err) {
      console.error("Lỗi khi gửi yêu cầu hỗ trợ:", err);
    }
  };

  const supportSections = [
    { title: t("support.post_job"), content: t("support.post_job_desc") },
    { title: t("support.payment"), content: t("support.payment_desc") },
    { title: t("support.contact_housekeeper"), content: t("support.contact_housekeeper_desc") },
    { title: t("support.rate_review"), content: t("support.rate_review_desc") },
    { title: t("support.job_tracking"), content: t("support.job_tracking_desc") },
    { title: t("support.contact_staff"), content: t("support.contact_staff_desc") },
  ];

  return (
    <div className="support-page">
      <section className="support-hero">
        <h1>{t("navigation.support")}</h1>
        <p>{t("support.family_support_intro")}</p>
      </section>

      <div className="support-section-container">
        {supportSections.map((section, index) => (
          <div className="support-section" key={index}>
            <h2 className="support-section-title">{section.title}</h2>
            <p className="support-section-content">{section.content}</p>
          </div>
        ))}
      </div>

      <div className="support-form-and-history">
        <div className="support-form-section">
          <h2>{t("support.send_request")}</h2>
          <form onSubmit={handleSubmit} className="support-form">
            <input
              type="text"
              name="subject"
              placeholder={t("support.subject_placeholder")}
              value={formData.subject}
              onChange={handleChange}
              required
            />
            <textarea
              name="content"
              placeholder={t("support.content_placeholder")}
              rows={4}
              value={formData.content}
              onChange={handleChange}
              required
            />
            <button type="submit">{t("support.submit")}</button>
          </form>
        </div>

        {supportRequests.length > 0 && (
          <div className="support-history-section">
            <h2>{t("support.sent_requests")}</h2>
            <ul className="support-history-list">
              {supportRequests.map((req, index) => (
                <li key={index} className="support-history-item">
                  <strong>{req.content?.split(" - ")[0] || t("support.no_subject")}</strong>
                  <p>{req.content?.split(" - ").slice(1).join(" - ")}</p>
                  <p>
                    {t("misc.request_created_date")}: {formatDateTimeISO(req.createdDate)}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default FamilySupportPage;
