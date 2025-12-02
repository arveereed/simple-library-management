// NotFound.jsx
import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md text-center">
        <h1 className="text-7xl font-bold text-black mb-4">404</h1>
        <p className="text-gray-600 text-lg mb-6">
          Oops! The page you’re looking for doesn’t exist or has been moved.
        </p>

        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="not found"
          className="w-60 mx-auto mb-6 rounded-xl"
        />

        <Link to="/">
          <Button
            weight="normal"
            className="px-6 py-3 w-full flex items-center justify-center cursor-pointer"
          >
            Return to Home
          </Button>
        </Link>
      </div>

      <p className="mt-6 text-slate-600 text-sm">
        If you think this is a mistake, please contact the developer ~
        fb.me/arvsdev&#129505;.
      </p>
    </div>
  );
}
