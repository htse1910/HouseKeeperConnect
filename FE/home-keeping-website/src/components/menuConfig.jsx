import { useTranslation } from "react-i18next";

export function useMenuItems() {
  const { t } = useTranslation();

  return {
    Guest: [
      { label: t("home"), link: "/" },
      { label: t("about"), link: "/about" },
      { label: t("faq"), link: "/faq" },
    ],
    Housekeeper: [
      { label: t("home"), link: "/" },
      { label: t("find_jobs"), link: "/jobs" },
      { label: t("my_jobs"), link: "/my-jobs" },
      { label: t("messages"), link: "/messages" },
      { label: t("support"), link: "/support", dropdown: true },
    ],
    Family: [
      { label: t("home"), link: "/" },
      { label: t("post_job"), link: "/job-posting" },
      { label: t("my_posts"), link: "/my-posts" },
      { label: t("find_housekeepers"), link: "/find-housekeepers" },
      { label: t("messages"), link: "/messages" },
      { label: t("support"), link: "/support", dropdown: true },
    ],
    Admin: [
      { label: t("dashboard"), link: "/dashboard" },
      { label: t("users"), link: "/users" },
      { label: t("approval"), link: "/approval", dropdown: true },
      { label: t("analytics"), link: "/analytics" },
      { label: t("management"), link: "/management" },
    ],
  };
}
