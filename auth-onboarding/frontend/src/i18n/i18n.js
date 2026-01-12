import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  resources: {
    te: {
      translation: {
        welcome: "స్వాగతం",
        mobile: "మొబైల్ నంబర్",
        sendOtp: "OTP పంపించు",
        enterOtp: "OTP నమోదు చేయండి",
        verify: "వెరిఫై",
        selectLang: "భాషను ఎంచుకోండి",
        businessName: "షాప్ పేరు",
        businessType: "వ్యాపార రకం",
        location: "ప్రాంతం",
        submit: "సేవ్ చేయండి"
      }
    },
    en: {
      translation: {
        welcome: "Welcome",
        mobile: "Mobile Number",
        sendOtp: "Send OTP",
        enterOtp: "Enter OTP",
        verify: "Verify",
        selectLang: "Select Language",
        businessName: "Business Name",
        businessType: "Business Type",
        location: "Location",
        submit: "Submit"
      }
    }
  },
  lng: localStorage.getItem("lang") || "te",
  fallbackLng: "te"
});

export default i18n;
