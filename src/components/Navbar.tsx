import { Link } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import { useState } from "react";
import { Menu } from "lucide-react";
import { useUserContext } from "../contexts/UserContext";
import { Button } from "./Button";

interface NavbarProps {
  onMenuClick?: () => void;
}

export default function Navbar_({ onMenuClick }: NavbarProps) {
  const { user, isLoading } = useUserContext();
  const { signOut } = useClerk();

  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
    } catch (err) {
      console.error(JSON.stringify(err, null, 2));
    } finally {
      setLoading(false);
    }
  };

  return (
    <nav className="w-full bg-white shadow-md px-4 sm:px-6 py-3">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3">
        {/* LEFT SIDE */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden cursor-pointer p-2 rounded-md hover:bg-gray-100 transition"
            aria-label="Open sidebar"
          >
            <Menu className="w-6 h-6 text-black" />
          </button>

          {isLoading ? (
            <div className="h-5 w-40 sm:w-48 bg-gray-300 rounded animate-pulse"></div>
          ) : (
            <Link to="/" className="block min-w-0">
              <p className="truncate text-base sm:text-lg font-semibold text-black">
                {user?.fullname
                  ? `Welcome, ${user.fullname}`
                  : "Library Management System"}
              </p>
            </Link>
          )}
        </div>

        {/* RIGHT SIDE */}
        <div className="flex justify-end">
          {isLoading ? (
            <div className="flex gap-3">
              <div className="h-10 w-20 bg-gray-300 rounded-xl animate-pulse"></div>
              <div className="h-10 w-24 bg-gray-300 rounded-xl animate-pulse"></div>
            </div>
          ) : user ? (
            <Button
              weight="normal"
              disabled={loading}
              onClick={handleSignOut}
              className="w-full sm:w-auto cursor-pointer px-4 py-2"
            >
              {loading ? "Logging out..." : "Logout"}
            </Button>
          ) : (
            <div className="flex items-center gap-2 sm:gap-4">
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
      </div>
    </nav>
  );
}
