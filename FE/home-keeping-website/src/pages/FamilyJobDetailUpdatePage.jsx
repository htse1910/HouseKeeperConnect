import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { useParams, useNavigate } from "react-router-dom";
import "../assets/styles/Job.css";

const FamilyJobDetailUpdatePage = () => {
    const { t } = useTranslation();
    const { id: jobID } = useParams();
    const navigate = useNavigate();

    const accountID = localStorage.getItem("accountID");
    const authToken = localStorage.getItem("authToken");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
    };

    const [job, setJob] = useState(null);
    const [services, setServices] = useState([]);

    const today = new Date();
    const defaultStart = today.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    const defaultEnd = nextWeek.toISOString().split("T")[0];

    const [formData, setFormData] = useState({
        JobName: "",
        JobType: "",
        Location: "",
        Price: "",
        StartDate: defaultStart,
        EndDate: defaultEnd,
        Description: "",
        DayofWeek: [],
        ServiceIDs: [],
        SlotIDs: [],
        IsOffered: false
    });

    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    const slotList = [
        { slotID: 1, time: "8:00 - 9:00" },
        { slotID: 2, time: "9:00 - 10:00" },
        { slotID: 3, time: "10:00 - 11:00" },
        { slotID: 4, time: "11:00 - 12:00" },
        { slotID: 5, time: "12:00 - 13:00" },
        { slotID: 6, time: "13:00 - 14:00" },
        { slotID: 7, time: "14:00 - 15:00" },
        { slotID: 8, time: "15:00 - 16:00" },
        { slotID: 9, time: "16:00 - 17:00" },
        { slotID: 10, time: "17:00 - 18:00" },
        { slotID: 11, time: "18:00 - 19:00" },
        { slotID: 12, time: "19:00 - 20:00" },
    ];

    const dayPresets = [
        { label: "Hằng ngày", value: [0, 1, 2, 3, 4, 5, 6] },
        { label: "Thứ 2 - Thứ 4 - Thứ 6", value: [1, 3, 5] },
        { label: "Thứ 3 - Thứ 5 - Thứ 7", value: [2, 4, 6] },
        { label: "Cuối tuần", value: [6, 0] },
    ];

    const applyDayPreset = (days) => {
        setFormData((prev) => ({
            ...prev,
            dayofWeek: days,
        }));
    };

    const shouldShowLoadingOrError = loading || error;

    useEffect(() => {
        if (!authToken || !accountID) return;

        setLoading(true);

        axios
            .get(`http://localhost:5280/api/Account/GetAccount?id=${accountID}`, { headers })
            .then((res) => {
                const account = res.data;
                if (!account?.accountID) throw new Error(t("error_auth"));

                // Lấy danh sách dịch vụ
                axios
                    .get(`http://localhost:5280/api/Service/ServiceList`, { headers })
                    .then((res) => setServices(res.data || []))
                    .catch((err) => {
                        console.error("Không thể tải dịch vụ:", err);
                        setServices([]);
                    });

                // Lấy thông tin Job Detail
                axios
                    .get(`http://localhost:5280/api/Job/GetJobDetailByID?id=${jobID}`, { headers })
                    .then((res) => {
                        const data = res.data;
                        setJob(data);
                        setError(null);

                        // Lưu familyID từ job
                        setFamily({ familyID: data.familyID });

                        // Set lại dữ liệu ban đầu vào form
                        setFormData((prev) => ({
                            ...prev,
                            JobName: data.jobName || "",
                            JobType: data.jobType || "",
                            Location: data.location || "",
                            Price: data.price || "",
                            Description: data.description || "",
                            DayofWeek: data.dayofWeek || [],
                            SlotIDs: data.slotIDs || [],
                            ServiceIDs: data.serviceIDs || [],
                            StartDate: data.startDate?.split("T")[0] || defaultStart,
                            EndDate: data.endDate?.split("T")[0] || defaultEnd,
                        }));
                    })
                    .catch((err) => {
                        console.error("Lỗi khi lấy Job:", err);
                        setError(t("error_loading"));
                    })
            })
            .catch((err) => {
                console.error(t("error_loading"), err);
                setServices([]);
                setFamily([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        if (["DayofWeek", "SlotIDs", "ServiceIDs"].includes(name)) {
            const id = parseInt(value);
            setFormData((prev) => ({
                ...prev,
                [name]: checked
                    ? [...prev[name], id]
                    : prev[name].filter((v) => v !== id),
            }));
        } else if (name === "StartDate" || name === "EndDate") {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value,
            }));
        }
    };

    const jobNameRef = useRef(null);
    const jobTypeRef = useRef(null);
    const locationRef = useRef(null);
    const priceRef = useRef(null);
    const startDateRef = useRef(null);
    const endDateRef = useRef(null);
    const serviceRef = useRef(null);
    const dayRef = useRef(null);
    const slotRef = useRef(null);

    const validateForm = (data) => {
        if (!family?.familyID) {
            return { msg: t("jobPost.familyRequired"), ref: null };
        }
        if (!data.JobName.trim()) {
            return { msg: t("jobPost.jobTitleRequired"), ref: jobNameRef };
        }
        if (!data.JobType || isNaN(data.JobType)) {
            return { msg: t("jobPost.jobTypeRequired"), ref: jobTypeRef };
        }
        if (!data.Location.trim()) {
            return { msg: t("jobPost.locationRequired"), ref: locationRef };
        }
        if (!data.Price || isNaN(data.Price) || data.Price <= 0) {
            return { msg: t("jobPost.salaryInvalid"), ref: priceRef };
        }
        if (!data.StartDate) {
            return { msg: t("jobPost.startDateRequired"), ref: startDateRef };
        }
        if (!data.EndDate) {
            return { msg: t("jobPost.endDateRequired"), ref: endDateRef };
        }
        if (new Date(data.StartDate) > new Date(data.EndDate)) {
            return { msg: t("jobPost.dateInvalid"), ref: startDateRef };
        }
        if (!Array.isArray(data.ServiceIDs) || data.ServiceIDs.length === 0) {
            return { msg: t("jobPost.serviceRequired"), ref: serviceRef };
        }
        if (!Array.isArray(data.DayofWeek) || data.DayofWeek.length === 0) {
            return { msg: t("jobPost.workingDaysRequired"), ref: dayRef };
        }
        if (!Array.isArray(data.SlotIDs) || data.SlotIDs.length === 0) {
            return { msg: t("jobPost.slotRequired"), ref: slotRef };
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const dataToSubmit = {
            JobID: jobID,
            JobName: formData.JobName,
            JobType: parseInt(formData.JobType),
            Location: formData.Location,
            Price: parseFloat(formData.Price),
            StartDate: new Date(formData.StartDate).toISOString(),
            EndDate: new Date(formData.EndDate).toISOString(),
            Description: formData.Description,
            IsOffered: false,
            FamilyID: family?.familyID,
            ServiceIDs: formData.ServiceIDs.map((id) => parseInt(id)),
            SlotIDs: formData.SlotIDs.map((id) => parseInt(id)),
            DayofWeek: formData.DayofWeek.map((d) => parseInt(d)),
        };

        const validationError = validateForm(dataToSubmit);
        if (validationError) {
            setError(validationError.msg);
            if (validationError.ref?.current) {
                validationError.ref.current.focus();
            }
            setLoading(false);
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }

        try {
            const response = await axios.put(
                "http://localhost:5280/api/Job/UpdateJob",
                null,
                {
                    headers,
                    params: dataToSubmit,
                    paramsSerializer: { indexes: null },
                }
            );

            console.log("Data Submited", dataToSubmit);
            console.log("Job created:", response.data);
            setMessage(t("jobPost.updateSuccess"));
            window.scrollTo({ top: 0, behavior: "smooth" });

            setFormData({
                JobName: formData.JobName,
                JobType: parseInt(formData.JobType),
                Location: formData.Location,
                Price: parseFloat(formData.Price),
                StartDate: new Date(formData.StartDate).toISOString(),
                EndDate: new Date(formData.EndDate).toISOString(),
                Description: formData.Description,
                IsOffered: false,
                FamilyID: family?.familyID,
                ServiceIDs: formData.ServiceIDs.map((id) => parseInt(id)),
                SlotIDs: formData.SlotIDs.map((id) => parseInt(id)),
                DayofWeek: formData.DayofWeek.map((d) => parseInt(d)),
            });

            // Đóng tất cả <details>
            document.querySelectorAll("details").forEach((d) => {
                d.open = false;
            });
        } catch (err) {
            console.error("❌ Lỗi khi gọi UpdateJob:", err);
            const serverMsg =
                err?.response?.data?.message || "Đã xảy ra lỗi khi chỉnh sửa công việc.";
            setError(`❌ ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };

    if (shouldShowLoadingOrError) {
        return (
            <div className="job-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("loading_data")}</p>
                    </>
                )}
                {error && (
                    <>
                        <p className="error">❌ {error}</p>
                        <button className="btn-secondary" onClick={() => window.location.search = "?demo=true"}>
                            {t("view_demo")}
                        </button>
                    </>
                )}
            </div>
        );
    }

    return (
        <div className="job-posting-container">
            <h1 className="job-posting-title">{t("update_job")}</h1>

            {message && <p className="job-posting-alert job-posting-success">{t("jobPost.updateSuccess")}</p>}
            {error && <p className="job-posting-alert job-posting-error">{error}</p>}

            <form onSubmit={handleSubmit} className="job-posting-form-grid">
                <div className="job-posting-group">
                    <div className="job-posting-row">
                        <label>{t("job_title")}</label>
                        <input
                            ref={jobNameRef}
                            type="text"
                            name="JobName"
                            className="job-posting-input"
                            value={formData.JobName}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="job-posting-row">
                        <label>{t("job_type")}</label>
                        <select
                            ref={jobTypeRef}
                            name="JobType"
                            className="job-posting-input"
                            value={formData.JobType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t("jobPost.jobTypePlaceholder")}</option>
                            <option value="1">{t("jobPost.fullTime")}</option>
                            <option value="2">{t("jobPost.partTime")}</option>
                        </select>
                    </div>

                    <div className="job-posting-row">
                        <label>{t("location")}</label>
                        <input
                            ref={locationRef}
                            type="text"
                            name="Location"
                            className="job-posting-input"
                            value={formData.Location}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Dịch vụ */}
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
                                <details open>
                                    <summary>{t(`serviceTypeName.${type}`, type)}</summary>
                                    <div ref={serviceRef} className="job-posting-service-checkboxes">
                                        {items.map((service) => (
                                            <label key={service.serviceID} className="job-posting-checkbox-card">
                                                <input
                                                    type="checkbox"
                                                    name="ServiceIDs"
                                                    value={service.serviceID}
                                                    checked={formData.ServiceIDs.includes(service.serviceID)}
                                                    onChange={handleChange}
                                                />
                                                <span>
                                                    {t(`serviceName.${type}.${service.serviceName}`, service.description || service.serviceName)}
                                                </span>
                                            </label>
                                        ))}
                                    </div>
                                </details>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Lịch làm việc */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("jobPost.workingDaysLabel")}</label>
                    <div className="job-posting-day-preset">
                        {dayPresets.map((preset) => (
                            <label key={preset.label} className="job-posting-checkbox-slot">
                                <input
                                    type="checkbox"
                                    checked={JSON.stringify(formData.DayofWeek) === JSON.stringify(preset.value)}
                                    onChange={() => applyDayPreset(preset.value)}
                                />
                                <span>{preset.label}</span>
                            </label>
                        ))}
                    </div>

                    <div ref={dayRef} className="job-posting-day-checkboxes">
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

                <div className="job-posting-section">
                    <div className="job-posting-pair">
                        <label>{t("salary")}</label>
                        <div className="job-posting-price-wrapper">
                            <input
                                ref={priceRef}
                                type="number"
                                name="Price"
                                className="job-posting-input"
                                value={formData.Price}
                                onChange={handleChange}
                                required
                            />
                            <span className="job-posting-vnd-suffix">VNĐ/giờ</span>
                        </div>
                    </div>

                    <div className="job-posting-section job-posting-section-full">
                        <label>{t("jobPost.workingTimeLabel")}</label>
                        <div ref={slotRef} className="job-posting-slot-checkboxes">
                            {slotList.map((slot) => (
                                <label key={slot.slotID} className="job-posting-checkbox-slot">
                                    <input
                                        type="checkbox"
                                        name="SlotIDs"
                                        value={slot.slotID}
                                        checked={formData.SlotIDs.includes(slot.slotID)}
                                        onChange={handleChange}
                                    />
                                    <span>{slot.time}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="job-posting-section">
                    <div className="job-posting-pair">
                        <label>{t("filter.start_date")}</label>
                        <input
                            ref={startDateRef}
                            type="date"
                            name="StartDate"
                            className="job-posting-input"
                            value={formData.StartDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="job-posting-pair">
                        <label>{t("jobPost.endDate")}</label>
                        <input
                            ref={endDateRef}
                            type="date"
                            name="EndDate"
                            className="job-posting-input"
                            value={formData.EndDate}
                            onChange={handleChange}
                            required
                        />
                    </div>
                </div>

                {/* Mô tả và yêu cầu đặc biệt */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("Description")}</label>
                    <textarea
                        name="description"
                        className="job-posting-textarea"
                        rows="3"
                        value={formData.Description}
                        onChange={handleChange}
                    />
                </div>

                <div style={{ textAlign: "center" }}>
                    <button type="submit" className="job-posting-submit-btn btn-primary" disabled={submitting}>
                        {submitting ? t("jobPost.updating") : t("save_changes")}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FamilyJobDetailUpdatePage;
