import { useTranslation } from "react-i18next";

export function useMenuItems() {
  const { t } = useTranslation();

  return {
    Guest: [
      { label: t("navigation.home"), link: "/" },
      { label: t("navigation.about"), link: "/about" },
      { label: t("navigation.faq"), link: "/faq" },
    ],
    Housekeeper: [
      { label: t("navigation.home"), link: "/" },
      { label: t("navigation.find_jobs"), link: "/jobs" },
      { label: t("navigation.my_jobs"), link: "/my-jobs" },
      { label: t("navigation.messages"), link: "/messages" },
      { label: t("navigation.support"), link: "/support", dropdown: true },
    ],
    Family: [
      { label: t("navigation.home"), link: "/" },
      { label: t("navigation.post_job"), link: "/family/post-job" },
      { label: t("navigation.my_posts"), link: "/family/my-posts" },
      { label: t("navigation.find_housekeepers"), link: "/family/find-housekeepers" },
      { label: t("navigation.messages"), link: "/family/messages" },
      { label: t("navigation.support"), link: "/family/support", dropdown: true },
    ],
    Staff: [
      { label: t("navigation.dashboard"), link: "/staff/dashboard" },
      { label: t("navigation.users"), link: "/staff/users" },
      { label: t("navigation.approval"), link: "/staff/approval", dropdown: true },
      { label: t("navigation.analytics"), link: "/staff/analytics" },
      { label: t("navigation.management"), link: "/staff/management" },
    ],
    Admin: [
      { label: t("navigation.dashboard"), link: "/admin/dashboard" },
      { label: t("navigation.users"), link: "/admin/users" },
      { label: t("navigation.services"), link: "/admin/services", dropdown: true },
      { label: t("navigation.transactions"), link: "/admin/transaction" },
      { label: t("navigation.management"), link: "/admin/management" },
    ],
  };
}
