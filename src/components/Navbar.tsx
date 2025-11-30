import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { useUserContext } from "../contexts/UserContext";
import { Button } from "./Button";

export default function Navbar_() {
  const { user, isLoading } = useUserContext();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      // Redirect to your desired page
      // setUser(null);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  return (
    <nav className="w-full bg-white shadow-md px-6 py-3 flex items-center justify-between">
      {/* LEFT SIDE */}
      <div className="flex items-center gap-4">
        {/* 🔵 SKELETON WHEN LOADING */}
        {isLoading ? (
          <div className="h-5 w-48 bg-gray-300 rounded animate-pulse"></div>
        ) : (
          <Link to="/">
            <p className="text-black text-lg font-semibold">
              {user?.fullname
                ? `Welcome, ${user.fullname}`
                : "Library Management System"}
            </p>
          </Link>
        )}
      </div>

      {/* 🔵 RIGHT SIDE */}
      <div>
        {/* SKELETON WHEN LOADING */}
        {isLoading ? (
          <div className="flex gap-4">
            <div className="h-10 w-20 bg-gray-300 rounded-xl animate-pulse"></div>
            <div className="h-10 w-24 bg-gray-300 rounded-xl animate-pulse"></div>
          </div>
        ) : user ? (
          <button
            disabled={loading}
            onClick={handleSignOut}
            className="disabled:bg-blue-300 cursor-pointer px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-700 transition"
          >
            Logout
          </button>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login">
              <Button className="cursor-pointer px-4 py-2 text-white rounded-xl hover:bg-blue-700 transition">
                Login
              </Button>
            </Link>

            <Link to="/register">
              <button className="cursor-pointer px-4 py-2 bg-gray-200 text-gray-700 rounded-xl hover:bg-gray-300 transition">
                Register
              </button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
