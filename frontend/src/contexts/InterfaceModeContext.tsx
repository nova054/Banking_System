import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface InterfaceModeContextType {
  isAdminMode: boolean;
  toggleMode: () => void;
  setAdminMode: (isAdmin: boolean) => void;
}

const InterfaceModeContext = createContext<InterfaceModeContextType | undefined>(undefined);

export const useInterfaceMode = () => {
  const context = useContext(InterfaceModeContext);
  if (context === undefined) {
    throw new Error('useInterfaceMode must be used within an InterfaceModeProvider');
  }
  return context;
};

interface InterfaceModeProviderProps {
  children: ReactNode;
}

export const InterfaceModeProvider: React.FC<InterfaceModeProviderProps> = ({ children }) => {
  const [isAdminMode, setIsAdminMode] = useState(true);

  // Load saved preference from localStorage
  useEffect(() => {
    const savedMode = localStorage.getItem('interfaceMode');
    if (savedMode !== null) {
      setIsAdminMode(savedMode === 'admin');
    }
  }, []);

  // Save preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('interfaceMode', isAdminMode ? 'admin' : 'user');
  }, [isAdminMode]);

  const toggleMode = () => {
    setIsAdminMode(!isAdminMode);
  };

  const setAdminMode = (isAdmin: boolean) => {
    setIsAdminMode(isAdmin);
  };

  return (
    <InterfaceModeContext.Provider value={{ isAdminMode, toggleMode, setAdminMode }}>
      {children}
    </InterfaceModeContext.Provider>
  );
};
