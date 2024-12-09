"use client";
import { useAuth } from "@/app/lib/AuthContext";

const VerifyEmailPage = () => {
	const { user, isEmailVerified } = useAuth();

	if (!user) return <p>Nie jesteś zalogowany.</p>;

	if (isEmailVerified()) {
		return <p>Twój e-mail został zweryfikowany!</p>;
	}

	return (
		<div>
			<p>
				Proszę zweryfikować swój e-mail. Wysłano
				wiadomość na: {user.email}
			</p>
			<p>
				Sprawdź swoją skrzynkę odbiorczą i
				kliknij w link, aby zweryfikować e-mail.
			</p>
		</div>
	);
};

export default VerifyEmailPage;
