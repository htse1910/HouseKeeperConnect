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
      { label: t("post_job"), link: "/family/post-job" },
      { label: t("my_posts"), link: "/family/my-posts" },
      { label: t("find_housekeepers"), link: "/family/find-housekeepers" },
      { label: t("messages"), link: "/family/messages" },
      { label: t("support"), link: "/family/support", dropdown: true },
    ],
    Staff: [
      { label: t("dashboard"), link: "/staff/dashboard" },
      { label: t("users"), link: "/staff/users" },
      { label: t("approval"), link: "/staff/approval", dropdown: true },
      { label: t("analytics"), link: "/staff/analytics" },
      { label: t("management"), link: "/staff/management" },
    ],
    Admin: [
      { label: t("dashboard"), link: "/admin/dashboard" },
      { label: t("users"), link: "/admin/users" },
      { label: t("services"), link: "/admin/services", dropdown: true },
      { label: t("transactions"), link: "/admin/transaction" },
      { label: t("management"), link: "/admin/management" },
    ],
  };
}
