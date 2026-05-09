import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

i18n.use(initReactI18next).init({
  resources: {
    en: { translation: en },
    ar: { translation: ar },
  },
  lng: "en", // default language
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

// Function to get direction based on language
export const getDirection = () => {
  return i18n.language === "ar" ? "rtl" : "ltr";
};

// Set initial direction
document.documentElement.dir = getDirection();
document.documentElement.lang = i18n.language;

// Listen for language changes
i18n.on("languageChanged", (lng) => {
  document.documentElement.dir = getDirection();
  document.documentElement.lang = lng;
});

export default i18n;
