import React, { createContext, useContext, useState, useEffect } from 'react';

export type Role = 'student' | 'alumni' | 'faculty' | 'admin';

interface User {
  name: string;
  email: string;
  role: Role;
  avatar?: string;
  college?: string;
  batch?: string;
}

interface AppContextType {
  isDark: boolean;
  toggleTheme: () => void;
  role: Role;
  setRole: (role: Role) => void;
  isLoggedIn: boolean;
  setIsLoggedIn: (v: boolean) => void;
  user: User;
  setUser: (u: User) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (v: boolean) => void;
}

const defaultUser: User = {
  name: 'Arjun Mehta',
  email: 'arjun.mehta@university.edu',
  role: 'student',
  avatar: 'https://images.unsplash.com/photo-1533142215-a17cdfb95243?w=150&h=150&fit=crop',
  college: 'MIT College of Engineering',
  batch: '2024',
};

const AppContext = createContext<AppContextType>({
  isDark: false,
  toggleTheme: () => {},
  role: 'student',
  setRole: () => {},
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: defaultUser,
  setUser: () => {},
  sidebarOpen: true,
  setSidebarOpen: () => {},
});

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState<User>(defaultUser);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <AppContext.Provider value={{
      isDark, toggleTheme,
      role, setRole,
      isLoggedIn, setIsLoggedIn,
      user, setUser,
      sidebarOpen, setSidebarOpen,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  return useContext(AppContext);
}
