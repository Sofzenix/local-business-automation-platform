import { useState } from "react";
import API from "../services/api";
import { useTranslation } from "react-i18next";

export default function BusinessOnboarding() {
  const { t } = useTranslation();
  const [data, setData] = useState({});

  const submit = async () => {
    await API.post("/business/create", data);
    alert("Business Created!");
  };

  return (
    <div>
      <input placeholder={t("businessName")} onChange={(e) => setData({...data, businessName: e.target.value})} />
      <input placeholder={t("businessType")} onChange={(e) => setData({...data, businessType: e.target.value})} />
      <input placeholder={t("location")} onChange={(e) => setData({...data, location: e.target.value})} />
      <button onClick={submit}>{t("submit")}</button>
    </div>
  );
}
