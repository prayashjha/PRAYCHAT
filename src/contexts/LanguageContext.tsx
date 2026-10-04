import React, { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'hi';

interface Translations {
  [key: string]: { en: string; hi: string };
}

const translations: Translations = {
  'app.name': { en: 'PrayChat', hi: 'प्रेचैट' },
  'app.tagline': { en: 'Connect with Faith', hi: 'विश्वास से जुड़ें' },
  'nav.dashboard': { en: 'Dashboard', hi: 'डैशबोर्ड' },
  'nav.users': { en: 'Users', hi: 'उपयोगकर्ता' },
  'nav.reports': { en: 'Reports', hi: 'रिपोर्ट' },
  'nav.groups': { en: 'Groups', hi: 'समूह' },
  'nav.architecture': { en: 'Architecture', hi: 'आर्किटेक्चर' },
  'nav.configuration': { en: 'Configuration', hi: 'कॉन्फ़िगरेशन' },
  'nav.production': { en: 'Production Status', hi: 'उत्पादन स्थिति' },
  'nav.settings': { en: 'Settings', hi: 'सेटिंग्स' },
  'dashboard.title': { en: 'Admin Dashboard', hi: 'एडमिन डैशबोर्ड' },
  'dashboard.overview': { en: 'System Overview', hi: 'सिस्टम अवलोकन' },
  'dashboard.totalUsers': { en: 'Total Users', hi: 'कुल उपयोगकर्ता' },
  'dashboard.activeToday': { en: 'Active Today', hi: 'आज सक्रिय' },
  'dashboard.messagesToday': { en: 'Messages Today', hi: 'आज संदेश' },
  'dashboard.pendingReports': { en: 'Pending Reports', hi: 'लंबित रिपोर्ट' },
  'dashboard.recentActivity': { en: 'Recent Activity', hi: 'हाल की गतिविधि' },
  'dashboard.systemHealth': { en: 'System Health', hi: 'सिस्टम स्वास्थ्य' },
  'dashboard.storageUsed': { en: 'Storage Used', hi: 'स्टोरेज उपयोग' },
  'dashboard.apiCalls': { en: 'API Calls (24h)', hi: 'API कॉल (24h)' },
  'status.connected': { en: 'Connected', hi: 'कनेक्टेड' },
  'status.pending': { en: 'Pending', hi: 'लंबित' },
  'status.active': { en: 'Active', hi: 'सक्रिय' },
  'status.suspended': { en: 'Suspended', hi: 'निलंबित' },
  'status.banned': { en: 'Banned', hi: 'प्रतिबंधित' },
  'action.search': { en: 'Search...', hi: 'खोजें...' },
  'action.view': { en: 'View', hi: 'देखें' },
  'action.edit': { en: 'Edit', hi: 'संपादित करें' },
  'action.delete': { en: 'Delete', hi: 'हटाएं' },
  'action.suspend': { en: 'Suspend', hi: 'निलंबित करें' },
  'action.ban': { en: 'Ban', hi: 'प्रतिबंधित करें' },
  'action.unsuspend': { en: 'Unsuspend', hi: 'निलंबन हटाएं' },
  'action.resolve': { en: 'Resolve', hi: 'हल करें' },
  'theme.light': { en: 'Light', hi: 'लाइट' },
  'theme.dark': { en: 'Dark', hi: 'डार्क' },
  'theme.system': { en: 'System', hi: 'सिस्टम' },
};

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('praychat-lang');
    return (saved as Language) || 'en';
  });

  const t = (key: string): string => {
    return translations[key]?.[language] || key;
  };

  const handleSetLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('praychat-lang', lang);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error('useLanguage must be used within LanguageProvider');
  return context;
}
