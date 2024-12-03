"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth"; // Importujemy signOut
import { auth } from "./firebase"; // importujemy auth z firebase.js

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Subskrypcja stanu użytkownika
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      console.log("User state changed:", user); // Console log do sprawdzenia, czy zmienia się stan użytkownika
    });
    return () => unsubscribe();
  }, []);

  const login = (userData) => {
    setUser(userData);
  };

  const logout = async () => {
    try {
      await signOut(auth); // Wylogowanie z Firebase
      setUser(null); // Ustawiamy użytkownika na null
      console.log("User logged out"); // Logowanie, że użytkownik został wylogowany
    } catch (err) {
      console.error("Logout failed", err); // Logowanie błędu, jeśli wystąpi
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
