// import I18n from 'react-native-i18n';

// Import all locales
import en from './en.json';
import ar from './ar.json';

// Should the app fallback to English if user locale doesn't exists
// I18n.fallbacks = true;

// Define the supported translations
// I18n.translations = {
//   en,
//   ar,
// };

//const currentLocale = I18n.currentLocale();

// Is it a RTL language?
// export const isRTL =
//   currentLocale.indexOf('he') === 0 || currentLocale.indexOf('ar') === 0;

// Allow RTL alignment in RTL languages
// ReactNative.I18nManager.allowRTL(isRTL);

// The method we'll use instead of a regular string

const i18n = {
  "en": en,
  "ar": ar
};

//Set State is must to rerender UI for the change layout redux can also be used similarly
export function changeLanguage(lang) {
  // i18n.setLanguage(lang);
  return {
    type: "CHANGE_LANGUAGE",
    payload: {
      LANG_DATA: i18n[lang]
    }
  };
};
[]
export function getLanguage() {
  return {
    type: "GET_LANGUAGE",
    payload: {
      LANG_DATA: i18n
    }
  };
};

