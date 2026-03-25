import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';

export interface SystemSettings {
  loginBg: string;
  logoUrl: string;
}

const DEFAULT_SETTINGS: SystemSettings = {
  loginBg: 'https://lh3.googleusercontent.com/d/1ABw_8yhOXunSVya9stgdcqtf4N3GfXVG',
  logoUrl: 'https://lh3.googleusercontent.com/d/17mdvylkyJFyYwvbYjllKYj3l6mJzwSWm'
};

export function useSettings() {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, 'settings', 'global'), (docSnap) => {
      if (docSnap.exists()) {
        setSettings({
          ...DEFAULT_SETTINGS,
          ...docSnap.data()
        });
      }
      setLoading(false);
    }, (err) => {
      console.error("Error fetching settings:", err);
      setLoading(false);
    });

    return unsub;
  }, []);

  return { settings, loading };
}
