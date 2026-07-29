'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';
const STORAGE_KEY = 'crt-portfolio-admin';

interface AdminContextValue {
  isAdmin: boolean;
  login: (password: string) => boolean;
  logout: () => void;
}

const AdminContext = createContext<AdminContextValue | undefined>(undefined);

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined' && sessionStorage.getItem(STORAGE_KEY) === '1') {
        setIsAdmin(true);
      }
    } catch {
      /* ignore */
    }
  }, []);

  const login = (password: string) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdmin(true);
      try {
        sessionStorage.setItem(STORAGE_KEY, '1');
      } catch {
        /* ignore */
      }
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAdmin(false);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
  };

  return <AdminContext.Provider value={{ isAdmin, login, logout }}>{children}</AdminContext.Provider>;
}

export function useAdmin() {
  const ctx = useContext(AdminContext);
  if (!ctx) throw new Error('useAdmin must be used within AdminProvider');
  return ctx;
}
