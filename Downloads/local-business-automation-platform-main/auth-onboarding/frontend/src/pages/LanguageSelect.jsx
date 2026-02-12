import i18n from "../i18n/i18n";
import API from "../services/api";

export default function LanguageSelect({ setStep }) {
  const selectLang = async (lang) => {
    localStorage.setItem("lang", lang);
    i18n.changeLanguage(lang);
    await API.put("/user/language", { language: lang });
    setStep("business");
  };

  return (
    <div>
      <button onClick={() => selectLang("te")}>తెలుగు</button>
      <button onClick={() => selectLang("en")}>English</button>
    </div>
  );
}
