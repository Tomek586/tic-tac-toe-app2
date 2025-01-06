"use client";

import { useAuth } from "@/app/lib/AuthContext";
import { updateProfile } from "firebase/auth";
import { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { doc, setDoc, getDoc } from "firebase/firestore";
import Footer from "@/app/components/Footer";
import { useRouter } from "next/navigation"; // Import useRouter

export default function ProfileForm() {
	const { user } = useAuth();
	const router = useRouter(); // Inicjalizacja routera

	const [displayName, setDisplayName] = useState(
		user?.displayName || ""
	);
	const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
	const [street, setStreet] = useState("");
	const [city, setCity] = useState("");
	const [zipCode, setZipCode] = useState("");
	const [totalGames, setTotalGames] = useState(0);
	const [wins, setWins] = useState(0);
	const [losses, setLosses] = useState(0);
	const [draws, setDraws] = useState(0);
	const [error, setError] = useState("");

	// Sprawdzenie, czy użytkownik jest zalogowany
	useEffect(() => {
		if (!user) {
			router.push("/public/user/signin"); // Przekierowanie na stronę logowania
		}
	}, [user, router]);

	useEffect(() => {
		const fetchData = async () => {
			if (user) {
				try {
					// Pobierz dane użytkownika
					const userDoc = await getDoc(
						doc(
							db,
							"users",
							user.uid
						)
					);
					if (userDoc.exists()) {
						const userData =
							userDoc.data();
						setDisplayName(
							userData.displayName ||
								""
						);
						setPhotoURL(
							userData.photoURL ||
								""
						);
						setStreet(
							userData
								.address
								?.street ||
								""
						);
						setCity(
							userData
								.address
								?.city ||
								""
						);
						setZipCode(
							userData
								.address
								?.zipCode ||
								""
						);
					}

					// Pobierz dane o grach użytkownika
					const gamesDoc = await getDoc(
						doc(
							db,
							"games",
							user.uid
						)
					);
					if (gamesDoc.exists()) {
						const gamesData =
							gamesDoc.data();
						setTotalGames(
							gamesData.totalGames ||
								0
						);
						setWins(
							gamesData.wins ||
								0
						);
						setLosses(
							gamesData.losses ||
								0
						);
						setDraws(
							gamesData.draws ||
								0
						);
					}
				} catch (err) {
					console.error(
						"Błąd podczas pobierania danych:",
						err
					);
				}
			}
		};
		fetchData();
	}, [user]);

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			// Zaktualizowanie danych w Firebase Authentication
			await updateProfile(user, {
				displayName,
				photoURL,
			});

			// Zapisanie danych użytkownika w Firestore
			await setDoc(doc(db, "users", user.uid), {
				displayName,
				photoURL,
				address: {
					street,
					city,
					zipCode,
				},
			});

			// Zapisanie danych o grach w Firestore
			await setDoc(doc(db, "games", user.uid), {
				totalGames,
				wins,
				losses,
				draws,
			});

			console.log(
				"Profile and game data updated in Firestore."
			);
		} catch (err) {
			setError(err.message);
		}
	};

	// Zwróć pusty element, gdy użytkownik jest niezalogowany
	if (!user) return null;

	return (
		<div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
			<div className="flex justify-center mb-6">
				<img
					src={
						photoURL ||
						"https://www.example.com/default-profile-pic.png"
					}
					alt="Profile Picture"
					className="w-24 h-24 rounded-full object-cover"
				/>
			</div>

			<h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
				Edytuj profil
			</h2>
			<form onSubmit={onSubmit} className="space-y-4">
				<div>
					<label
						htmlFor="displayName"
						className="block text-sm font-medium text-gray-700"
					>
						Nazwa użytkownika
					</label>
					<input
						type="text"
						id="displayName"
						value={displayName}
						onChange={(e) =>
							setDisplayName(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border rounded-md"
					/>
				</div>
				<div>
					<label
						htmlFor="photoURL"
						className="block text-sm font-medium text-gray-700"
					>
						Adres zdjęcia
						profilowego
					</label>
					<input
						type="url"
						id="photoURL"
						value={photoURL}
						onChange={(e) =>
							setPhotoURL(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border rounded-md"
					/>
				</div>
				<div>
					<label
						htmlFor="street"
						className="block text-sm font-medium text-gray-700"
					>
						Ulica
					</label>
					<input
						type="text"
						id="street"
						value={street}
						onChange={(e) =>
							setStreet(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border rounded-md"
					/>
				</div>
				<div>
					<label
						htmlFor="city"
						className="block text-sm font-medium text-gray-700"
					>
						Miasto
					</label>
					<input
						type="text"
						id="city"
						value={city}
						onChange={(e) =>
							setCity(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border rounded-md"
					/>
				</div>
				<div>
					<label
						htmlFor="zipCode"
						className="block text-sm font-medium text-gray-700"
					>
						Kod pocztowy
					</label>
					<input
						type="text"
						id="zipCode"
						value={zipCode}
						onChange={(e) =>
							setZipCode(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border rounded-md"
					/>
				</div>

				<button
					type="submit"
					className="w-full py-3 px-6 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700"
				>
					Zaktualizuj dane
				</button>
				{error && (
					<p className="text-red-600 text-center">
						{error}
					</p>
				)}
			</form>
			<Footer />
		</div>
	);
}
