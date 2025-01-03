"use client";
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/app/lib/firebase";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/lib/AuthContext";

export default function SignInPage() {
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [error, setError] = useState(null);
	const router = useRouter();
	const { login } = useAuth();

	const handleSignIn = async (e) => {
		e.preventDefault();
		setError(null);
		try {
			const userCredential =
				await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
			console.log(
				"Logged in user:",
				userCredential.user
			); // Logowanie użytkownika w konsoli
			login(userCredential.user); // Zaktualizowanie kontekstu z nowym użytkownikiem
			router.push("/"); // Przekierowanie po udanym logowaniu
		} catch (err) {
			setError("Invalid email or password");
			console.error(err);
		}
	};

	return (
		<div className="flex items-center justify-center min-h-screen bg-gray-50">
			<div className="w-full max-w-md p-8 bg-white shadow-md rounded-md">
				<h2 className="mb-6 text-2xl font-bold text-center text-gray-700">
					Sign In
				</h2>
				<form onSubmit={handleSignIn}>
					<div className="mb-4">
						<label className="block mb-2 text-sm font-medium text-gray-600">
							Email
						</label>
						<input
							type="email"
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
						<label className="block mb-2 text-sm font-medium text-gray-600">
							Password
						</label>
						<input
							type="password"
							className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-200"
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
					{error && (
						<p className="mb-4 text-sm text-red-600">
							{error}
						</p>
					)}
					<button
						type="submit"
						className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
					>
						Sign In
					</button>
				</form>
			</div>
		</div>
	);
}
