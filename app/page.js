"use client";
import { useEffect, useState } from "react";
import { useAuth } from "./lib/AuthContext";
import Footer from "./components/Footer";
import Link from "next/link";

const App = () => {
	const { user, logout } = useAuth(); // Pobieramy dane użytkownika z kontekstu
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		if (user) {
			setIsLoggedIn(true); // Użytkownik jest zalogowany
		} else {
			setIsLoggedIn(false);
		}
	}, [user]); // Uaktualniamy stan przy zmianie stanu użytkownika

	return (
		<div className="flex flex-col min-h-screen">
			<div className="flex-grow flex flex-col items-center justify-center bg-gray-100 py-10 ">
				<img
					src="https://media.printables.com/media/prints/796066/images/6164601_ae4ebef0-728a-4901-bc69-a4b18e5f64cf_20f0d103-48ce-46d8-9ffd-e1fde8e033a7/tic_tac_toe_v2.png"
					alt="Tic Tac Toe"
					className="w-1/3 mb-8"
				/>

				<h1 className="text-4xl font-bold text-center mb-8">
					Tic Tac Toe Game
				</h1>

				{/* Warunkowe renderowanie przycisków */}
				{!isLoggedIn && (
					<>
						<Link href="/public/user/signin">
							<button className="bg-blue-500 text-white px-6 py-3 rounded-md mb-4 hover:bg-blue-600">
								Zaloguj
								się
							</button>
						</Link>

						<Link href="/public/user/register">
							<button className="bg-green-500 text-white px-6 py-3 rounded-md mb-4 hover:bg-green-600">
								Zarejestruj
								się
							</button>
						</Link>
					</>
				)}

				{/* Jeśli użytkownik jest zalogowany, wyświetl przycisk wylogowania */}
				{isLoggedIn && (
					<button
						onClick={logout}
						className="bg-red-500 text-white px-6 py-3 rounded-md mb-4 hover:bg-red-600"
					>
						Wyloguj się
					</button>
				)}
			</div>

			<Footer />
		</div>
	);
};

export default App;
