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
      { label: t("navigation.home"), link: "/housekeeper/dashboard" },
      { label: t("navigation.find_jobs"), link: "/jobs" },
      { label: t("navigation.my_jobs"), link: "/my-jobs" },
      { label: t("navigation.messages"), link: "/messages" },
      { label: t("navigation.support"), link: "/housekeeper/support-requests", dropdown: true },
    ],
    Family: [
      { label: t("navigation.home"), link: "/family/dashboard" },
      { label: t("navigation.post_job"), link: "/family/post-job" },
      { label: t("navigation.my_posts"), link: "/family/my-posts" },
      { label: t("navigation.find_housekeepers"), link: "/family/find-housekeepers" },
      { label: t("navigation.messages"), link: "/messages" },
      { label: t("navigation.support"), link: "/family/support", dropdown: true },
    ],
    Staff: [
      { label: t("navigation.dashboard"), link: "/staff-dashboard" },
      { label: t("navigation.users"), link: "/dashboard/users" },
      { label: t("navigation.jobs"), link: "/dashboard/jobs", dropdown: true },
      { label: t("navigation.payouts"), link: "/dashboard/payouts" },
      { label: t("navigation.withdrawals"), link: "/dashboard/withdrawals" },
      { label: t("navigation.support"), link: "/dashboard/support", dropdown: true },
    ],
    Admin: [
      { label: t("navigation.dashboard"), link: "/admin/dashboard" },
      { label: t("navigation.users"), link: "/admin/users" },
      { label: t("navigation.services"), link: "/admin/services", dropdown: true },
      //{ label: t("navigation.transactions"), link: "/family/transactions" },
      //{ label: t("navigation.management"), link: "/admin/management" },
    ],
  };
}
