import { useTranslation } from "react-i18next";

function LanguageSwitcher({ setDropdownVisible }) {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    localStorage.setItem("i18nextLng", lng);
    if (setDropdownVisible) setDropdownVisible(false); // Tránh lỗi nếu prop không tồn tại
  };

  return (
    <>
      <button onClick={() => changeLanguage("en")}>English</button>
      <button onClick={() => changeLanguage("vi")}>Tiếng Việt</button>
    </>
  );
}

export default LanguageSwitcher;
