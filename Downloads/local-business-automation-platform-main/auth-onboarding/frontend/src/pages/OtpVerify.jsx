import { useState, useContext } from "react";
import API from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useTranslation } from "react-i18next";

export default function OtpVerify({ mobile, setStep }) {
  const { login } = useContext(AuthContext);
  const { t } = useTranslation();
  const [otp, setOtp] = useState("");

  const verify = async () => {
    const res = await API.post("/auth/verify-otp", {
      mobileNumber: mobile,
      otp
    });

    login(res.data.user, res.data.token);
    setStep("lang");
  };

  return (
    <div>
      <input
        placeholder={t("enterOtp")}
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
      />
      <button onClick={verify}>{t("verify")}</button>
    </div>
  );
}
