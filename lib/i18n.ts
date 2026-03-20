import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translation files
import amharicTranslations from './translations/amharic.json';
import oromoTranslations from './translations/afan-oromo.json';

const resources = {
  am: {
    translation: amharicTranslations,
  },
  om: {
    translation: oromoTranslations,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'am', // Default language: Amharic
    fallbackLng: 'am',
    interpolation: {
      escapeValue: false, // React already protects from XSS
    },
  });

export default i18n;
