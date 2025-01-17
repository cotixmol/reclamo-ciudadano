'use client';

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Import translations for the homepage namespace
import enHomepage from '../../public/locales/en/homepage.json';
import esHomepage from '../../public/locales/es/homepage.json';
import enBottomNavbar from '../../public/locales/en/bottomnavbar.json';
import esBottomNavbar from '../../public/locales/es/bottomnavbar.json';
import enErrorPage from '../../public/locales/en/errorpage.json';
import esErrorPage from '../../public/locales/es/errorpage.json';
import enClaim from '../../public/locales/en/claim.json';
import esClaim from '../../public/locales/es/claim.json';
import enClaimNotFound from '../../public/locales/en/claimnotfound.json';
import esClaimNotFound from '../../public/locales/es/claimnotfound.json';
import enClaimCreationForm from '../../public/locales/en/claimcreationform.json';
import esClaimCreationForm from '../../public/locales/es/claimcreationform.json';

void i18n.use(initReactI18next).init({
  resources: {
    en: {
      homepage: enHomepage,
      bottomnavbar: enBottomNavbar,
      errorpage: enErrorPage,
      claim: enClaim,
      claimnotfound: enClaimNotFound,
      claimcreationform: enClaimCreationForm,
    },
    es: {
      homepage: esHomepage,
      bottomnavbar: esBottomNavbar,
      errorpage: esErrorPage,
      claim: esClaim,
      claimnotfound: esClaimNotFound,
      claimcreationform: esClaimCreationForm,
    },
  },
  lng: 'es',
  fallbackLng: 'en',
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
