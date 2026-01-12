import { useState } from "react";
import "./i18n/i18n";
import Login from "./pages/Login";
import OtpVerify from "./pages/OtpVerify";
import LanguageSelect from "./pages/LanguageSelect";
import BusinessOnboarding from "./pages/BusinessOnboarding";

function App() {
  const [step, setStep] = useState("login");
  const [mobile, setMobile] = useState("");

  if (step === "login") return <Login setStep={setStep} setMobile={setMobile} />;
  if (step === "otp") return <OtpVerify mobile={mobile} setStep={setStep} />;
  if (step === "lang") return <LanguageSelect setStep={setStep} />;
  return <BusinessOnboarding />;
}

export default App;
