import { useState } from "react";
import API from "../services/api";
import { useTranslation } from "react-i18next";

export default function Login({ setStep, setMobile }) {
  const { t } = useTranslation();
  const [mobile, setMobileInput] = useState("");

  const sendOtp = async () => {
    await API.post("/auth/send-otp", { mobileNumber: mobile });
    setMobile(mobile);
    setStep("otp");
  };

  return (
    <div>
      <h2>{t("welcome")}</h2>
      <input
        placeholder={t("mobile")}
        value={mobile}
        onChange={(e) => setMobileInput(e.target.value)}
      />
      <button onClick={sendOtp}>{t("sendOtp")}</button>
    </div>
  );
}
