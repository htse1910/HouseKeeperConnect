import React, { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import "../assets/styles/Job.css";

const FamilyJobPostingPage = () => {
    const { t } = useTranslation();

    const today = new Date();
    const start = today.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const end = nextWeek.toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        JobName: "",
        Location: "",
        Price: "",
        StartDate: start,
        EndDate: end,
        Description: "",
        StartSlot: "",
        EndSlot: "",
        DayofWeek: [],
        ServiceIDs: [],
        IsOffered: false
    });

    const [services, setServices] = useState([]);
    const [slots, setSlots] = useState([]);
    const [family, setFamily] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
    };

    useEffect(() => {
        if (!authToken || !accountID) return;

        const headers = {
            Authorization: `Bearer ${authToken}`,
            "Content-Type": "application/json",
        };

        setLoading(true);

        axios
            .get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((res) => {
                const account = res.data;
                if (!account?.accountID) throw new Error(t("error_auth"));

                axios
                    .get(`http://localhost:5280/api/Service/ServiceList`, { headers })
                    .then((res) => setServices(res.data || []))
                    .catch((err) => {
                        console.error("Không thể tải dịch vụ:", err);
                        setServices([]);
                    });

                axios
                    .get(`http://localhost:5280/api/Slot/SlotList`, { headers })
                    .then((res) => setSlots(res.data || []))
                    .catch((err) => {
                        console.error("Không thể tải Slot:", err);
                        setSlots([]);
                    });

                axios
                    .get(`http://localhost:5280/api/Families/GetFamilyByAccountID?id=${accountID}`, { headers })
                    .then((res) => setFamily(res.data || null))
                    .catch((err) => console.error("Không thể lấy Family:", err));
            })
            .catch((err) => {
                console.error(t("error_loading"), err);
                setServices([]);
                setSlots([]);
                setFamily([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (name === "ServiceIDs") {
            const id = parseInt(value);
            setFormData((prev) => ({
                ...prev,
                ServiceIDs: checked
                    ? [...prev.ServiceIDs, id]
                    : prev.ServiceIDs.filter((s) => s !== id),
            }));
        } else if (name === "DayofWeek") {
            const day = parseInt(value);
            setFormData((prev) => ({
                ...prev,
                DayofWeek: checked
                    ? [...prev.DayofWeek, day]
                    : prev.DayofWeek.filter((d) => d !== day),
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const validateForm = (data) => {
        if (
            !family.familyID ||
            !data.JobName ||
            !data.Location ||
            !data.StartDate ||
            !data.EndDate ||
            !data.StartSlot ||
            !data.EndSlot ||
            !data.Price ||
            data.ServiceIDs.length === 0 ||
            data.DayofWeek.length === 0
        ) {
            return "Vui lòng điền đầy đủ thông tin hợp lệ.";
        }

        if (new Date(data.StartDate) > new Date(data.EndDate)) {
            return "Ngày bắt đầu không thể lớn hơn ngày kết thúc.";
        }

        if (parseInt(data.StartSlot) >= parseInt(data.EndSlot)) {
            return "Giờ bắt đầu phải nhỏ hơn giờ kết thúc.";
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const dataToSubmit = {
            ...formData,
            FamilyID: family.familyID,
            StartSlot: parseInt(formData.StartSlot),
            EndSlot: parseInt(formData.EndSlot),
            SlotIDs: [parseInt(formData.StartSlot), parseInt(formData.EndSlot)],
            Price: parseFloat(formData.Price),
            StartDate: new Date(formData.StartDate).toISOString(),
            EndDate: new Date(formData.EndDate).toISOString(),
            IsOffered: false,
        };

        const validationError = validateForm(dataToSubmit);
        if (validationError) {
            setError(validationError);
            setLoading(false);
            return;
        }

        try {
            await axios.post("http://localhost:5280/api/Job/AddJob", dataToSubmit, {
                headers,
            });

            setMessage("🎉 Công việc đã được đăng thành công!");
            setFormData({
                JobName: "",
                Location: "",
                Price: "",
                StartDate: "",
                EndDate: "",
                Description: "",
                StartSlot: "",
                EndSlot: "",
                DayofWeek: [],
                ServiceIDs: [],
                IsOffered: false,
            });
        } catch (err) {
            console.error("Lỗi khi đăng công việc:", err);
            const serverMsg =
                err?.response?.data?.message || "Đã xảy ra lỗi khi đăng công việc.";
            setError(`❌ ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };

    console.log(slots);

    return (
        <div className="job-posting-container">
            <h1 className="job-posting-title">{t("post_job")}</h1>

            {message && <p className="job-posting-alert job-posting-success">{t("jobPost.success")}</p>}
            {error && <p className="job-posting-alert job-posting-error">{error}</p>}

            <form onSubmit={handleSubmit} className="job-posting-form-grid">

                {/* Tiêu đề & Địa điểm */}
                <div className="job-posting-group">
                    <div className="job-posting-row">
                        <label>{t("job_title")}</label>
                        <input
                            type="text"
                            name="JobName"
                            className="job-posting-input"
                            value={formData.JobName}
                            onChange={handleChange}
                            placeholder={t("jobPost.jobTitlePlaceholder")}
                            required
                        />
                    </div>
                    <div className="job-posting-row">
                        <label>{t("location")}</label>
                        <input
                            type="text"
                            name="Location"
                            className="job-posting-input"
                            value={formData.Location || family?.address || ""}
                            onChange={handleChange}
                            placeholder={t("jobPost.locationPlaceholder")}
                            required
                        />
                    </div>
                </div>

                {/* Dịch vụ phân loại theo serviceTypeName */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("jobPost.serviceTypeLabel")}</label>
                    <div className="job-posting-service-group">
                        {Object.entries(
                            services.reduce((acc, service) => {
                                const type = service?.serviceType?.serviceTypeName || "Unknown";
                                if (!acc[type]) acc[type] = [];
                                acc[type].push(service);
                                return acc;
                            }, {})
                        ).map(([type, items]) => (
                            <div key={type} className="job-posting-service-type">
                                <details>
                                    <summary>{t(`serviceTypeName.${type}`, type)}</summary>
                                    <div className="job-posting-service-checkboxes">
                                        {items.map((service) => {
                                            const name = service?.serviceName;
                                            return (
                                                <label key={service.serviceID} className="job-posting-checkbox-card">
                                                    <input
                                                        type="checkbox"
                                                        name="ServiceIDs"
                                                        value={service.serviceID}
                                                        checked={formData.ServiceIDs.includes(service.serviceID)}
                                                        onChange={handleChange}
                                                    />
                                                    <span>
                                                        {t(`serviceName.${type}.${name}`, service.description || name)}
                                                    </span>
                                                </label>
                                            );
                                        })}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Ngày làm việc */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("jobPost.workingDaysLabel")}</label>
                    <div className="job-posting-day-checkboxes">
                        {[0, 1, 2, 3, 4, 5, 6].map((d) => (
                            <label key={d} className="job-posting-checkbox-day">
                                <input
                                    type="checkbox"
                                    name="DayofWeek"
                                    value={d}
                                    checked={formData.DayofWeek.includes(d)}
                                    onChange={handleChange}
                                />
                                <span>{t(`workingDays.${["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][d]}`)}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Mức lương & thời gian */}
                <div className="job-posting-section">
                    <div className="job-posting-pair">
                        <label>{t("salary")}</label>
                        <div className="job-posting-price-wrapper">
                            <input
                                type="number"
                                name="Price"
                                className="job-posting-input"
                                step="1000"
                                min="0"
                                value={formData.Price}
                                onChange={handleChange}
                                placeholder={t("jobPost.salaryPlaceholder")}
                                required
                            />
                            <span className="job-posting-vnd-suffix">{t("jobPost.salaryUnit")}</span>
                        </div>
                    </div>
                    <div className="job-posting-pair">
                        <label>{t("jobPost.workingTimeLabel")}</label>
                        <div className="job-posting-time-inputs">
                            <select
                                name="StartSlot"
                                className="job-posting-input"
                                value={formData.StartSlot}
                                onChange={handleChange}
                            >
                                <option value="">{t("jobPost.startLabel")}</option>
                                {slots.map((slot) => (
                                    <option key={slot.slotID} value={slot.slotID}>
                                        {slot.time}
                                    </option>
                                ))}
                            </select>
                            <span>-</span>
                            <select
                                name="EndSlot"
                                className="job-posting-input"
                                value={formData.EndSlot}
                                onChange={handleChange}
                            >
                                <option value="">{t("jobPost.endLabel")}</option>
                                {slots.map((slot) => (
                                    <option key={slot.slotID} value={slot.slotID}>
                                        {slot.time}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Ngày bắt đầu / kết thúc */}
                <div className="job-posting-section">
                    <div className="job-posting-pair">
                        <label>{t("filter.start_date")}</label>
                        <input
                            type="date"
                            name="StartDate"
                            className="job-posting-input"
                            value={formData.StartDate}
                            onChange={handleChange}
                            placeholder={t("jobPost.startDatePlaceholder")}
                            required
                        />
                    </div>
                    <div className="job-posting-pair">
                        <label>{t("jobPost.endDate")}</label>
                        <input
                            type="date"
                            name="EndDate"
                            className="job-posting-input"
                            value={formData.EndDate}
                            onChange={handleChange}
                            placeholder={t("jobPost.endDatePlaceholder")}
                            required
                        />
                    </div>
                </div>

                {/* Mô tả */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("description")}</label>
                    <textarea
                        name="Description"
                        className="job-posting-textarea"
                        rows="3"
                        value={formData.Description}
                        onChange={handleChange}
                        placeholder={t("jobPost.descriptionPlaceholder")}
                    ></textarea>
                </div>

                {/* Nút Submit */}
                <div style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        className="job-posting-submit-btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? t("jobPost.posting") : t("post_now")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FamilyJobPostingPage;
