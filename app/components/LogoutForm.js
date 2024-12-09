"use client";

import { signOut } from "firebase/auth";
import { auth } from "@/app/lib/firebase/firebase";
import { useRouter } from "next/navigation";

export default function LogoutForm() {
	const router = useRouter();

	const onSubmit = async () => {
		try {
			await signOut(auth);
			router.push("/");
			console.log("User logged out.");
		} catch (error) {
			console.error("Logout error:", error.message);
		}
	};

	return (
		<form onSubmit={(e) => e.preventDefault()}>
			<button type="button" onClick={onSubmit}>
				Wyloguj
			</button>
		</form>
	);
}
