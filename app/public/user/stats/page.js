"use client";

import React, { useState, useEffect } from "react";
import { db } from "@/app/lib/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "@/app/lib/AuthContext";
import LoadingSpinner from "@/app/components//LoadingSpinner";
import ErrorMessage from "@/app/components/ErrorMessage";
import Footer from "@/app/components/Footer";

const GamePage = () => {
	const { user } = useAuth();
	const [gameStats, setGameStats] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	// Funkcja pobierania statystyk użytkownika z kolekcji "users"
	const fetchUserStats = async () => {
		try {
			const docRef = doc(db, "users", user.uid);
			const docSnap = await getDoc(docRef);

			if (docSnap.exists()) {
				const userData = docSnap.data();
				if (userData.games) {
					setGameStats(userData.games);
				} else {
					setError(
						"Brak statystyk gier dla tego użytkownika."
					);
				}
			} else {
				setError(
					"Nie znaleziono danych dla tego użytkownika."
				);
			}
		} catch (err) {
			setError(
				"Błąd podczas pobierania danych użytkownika."
			);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		if (user) {
			fetchUserStats();
		}
	}, [user]);

	if (loading) {
		return <LoadingSpinner />;
	}

	if (error) {
		return <ErrorMessage message={error} />;
	}

	return (
		<div className="container mx-auto p-6">
			<h1 className="text-3xl font-bold mb-6">
				Statystyki Gracza
			</h1>

			{/* Statystyki aktualnego użytkownika */}
			{gameStats && (
				<div className="bg-white p-4 rounded shadow-md mb-8">
					<h2 className="text-xl font-semibold mb-4">
						Twoje statystyki
					</h2>
					<table className="min-w-full">
						<thead>
							<tr>
								<th className="px-4 py-2 text-left">
									Statystyka
								</th>
								<th className="px-4 py-2 text-left">
									Wartość
								</th>
							</tr>
						</thead>
						<tbody>
							<tr>
								<td className="px-4 py-2">
									Wygrane
								</td>
								<td className="px-4 py-2">
									{
										gameStats.Wins
									}
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2">
									Przegrane
								</td>
								<td className="px-4 py-2">
									{
										gameStats.Losses
									}
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2">
									Remisy
								</td>
								<td className="px-4 py-2">
									{
										gameStats.Draws
									}
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2">
									Łącznie
									Gier
								</td>
								<td className="px-4 py-2">
									{
										gameStats.TotalGames
									}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			)}
			<Footer />
		</div>
	);
};

export default GamePage;
