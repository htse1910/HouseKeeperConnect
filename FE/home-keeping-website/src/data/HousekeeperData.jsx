import { t } from "i18next";

export const jobs = [
  { title: t("dashboard_jobs.clean_house"), location: "Quận 7, TP.HCM", hours: 8, date: "20/03/2025", salary: "800K" },
  { title: t("dashboard_jobs.clean_office"), location: "Quận 1, TP.HCM", hours: 6, date: "21/03/2025", salary: "1.2M" }
];

export const schedule = [
  { title: t("dashboard_schedule.clean_house"), time: t("dashboard_schedule.today") + ", 14:00" },
  { title: t("dashboard_schedule.clean_office"), time: t("dashboard_schedule.tomorrow") + ", 08:00" }
];

export const statistics = [
  { label: "dashboard_stats.completed_jobs", value: 24 },
  { label: "dashboard_stats.rating", value: "4.8 ⭐" },
  { label: "dashboard_stats.this_month_income", value: "12.5M đ" }
];

export const paymentDetails = [
  { label: "dashboard_payment.total_income", value: "45.6M đ" },
  { label: "dashboard_payment.pending", value: "2.4M đ" },
  { label: "dashboard_payment.withdrawable", value: "8.2M đ", highlight: true }
];
