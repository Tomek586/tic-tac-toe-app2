"use client";

import React from "react";
import { AuthProvider, useAuth } from "./lib/AuthContext";
import "./globals.css";

export default function RootLayout({ children }) {
	return (
		<html lang="en">
			<body>
				<AuthProvider>
					<MainLayout>
						{children}
					</MainLayout>
				</AuthProvider>
			</body>
		</html>
	);
}

function MainLayout({ children }) {
	const { user, logout } = useAuth();

	return (
		<div className="flex flex-col md:flex-row h-screen">
			{/* Sidebar */}
			<aside className="w-full md:w-64 bg-gray-800 text-white flex-shrink-0">
				<nav className="flex flex-col h-full">
					{/* Header */}
					<div className="flex items-center justify-center h-16 border-b border-gray-700">
						<h1 className="text-xl font-bold">
							My App
						</h1>
					</div>

					{/* Navigation Links */}
					<ul className="flex flex-col mt-4 space-y-2 px-2">
						<li>
							<a
								href="/"
								className="block px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition-colors"
							>
								Home
							</a>
						</li>
						{!user && (
							<>
								<li>
									<a
										href="/public/user/signin"
										className="block px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition-colors"
									>
										Sign
										In
									</a>
								</li>
								<li>
									<a
										href="/public/user/register"
										className="block px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition-colors"
									>
										Register
									</a>
								</li>
							</>
						)}
						{user && (
							<>
								<li className="flex items-center px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
									<span className="flex-grow truncate">
										Welcome,{" "}
										{
											user.email
										}
									</span>
									<button
										onClick={
											logout
										}
										className="text-red-500 hover:text-red-600 transition-colors"
									>
										Logout
									</button>
								</li>

								<li>
									<a
										href="/protected/user/profile"
										className="block px-4 py-2 text-white rounded-lg hover:bg-gray-700 transition-colors"
									>
										Profile
									</a>
								</li>
							</>
						)}
					</ul>
				</nav>
			</aside>

			{/* Main Content */}
			<main className="flex-grow p-6 overflow-y-auto bg-gray-100">
				<div className="max-w-7xl mx-auto">
					{children}
				</div>
			</main>
		</div>
	);
}
