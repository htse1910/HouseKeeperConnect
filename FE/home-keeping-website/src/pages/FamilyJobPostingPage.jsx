import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import axios from "axios";
import "../assets/styles/Job.css";
import "../assets/styles/Payment.css";
import { formatDateTime, formatTotalCurrency } from "../utils/formatData";
import API_BASE_URL from "../config/apiConfig"; // adjust path as needed

const FamilyJobPostingPage = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [wallet, setWallet] = useState(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);

    const today = new Date();
    const defaultStart = today.toISOString().split("T")[0];

    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);

    function getDefaultEndDate(startDate, jobType) {
        const start = new Date(startDate);
        const offset = parseInt(jobType) === 2 ? 30 : 7;
        start.setDate(start.getDate() + offset);
        return start.toISOString().split("T")[0];
    }

    const [formData, setFormData] = useState({
        JobName: "",
        JobType: "",
        Location: "",
        Price: "",
        StartDate: defaultStart,
        EndDate: getDefaultEndDate(defaultStart, 1),
        Description: "",
        DayofWeek: [],
        ServiceIDs: [],
        SlotIDs: [],
        IsOffered: false
    });

    const [services, setServices] = useState([]);
    const [family, setFamily] = useState(null);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);

    const authToken = localStorage.getItem("authToken");
    const accountID = localStorage.getItem("accountID");

    const headers = {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
    };

    const hcmDistricts = [
        "Quận 1", "Quận 3", "Quận 4", "Quận 5", "Quận 6", "Quận 7", "Quận 8",
        "Quận 10", "Quận 11", "Quận 12", "Quận Bình Tân", "Quận Bình Thạnh",
        "Quận Gò Vấp", "Quận Phú Nhuận", "Quận Tân Bình", "Quận Tân Phú",
        "Huyện Bình Chánh", "Huyện Cần Giờ", "Huyện Củ Chi", "Huyện Hóc Môn", "Huyện Nhà Bè",
        "Thành phố Thủ Đức"
    ];

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
        { label: "Chưa chọn ngày", value: [] },
        { label: "Hằng ngày", value: [0, 1, 2, 3, 4, 5, 6] },
        { label: "Thứ 2 - Thứ 4 - Thứ 6", value: [1, 3, 5] },
        { label: "Thứ 3 - Thứ 5 - Thứ 7", value: [2, 4, 6] },
        { label: "Cuối tuần", value: [6, 0] },
    ];

    const applyDayPreset = (days) => {
        setFormData((prev) => ({
            ...prev,
            DayofWeek: days,
        }));
    };

    function getValidDaysInRange(start, end) {
        const days = new Set();
        const startDate = new Date(start);
        const endDate = new Date(end);

        while (startDate <= endDate) {
            days.add(startDate.getDay());
            startDate.setDate(startDate.getDate() + 1);
        }

        return Array.from(days);
    }

    const shouldShowLoadingOrError = loading || error;

    useEffect(() => {
        if (!authToken || !accountID) return;

        setLoading(true);

        axios
            .get(`${API_BASE_URL}/Account/GetAccount?id=${accountID}`, { headers })
            .then((res) => {
                const account = res.data;
                if (!account?.accountID) throw new Error(t("error.error_auth"));

                // Lấy danh sách dịch vụ
                axios
                    .get(`${API_BASE_URL}/Service/ServiceList`, { headers })
                    .then((res) => setServices(res.data || []))
                    .catch((err) => {
                        console.error("Không thể tải dịch vụ:", err);
                        setServices([]);
                    });

                // Lấy thông tin Family
                axios
                    .get(`${API_BASE_URL}/Families/GetFamilyByAccountID?id=${accountID}`, { headers })
                    .then((res) => {
                        const fam = res.data || null;
                        setFamily(fam);
                        axios
                            .get(`${API_BASE_URL}/Wallet/getWallet?id=${accountID}`, { headers })
                            .then((res) => setWallet(res.data))
                            .catch((err) => {
                                console.error("Không thể lấy Wallet:", err);
                                setWallet(null);
                            });
                        if (fam?.address) {
                            setFormData((prev) => ({
                                ...prev,
                                Location: prev.Location || fam.address, // chỉ set nếu Location đang rỗng
                            }));
                        }
                    })
                    .catch((err) => console.error("Không thể lấy Family:", err));
            })
            .catch((err) => {
                console.error(t("error.error_loading"), err);
                setServices([]);
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
        } else if (name === "SlotIDs") {
            const slotID = parseInt(value);
            setFormData((prev) => ({
                ...prev,
                SlotIDs: Array.isArray(prev.SlotIDs)
                    ? checked
                        ? [...prev.SlotIDs, slotID]
                        : prev.SlotIDs.filter((id) => id !== slotID)
                    : [slotID], // fallback nếu SlotIDs bị undefined
            }));
        } else if (name === "JobType") {
            setFormData((prev) => ({
                ...prev,
                JobType: value,
                EndDate: getDefaultEndDate(prev.StartDate, value) // cập nhật EndDate
            }));
        } else if (name === "StartDate") {
            const newStart = value;
            const newEnd = getDefaultEndDate(newStart, formData.JobType || 1);

            setFormData((prev) => ({
                ...prev,
                StartDate: newStart,
                EndDate: newEnd
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
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
            return { msg: t("job.jobPost.familyRequired"), ref: null };
        }
        if (!data.JobName.trim()) {
            return { msg: t("job.jobPost.jobTitleRequired"), ref: jobNameRef };
        }
        if (!data.JobType || isNaN(data.JobType)) {
            return { msg: t("job.jobPost.jobTypeRequired"), ref: jobTypeRef };
        }
        if (!data.Location.trim()) {
            return { msg: t("job.jobPost.locationRequired"), ref: locationRef };
        }
        if (!data.StartDate) {
            return { msg: t("job.jobPost.startDateRequired"), ref: startDateRef };
        }
        if (!data.EndDate) {
            return { msg: t("job.jobPost.endDateRequired"), ref: endDateRef };
        }
        if (new Date(data.StartDate) > new Date(data.EndDate)) {
            return { msg: t("job.jobPost.dateInvalid"), ref: startDateRef };
        }
        if (!Array.isArray(data.ServiceIDs) || data.ServiceIDs.length === 0) {
            return { msg: t("job.jobPost.serviceRequired"), ref: serviceRef };
        }
        if (!Array.isArray(data.DayofWeek) || data.DayofWeek.length === 0) {
            return { msg: t("job.jobPost.workingDaysRequired"), ref: dayRef };
        }
        if (!Array.isArray(data.SlotIDs) || data.SlotIDs.length === 0) {
            return { msg: t("job.jobPost.slotRequired"), ref: slotRef };
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage(null);
        setError(null);

        const dataToSubmit = {
            JobName: formData.JobName,
            JobType: parseInt(formData.JobType),
            Location: formData.Location,
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
            const response = await axios.post(
                `${API_BASE_URL}/Job/AddJob`,
                null,
                {
                    headers,
                    params: dataToSubmit,
                    paramsSerializer: {
                        indexes: null
                    }
                }
            );

            console.log("Data Submited", dataToSubmit);
            console.log("Job created:", response.data);
            setMessage(t("job.jobPost.postingSuccess"));
            window.scrollTo({ top: 0, behavior: "smooth" });

            setFormData({
                JobName: "",
                JobType: "",
                Location: "",
                StartDate: defaultStart,
                EndDate: defaultStart,
                Description: "",
                SlotIDs: [],
                DayofWeek: [],
                ServiceIDs: [],
                IsOffered: false,
            });

            // Đóng tất cả <details>
            document.querySelectorAll("details").forEach((d) => {
                d.open = false;
            });

            setPaymentInfo({
                jobID: response?.data?.jobID || null,
                jobName: formData.JobName,
                amount: calculatedPrice,
                fee: calculatedPrice * 0.1,
                housekeeperEarnings: calculatedPrice * 0.9,
                createdAt: new Date().toISOString(),
                currentBalance: wallet?.balance - calculatedPrice,
                topUpNeeded: 0,
            });
            setShowPaymentModal(true);

        } catch (err) {
            console.error("❌ Lỗi khi gọi AddJob:", err);
            const serverMsg =
                err?.response?.data?.message || "Đã xảy ra lỗi khi đăng công việc.";
            setError(`❌ ${serverMsg}`);
        } finally {
            setLoading(false);
        }
    };

    const [calculatedPrice, setCalculatedPrice] = useState(0);
    const platformFee = Math.round(calculatedPrice * 0.1);
    const baseAmount = calculatedPrice - platformFee;

    const calculatePrice = () => {
        if (
            !formData.JobType ||
            !Array.isArray(formData.ServiceIDs) || formData.ServiceIDs.length === 0 ||
            !Array.isArray(formData.SlotIDs) || formData.SlotIDs.length === 0 ||
            !Array.isArray(formData.DayofWeek) || formData.DayofWeek.length === 0 ||
            !formData.StartDate || !formData.EndDate
        ) {
            setCalculatedPrice(0);
            return;
        }

        const selectedPrices = services
            .filter(s => formData.ServiceIDs.includes(s.serviceID))
            .map(s => s.price || 0);

        const pricePerHour = selectedPrices.reduce((a, b) => a + b, 0);
        const slotCount = formData.SlotIDs.length;
        const dayCount = formData.DayofWeek.length;

        const start = new Date(formData.StartDate);
        const end = new Date(formData.EndDate);
        const totalDays = (end - start) / (1000 * 60 * 60 * 24);
        const weeks = Math.ceil(totalDays / 7);

        const totalSlots = slotCount * dayCount * weeks;
        const totalJobPrice = pricePerHour * totalSlots;

        const chargeAmount = parseInt(formData.JobType) === 1
            ? pricePerHour * slotCount * dayCount
            : totalJobPrice;

        setCalculatedPrice(chargeAmount);
    };

    useEffect(() => {
        calculatePrice();
    }, [formData, services]);

    function getMinEndDate(startDate) {
        const start = new Date(startDate);
        start.setDate(start.getDate() + 30);
        return start.toISOString().split("T")[0]; // format yyyy-MM-dd
    }

    if (shouldShowLoadingOrError) {
        return (
            <div className="job-container">
                {loading && (
                    <>
                        <span className="icon-loading"></span>
                        <p>{t("error.loading_data")}</p>
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

    const dateDiffInDays =
        (new Date(formData.EndDate) - new Date(formData.StartDate)) /
        (1000 * 60 * 60 * 24);

    const validDays =
        dateDiffInDays < 7
            ? getValidDaysInRange(formData.StartDate, formData.EndDate)
            : [0, 1, 2, 3, 4, 5, 6];

    return (
        <div className="job-posting-container">
            <h1 className="job-posting-title">{t("navigation.post_job")}</h1>

            {message && <p className="job-posting-alert job-posting-success">{t("job.jobPost.postingSuccess")}</p>}
            {error && <p className="job-posting-alert job-posting-error">{error}</p>}

            <form onSubmit={handleSubmit} className="job-posting-form-grid">

                {/* Tiêu đề & Địa điểm */}
                <div className="job-posting-group">
                    <div className="job-posting-row">
                        <label>{t("job.job_title")}</label>
                        <input
                            ref={jobNameRef}
                            type="text"
                            name="JobName"
                            className="job-posting-input"
                            value={formData.JobName}
                            onChange={handleChange}
                            placeholder={t("job.jobPost.jobTitlePlaceholder")}
                            required
                        />
                    </div>
                    <div className="job-posting-row">
                        <label>{t("job.job_type")}</label>
                        <select
                            ref={jobTypeRef}
                            name="JobType"
                            className="job-posting-input"
                            value={formData.JobType}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t("job.jobPost.jobTypePlaceholder")}</option>
                            <option value="1">{t("job.jobPost.once")}</option>
                            <option value="2">{t("job.jobPost.period")}</option>
                        </select>
                    </div>
                    <div className="job-posting-row">
                        <label>{t("misc.location")}</label>
                        <select
                            ref={locationRef}
                            name="Location"
                            className="job-posting-input"
                            value={formData.Location}
                            onChange={handleChange}
                            required
                        >
                            <option value="">{t("job.jobPost.locationPlaceholder")}</option>
                            {hcmDistricts.map((district) => (
                                <option key={district} value={district}>
                                    {district}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Dịch vụ phân loại theo serviceTypeName */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("job.jobPost.serviceTypeLabel")}</label>
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
                                    <div ref={serviceRef} className="job-posting-service-checkboxes">
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

                {/* Ngày bắt đầu / kết thúc */}
                <div className="job-posting-section">
                    <div className="job-posting-pair">
                        <label>{t("filter.filter.start_date")}</label>
                        <input
                            ref={startDateRef}
                            type="date"
                            name="StartDate"
                            className="job-posting-input"
                            value={formData.StartDate}
                            onChange={handleChange}
                            min={defaultStart}
                            placeholder={t("job.jobPost.startDatePlaceholder")}
                            required
                        />
                    </div>
                    <div className="job-posting-pair">
                        <label>{t("job.jobPost.endDate")}</label>
                        <input
                            ref={endDateRef}
                            type="date"
                            name="EndDate"
                            className="job-posting-input"
                            value={formData.EndDate}
                            onChange={handleChange}
                            min={
                                parseInt(formData.JobType) === 2 && formData.StartDate
                                    ? getMinEndDate(formData.StartDate)
                                    : formData.StartDate || ""
                            }
                            placeholder={t("job.jobPost.endDatePlaceholder")}
                            required
                        />
                    </div>
                </div>

                {/* Ngày làm việc */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("job.jobPost.workingDaysLabel")}</label>
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
                                    disabled={!validDays.includes(d)}
                                />
                                <span
                                    style={!validDays.includes(d) ? { opacity: 0.5, cursor: "not-allowed" } : {}}
                                >
                                    {t(`service.workingDays.${["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"][d]}`)}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Mức lương & thời gian */}
                <div className="job-posting-section">
                    <div className="job-posting-pair">
                        <label>{t("misc.salary")}</label>
                        <div className="job-posting-auto-price">
                            <span>{formatTotalCurrency(calculatedPrice, t)}</span>
                            <p className="job-posting-note">{t("job.jobPost.priceAutoCalculationNote")}</p>

                            <ul className="job-posting-service-detail-list">
                                {/* Dịch vụ */}
                                {services
                                    .filter(s => formData.ServiceIDs.includes(s.serviceID))
                                    .map(s => (
                                        <li key={s.serviceID} className="job-posting-service-detail-item">
                                            <span>{s.serviceName}</span>
                                            <span style={{ float: "right" }}>
                                                {formatTotalCurrency(s.price, t)} / {t("job.jobPost.salaryUnitPerHour")}
                                            </span>
                                        </li>
                                    ))}

                                {/* Tổng lương trước phí */}
                                <li className="job-posting-service-detail-item">
                                    <span>{t("job.jobPost.baseSalary")}</span>
                                    <span style={{ float: "right" }}>{formatTotalCurrency(baseAmount, t)}</span>
                                </li>

                                {/* Phí nền tảng */}
                                <li className="job-posting-service-detail-item">
                                    <span>{t("job.jobPost.platformFee")}</span>
                                    <span style={{ float: "right" }}>{formatTotalCurrency(platformFee, t)}</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="job-posting-section job-posting-section-full">
                        <label>{t("job.jobPost.workingTimeLabel")}</label>
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

                {/* Mô tả */}
                <div className="job-posting-section job-posting-section-full">
                    <label>{t("misc.description")}</label>
                    <textarea
                        name="Description"
                        className="job-posting-textarea"
                        rows="3"
                        value={formData.Description}
                        onChange={handleChange}
                        placeholder={t("job.jobPost.descriptionPlaceholder")}
                    ></textarea>
                </div>

                {/* Nút Submit */}
                <div style={{ textAlign: "center" }}>
                    <button
                        type="submit"
                        className="job-posting-submit-btn btn-primary"
                        disabled={loading}
                    >
                        {loading ? t("job.jobPost.posting") : t("misc.post_now")}
                    </button>
                </div>
            </form>

            {showPaymentModal && paymentInfo && (
                <div className="payment-modal-overlay">
                    <div className="payment-modal-box">
                        <h2 className="payment-modal-title">{t("job.jobPost.success")}</h2>
                        <p className="payment-modal-message">{t("deposit.deposit_return_note_success")}</p>

                        <div className="payment-modal-info">
                            <p><strong>{t("job.job_title")}:</strong> {paymentInfo.jobName || `#${paymentInfo.jobID}`}</p>
                            <p><strong>{t("misc.date")}:</strong> {formatDateTime(paymentInfo.createdAt)}</p>
                            <p><strong>{t("misc.amount")}:</strong> {formatTotalCurrency(paymentInfo.amount, t)}</p>
                            <p><strong>{t("job.jobPost.platformFee")}:</strong> {formatTotalCurrency(paymentInfo.fee, t)}</p>
                            <p><strong>{t("transaction.transactionStatus.payout")}:</strong> {formatTotalCurrency(paymentInfo.housekeeperEarnings, t)}</p>
                            <p className="payment-balance">
                                {t("misc.current_balance")}: {formatTotalCurrency(paymentInfo.currentBalance, t)}
                            </p>
                        </div>

                        <div className="payment-modal-footer">
                            <button className="btn-secondary" onClick={() => setShowPaymentModal(false)}>
                                {t("job.jobPost.cancelBillModel")}
                            </button>
                            <button className="btn-primary" onClick={() => navigate("/family/my-posts")}>
                                {t("job.jobPost.backToManagementPage")}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default FamilyJobPostingPage;
