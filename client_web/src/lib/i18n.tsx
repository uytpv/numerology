'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import vi from '../messages/vi.json';
import en from '../messages/en.json';
import fi from '../messages/fi.json';

type Locale = 'vi' | 'en' | 'fi';

const translations: Record<Locale, any> = { vi, en, fi };

interface LanguageContextProps {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (keyPath: string) => string;
}

const LanguageContext = createContext<LanguageContextProps | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>('vi');

  useEffect(() => {
    // Tự động khôi phục ngôn ngữ đã lưu từ localStorage hoặc lấy ngôn ngữ trình duyệt
    const savedLocale = localStorage.getItem('app_locale') as Locale;
    if (savedLocale && ['vi', 'en', 'fi'].includes(savedLocale)) {
      setLocaleState(savedLocale);
    } else {
      const browserLang = navigator.language.split('-')[0];
      if (browserLang === 'fi') setLocaleState('fi');
      else if (browserLang === 'vi') setLocaleState('vi');
      else setLocaleState('en');
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem('app_locale', newLocale);
  };

  const t = (keyPath: string): string => {
    const keys = keyPath.split('.');
    let current = translations[locale];

    for (const key of keys) {
      if (current && current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback sang tiếng Anh nếu không tìm thấy key dịch tương ứng
        let fallback = translations['en'];
        for (const fKey of keys) {
          if (fallback && fallback[fKey] !== undefined) {
            fallback = fallback[fKey];
          } else {
            return keyPath; // Trả về chính keyPath nếu thất bại hoàn toàn
          }
        }
        return fallback;
      }
    }

    return typeof current === 'string' ? current : keyPath;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation phải được bọc trong một LanguageProvider');
  }
  return context;
};
