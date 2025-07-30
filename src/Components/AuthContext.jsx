// src/Context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  
  useEffect(() => {
    const savedUser = localStorage.getItem('travelJournalUser');
    if (savedUser) {
      setCurrentUser(savedUser);
    }
  }, []);

  const signIn = (username) => {
    setCurrentUser(username);
    localStorage.setItem('travelJournalUser', username);
  };
  
  const signOut = () => {
    setCurrentUser(null);
    localStorage.removeItem('travelJournalUser');
  };
  
  return (
    <AuthContext.Provider value={{ currentUser, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}