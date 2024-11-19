import React from "react";
import { FaHome, FaUser, FaSignInAlt, FaRegRegistered } from "react-icons/fa";
import "./globals.css"; // Upewnij się, że plik CSS jest poprawnie zaimportowany

export const metadata = {
  title: "My App",
  description: "A sample app with a global layout",
};

export default function Layout({ children }) {
  return (
    <html lang="en">
      <body className="flex h-screen">
        {/* Sidebar */}
        <aside className="w-64 bg-gray-800 text-white">
          <nav className="flex flex-col h-full">
            <div className="flex items-center justify-center h-16 border-b border-gray-700">
              <h1 className="text-xl font-bold">My App</h1>
            </div>
            <ul className="flex flex-col mt-4">
              <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                <FaHome className="mr-3" />
                <a href="/" className="flex-grow">
                  Home
                </a>
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                <FaUser className="mr-3" />
                <a href="/protected/user/profile" className="flex-grow">
                  Profile
                </a>
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                <FaSignInAlt className="mr-3" />
                <a href="/public/user/signin" className="flex-grow">
                  Sign In
                </a>
              </li>
              <li className="flex items-center px-4 py-2 hover:bg-gray-700">
                <FaRegRegistered className="mr-3" />
                <a href="/public/user/register" className="flex-grow">
                  Register
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex flex-col flex-grow">
          {/* Top Navbar */}
          <header className="bg-gray-100 shadow">
            <div className="flex items-center justify-between px-6 py-4">
              <h2 className="text-lg font-semibold">Dashboard</h2>
              <div>
                <a
                  href="/public/user/signin"
                  className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                >
                  Log In
                </a>
                <a
                  href="/public/user/register"
                  className="px-4 py-2 ml-2 text-white bg-green-600 rounded hover:bg-green-700"
                >
                  Register
                </a>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-grow p-6 bg-gray-50">{children}</main>

          {/* Footer */}
          <footer className="bg-gray-800 text-white">
            <div className="container px-6 py-4 mx-auto text-center">
              <p>© 2024 My App. All rights reserved.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
