export const formatDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "";
  const dd = String(date.getDate()).padStart(2, "0");
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const yyyy = date.getFullYear();
  const hh = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
};

// Định dạng số tiền tổng cộng (ví dụ: 500.000 VNĐ)
export const formatTotalCurrency = (amount, t) => {
  if (amount == null) return "";
  return amount.toLocaleString("vi-VN") + " VNĐ";
};

// Định dạng số tiền theo giờ (ví dụ: 50.000 VNĐ / giờ)
export const formatHourlyCurrency = (amount, t) => {
  if (amount == null) return "";
  return amount.toLocaleString("vi-VN") + " " + t("job.jobPost.salaryUnit"); // "VNĐ / giờ"
};

export const formatDateDaysAgo = (dateString, t) => {
  const days = Math.floor((Date.now() - new Date(dateString)) / 86400000);
  return t("job.job.posted_days_ago", { days });
};

export const formatVerificationStatus = (status, t) => {
  const statusStr = String(status).toLowerCase();
  switch (statusStr) {
    case "pending":
    case "1":
      return t("verification.status.pending");
    case "approved":
    case "2":
      return t("verification.status.approved");
    case "rejected":
    case "3":
      return t("verification.status.rejected");
    default:
      return t("status.statusType.status_unknown");
  }
};

export const formatPhone = (phone, t) => {
  if (!phone) return t("user.phone") + ": " + t("misc.no_description");
  return phone;
};

export const formatWorkTypeClass = (type) => {
  if (!type) return "";
  return type.toLowerCase().replace(/[^a-z]/g, "");
};

export const formatWorkTypeLabel = (type, t) => {
  if (!type) return "";
  const normalized = type.toLowerCase();
  if (normalized === "once") return t("job.jobPost.once");
  if (normalized === "period") return t("job.jobPost.period");
  return t("job.jobPost.jobTypePlaceholder");
};

export const formatSkillName = (skill, t) => {
  if (!skill) return "";
  return t(`service.serviceTypeName.${skill}`, { defaultValue: skill });
};

export const formatGender = (gender, t) => {
  switch (Number(gender)) {
    case 1:
      return t("user.male");
    case 2:
      return t("user.female");
    case 3:
      return t("user.other");
    default:
      return "";
  }
};

export const renderWorkingTime = (workingDays, slotIDs, t) => {
  if (!Array.isArray(workingDays) || !Array.isArray(slotIDs)) return t("job.jobDetail.noSchedule");

  const weekdays = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
  const dayLabels = workingDays
    .sort((a, b) => a - b)
    .map(day => t(`service.workingDays.${weekdays[day]}`));

  const isEveryDay = workingDays.length === 7;
  const isWeekend = workingDays.length === 2 && workingDays.includes(0) && workingDays.includes(6);
  const isMonWedFri = arraysEqual(workingDays, [1, 3, 5]);
  const isTueThuSat = arraysEqual(workingDays, [2, 4, 6]);

  let dayStr = "";
  if (isEveryDay) {
    dayStr = t("job.jobDetail.everyDay");
  } else if (isWeekend) {
    dayStr = t("job.jobDetail.weekendSchedule");
  } else if (isMonWedFri || isTueThuSat) {
    dayStr = t("job.jobDetail.workingOnPreset", {
      preset: dayLabels.join(", ")
    });
  } else {
    dayStr = t("job.jobDetail.listSchedule", {
      days: dayLabels.join(", ")
    });
  }

  const hasSlot = (id) => slotIDs.includes(id);
  const isLunchBreak1 = hasSlot(3) && !hasSlot(4);
  const isLunchBreak2 = hasSlot(4) && !hasSlot(3);
  const isSplitShift = hasSlot(3) && hasSlot(6);
  const isFullDay = slotIDs.length >= 8;
  const isHalfDay = arraysEqual(slotIDs, [1, 2, 3, 6, 7, 8]);

  let timeStr = "";
  if (isLunchBreak1) {
    timeStr = t("job.jobDetail.lunchBreak", { start: "11:00", end: "12:00" });
  } else if (isLunchBreak2) {
    timeStr = t("job.jobDetail.lunchBreak", { start: "12:00", end: "13:00" });
  } else if (isSplitShift) {
    timeStr = t("job.jobDetail.splitTime", { blocks: "8:00–11:00, 13:00–16:00" });
  } else if (isHalfDay) {
    timeStr = t("job.jobDetail.splitTime", { blocks: "8:00–11:00, 13:00–16:00" });
  } else {
    timeStr = t("job.jobDetail.fullTime", { start: "8:00", end: "20:00" });
  }

  return `${dayStr}\n${timeStr}`;
};

const arraysEqual = (a = [], b = []) => {
  return a.length === b.length && a.every((val, index) => val === b[index]);
};

export const getTransactionFormatData = (status, type, t) => {
  const statusLabelMap = {
    1: "pending",
    2: "completed",
    3: "expired",
    4: "cancelled"
  };

  const typeLabelMap = {
    1: "deposit",
    2: "withdrawal",
    3: "payment",
    4: "payout"
  };

  const statusClassMap = {
    1: "status-pending",
    2: "status-approved",
    3: "status-expired",
    4: "status-cancelled"
  };

  return {
    statusLabel: t(`status.transactionStatus.${statusLabelMap[status] || "unknown"}`),
    statusClass: statusClassMap[status] || "status-unknown",
    typeLabel: t(`status.transactionStatus.${typeLabelMap[type] || "unknown"}`)
  };
};
