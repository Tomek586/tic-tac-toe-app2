"use client";

import { useAuth } from "@/app/lib/AuthContext";
import { updateProfile } from "firebase/auth";
import { useState } from "react";
import { db } from "@/app/lib/firebase";
import { doc, setDoc } from "firebase/firestore";

export default function ProfileForm() {
	const { user } = useAuth();
	const [displayName, setDisplayName] = useState(
		user?.displayName || ""
	);
	const [photoURL, setPhotoURL] = useState(user?.photoURL || "");
	const [error, setError] = useState("");

	const onSubmit = async (e) => {
		e.preventDefault();
		try {
			// Zaktualizowanie danych w Firebase Authentication
			await updateProfile(user, {
				displayName,
				photoURL,
			});

			// Zapisanie danych w Firestore
			await setDoc(doc(db, "users", user.uid), {
				displayName,
				photoURL,
			});

			console.log("Profile updated.");
		} catch (err) {
			setError(err.message);
		}
	};

	if (!user) return null;

	return (
		<div className="max-w-3xl mx-auto mt-8 p-6 bg-white shadow-md rounded-lg">
			{/* Wyświetlanie zdjęcia profilowego */}
			<div className="flex justify-center mb-6">
				<img
					src={
						photoURL ||
						"https://www.example.com/default-profile-pic.png"
					} // Możesz podać domyślny URL zdjęcia
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
						placeholder="Wpisz nazwę użytkownika"
						value={displayName}
						onChange={(e) =>
							setDisplayName(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>

				<div>
					<label
						htmlFor="email"
						className="block text-sm font-medium text-gray-700"
					>
						Email
					</label>
					<input
						type="email"
						id="email"
						value={user.email}
						readOnly
						className="mt-2 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
						placeholder="Wpisz URL do zdjęcia profilowego"
						value={photoURL}
						onChange={(e) =>
							setPhotoURL(
								e
									.target
									.value
							)
						}
						className="mt-2 p-3 block w-full border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
					/>
				</div>

				<div className="flex justify-center space-x-4">
					<button
						type="submit"
						className="w-full py-3 px-6 bg-indigo-600 text-white rounded-md shadow hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 sm:w-auto"
					>
						Zaktualizuj profil
					</button>
				</div>
				{error && (
					<p className="text-red-600 text-center">
						{error}
					</p>
				)}
			</form>
		</div>
	);
}
