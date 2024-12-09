"use client";
import { createContext, useContext, useState, useEffect } from "react";
import {
	onAuthStateChanged,
	signOut,
	createUserWithEmailAndPassword,
	sendEmailVerification,
	getAuth,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null);
	const [loading, setLoading] = useState(true);

	// Subskrypcja stanu użytkownika
	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, (user) => {
			setUser(user);
			setLoading(false);
		});
		return () => unsubscribe();
	}, []);

	// Funkcja logowania
	const login = (userData) => {
		setUser(userData);
	};

	// Funkcja rejestracji
	const register = async (email, password) => {
		try {
			const userCredential =
				await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
			const user = userCredential.user;

			// Wysyłamy e-mail weryfikacyjny po rejestracji
			await sendEmailVerification(user);

			return user;
		} catch (error) {
			if (error.code === "auth/email-already-in-use") {
				throw new Error(
					"Ten e-mail jest już zarejestrowany."
				);
			}
			console.error("Registration failed", error);
			throw error;
		}
	};

	// Funkcja wylogowywania
	const logout = async () => {
		try {
			await signOut(auth);
			setUser(null);
		} catch (err) {
			console.error("Logout failed", err);
		}
	};

	// Funkcja sprawdzająca, czy użytkownik zweryfikował swój e-mail
	const isEmailVerified = () => {
		return user ? user.emailVerified : false;
	};

	// Sprawdzamy, czy użytkownik jest zalogowany i czy ma zweryfikowany e-mail
	useEffect(() => {
		if (user && !user.emailVerified) {
			// Jeśli użytkownik nie ma zweryfikowanego emaila, automatycznie wylogowujemy go
			signOut(auth);
			alert("Proszę zweryfikować swój e-mail.");
			window.location.href = "/user/verify"; // Przekierowanie do strony weryfikacji
		}
	}, [user]);

	if (loading) return <p>Ładowanie...</p>;

	return (
		<AuthContext.Provider
			value={{
				user,
				login,
				logout,
				register,
				isEmailVerified,
			}}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	const context = useContext(AuthContext);
	if (!context) {
		throw new Error(
			"useAuth must be used within an AuthProvider"
		);
	}
	return context;
};
