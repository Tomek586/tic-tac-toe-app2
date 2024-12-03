// "use client";

// import Link from "next/link";
// import { useAuth } from "../lib/AuthContext";
// import { auth } from "../lib/firebase"

// export default function Navigation() {
//   const { user } = useAuth();

//   return (
//     <header className="flex justify-between items-center px-6 py-4 bg-gray-800 text-white">
//       <nav>
//         <ul className="flex space-x-4">
//           <li>
//             <Link href="/">Home</Link>
//           </li>
//           {user ? (
//             <>
//               <li>{`Zalogowany jako: ${user.email}`}</li>
//               <li>
//                 <button
//                   onClick={() => auth.signOut()}
//                   className="text-red-500 hover:underline"
//                 >
//                   Wyloguj się
//                 </button>
//               </li>
//             </>
//           ) : (
//             <>
//               <li>
//                 <Link href="/(public)/user/signin">Zaloguj się</Link>
//               </li>
//               <li>
//                 <Link href="/(public)/user/register">Zarejestruj się</Link>
//               </li>
//             </>
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// }
