import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SystemSettings {
  loginBg: string;
  loginBgMobile: string;
  logoUrl: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  loginBg: 'https://lh3.googleusercontent.com/d/1ABw_8yhOXunSVya9stgdcqtf4N3GfXVG',
  loginBgMobile: 'https://lh3.googleusercontent.com/d/1ABw_8yhOXunSVya9stgdcqtf4N3GfXVG',
  logoUrl: 'https://lh3.googleusercontent.com/d/17mdvylkyJFyYwvbYjllKYj3l6mJzwSWm'
};

export function convertGoogleDriveLink(url: string) {
  if (!url) return '';
  // Handle various Google Drive URL formats
  const driveRegex = /(?:drive\.google\.com\/(?:file\/d\/|open\?id=|uc\?id=)|docs\.google\.com\/file\/d\/)([^\/\?&]+)/;
  const match = url.match(driveRegex);
  if (match && match[1]) {
    return `https://lh3.googleusercontent.com/d/${match[1]}`;
  }
  return url;
}

interface SettingsContextType {
  settings: SystemSettings;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        const loginBg = convertGoogleDriveLink(data.loginBg || DEFAULT_SETTINGS.loginBg);
        const loginBgMobile = convertGoogleDriveLink(data.loginBgMobile || data.loginBg || DEFAULT_SETTINGS.loginBgMobile);
        const logoUrl = convertGoogleDriveLink(data.logoUrl || DEFAULT_SETTINGS.logoUrl);
        
        setSettings({
          loginBg,
          loginBgMobile,
          logoUrl
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching settings:", err);
      setLoading(false);
    });

    return unsub;
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
}
