"use client";

import React from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <MainLayout>{children}</MainLayout>
        </AuthProvider>
      </body>
    </html>
  );
}

function MainLayout({ children }) {
  const { user, logout } = useAuth(); // Używamy kontekstu

  return (
    <div className="flex h-screen">
      <aside className="w-64 bg-gray-800 text-white">
        <nav className="flex flex-col h-full">
          <div className="flex items-center justify-center h-16 border-b border-gray-700">
            <h1 className="text-xl font-bold">My App</h1>
          </div>
          <ul className="flex flex-col mt-4">
            <li className="flex items-center px-4 py-2 hover:bg-gray-700">
              <a href="/" className="flex-grow">
                Home
              </a>
            </li>
            {!user && (
              <>
                <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                  <a href="/public/user/signin" className="flex-grow">
                    Sign In
                  </a>
                </li>
                <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                  <a href="/public/user/register" className="flex-grow">
                    Register
                  </a>
                </li>
              </>
            )}
            {user && (
              <>
                <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                  <span className="flex-grow">Welcome, {user.email}</span>
                  <button
                    onClick={logout} // Wywołujemy funkcję logout
                    className="text-red-600 hover:text-red-700"
                  >
                    Logout
                  </button>
                </li>
              </>
            )}
          </ul>
        </nav>
      </aside>
      <main className="flex-grow p-6">{children}</main>
    </div>
  );
}
