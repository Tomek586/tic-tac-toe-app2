import { useAuth } from "@/app/lib/firebase/AuthContext";

export default function UserMenu() {
	const { user } = useAuth();

	return (
		<div>
			{user?.photoURL ? (
				<img
					src={user.photoURL}
					alt="Profilowe"
					style={{
						width: "50px",
						height: "50px",
						borderRadius: "50%",
					}}
				/>
			) : (
				<p>Brak zdjęcia profilowego</p>
			)}
			<p>
				{user?.displayName ||
					"Anonimowy użytkownik"}
			</p>
		</div>
	);
}
