"use client";
import { useState } from "react";
import { useAuth } from "@/app/lib/AuthContext";
import { useRouter } from "next/navigation";

const RegisterForm = () => {
	const { register } = useAuth();
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [error, setError] = useState("");
	const [isLoading, setIsLoading] = useState(false);

	const validateForm = () => {
		if (!email || !password || !confirmPassword) {
			setError("Wszystkie pola są wymagane.");
			return false;
		}
		if (password.length < 6) {
			setError("Hasło musi mieć co najmniej 6 znaków.");
			return false;
		}
		if (password !== confirmPassword) {
			setError("Hasła muszą się zgadzać.");
			return false;
		}
		return true;
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		setError("");
		setIsLoading(true);

		if (!validateForm()) {
			setIsLoading(false);
			return;
		}

		try {
			await register(email, password);
			router.push("/verify");
		} catch (err) {
			if (
				err.message ===
				"Ten e-mail jest już zarejestrowany."
			) {
				setError(
					"Ten e-mail jest już zarejestrowany. Spróbuj się zalogować."
				);
			} else {
				setError(
					"Coś poszło nie tak. Spróbuj ponownie."
				);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="flex justify-center items-center min-h-screen bg-gray-100">
			<div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
				<h2 className="text-2xl font-semibold text-center mb-6">
					Rejestracja
				</h2>
				<form onSubmit={onSubmit}>
					<div className="mb-4">
						<label
							htmlFor="email"
							className="block text-sm font-medium text-gray-700"
						>
							Email
						</label>
						<input
							id="email"
							type="email"
							className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Wprowadź email"
							value={
								email
							}
							onChange={(
								e
							) =>
								setEmail(
									e
										.target
										.value
								)
							}
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="password"
							className="block text-sm font-medium text-gray-700"
						>
							Hasło
						</label>
						<input
							id="password"
							type="password"
							className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Wprowadź hasło"
							value={
								password
							}
							onChange={(
								e
							) =>
								setPassword(
									e
										.target
										.value
								)
							}
							required
						/>
					</div>

					<div className="mb-4">
						<label
							htmlFor="confirmPassword"
							className="block text-sm font-medium text-gray-700"
						>
							Potwierdź
							hasło
						</label>
						<input
							id="confirmPassword"
							type="password"
							className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
							placeholder="Potwierdź hasło"
							value={
								confirmPassword
							}
							onChange={(
								e
							) =>
								setConfirmPassword(
									e
										.target
										.value
								)
							}
							required
						/>
					</div>

					{error && (
						<p className="text-red-500 text-sm mt-2">
							{error}
						</p>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className={`w-full mt-4 p-3 text-white font-semibold rounded-lg ${
							isLoading
								? "bg-gray-400 cursor-not-allowed"
								: "bg-blue-500 hover:bg-blue-600"
						}`}
					>
						{isLoading
							? "Rejestracja..."
							: "Zarejestruj się"}
					</button>
				</form>
			</div>
		</div>
	);
};

export default RegisterForm;
