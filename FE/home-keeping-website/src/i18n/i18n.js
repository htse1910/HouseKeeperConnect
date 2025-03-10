import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import enTranslation from "./en.json"; // Import trực tiếp file JSON
import viTranslation from "./vi.json";

i18n
  .use(initReactI18next) // Kết nối với React
  .init({
    resources: {
      en: { translation: enTranslation },
      vi: { translation: viTranslation },
    },
    lng: localStorage.getItem("i18nextLng") || "vi", // Ngôn ngữ mặc định
    fallbackLng: "vi",
    debug: true, // Hiện log để kiểm tra
    interpolation: {
      escapeValue: false, // Không cần escape HTML
    },
  });

export default i18n;
