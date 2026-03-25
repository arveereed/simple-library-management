import { Link, useNavigate } from "react-router-dom";
import { useSignIn } from "@clerk/clerk-react";
import { useState } from "react";
import { AlertCircle, XCircle, Eye, EyeOff } from "lucide-react";

export default function LoginForm() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const navigate = useNavigate();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      setIsLoading(true);

      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        navigate("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_password_incorrect") {
        setError("Password is incorrect. Please try again.");
      } else if (err.errors?.[0]?.code === "form_param_format_invalid") {
        setError("Email address must be valid.");
      } else if (err.errors?.[0]?.code === "form_identifier_not_found") {
        setError("Email doesn't exist. Please try again.");
      } else if (
        err.errors?.[0]?.code === "form_param_nil" ||
        err.errors?.[0]?.code === "form_conditional_param_missing"
      ) {
        setError("Email or password is empty.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <h1 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
              Sign in
            </h1>

            {error && (
              <div className="mt-4 flex items-start justify-between gap-3 rounded-lg bg-red-500 p-3 text-white">
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm sm:text-base">{error}</p>
                </div>
                <button
                  type="button"
                  className="shrink-0 cursor-pointer"
                  onClick={() => setError("")}
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}

            <form className="mt-8 space-y-5 sm:mt-10 sm:space-y-6">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Email
                </label>
                <input
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  name="username"
                  type="text"
                  required
                  className="w-full rounded-md border border-slate-300 px-4 py-3 text-sm text-slate-900 outline-blue-600"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-slate-900">
                  Password
                </label>
                <div className="relative flex items-center">
                  <input
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full rounded-md border border-slate-300 px-4 py-3 pr-10 text-sm text-slate-900 outline-blue-600"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-400 hover:text-gray-700"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 shrink-0 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor="remember-me"
                    className="ml-3 block text-sm text-slate-900"
                  >
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <Link
                    to="/forgotpassword"
                    className="font-semibold text-blue-600 hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
              </div>

              <div className="pt-2 sm:pt-4">
                <button
                  disabled={isLoading}
                  onClick={onSignInPress}
                  type="button"
                  className="w-full cursor-pointer rounded-md bg-black px-4 py-3 text-sm font-medium tracking-wide text-white shadow-sm transition hover:bg-neutral-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                  {isLoading ? "Loading..." : "Sign in"}
                </button>
              </div>

              <p className="pt-1 text-center text-sm text-slate-900">
                Don't have an account?
                <Link
                  className="ml-1 font-medium text-blue-600 hover:underline"
                  to="/register"
                >
                  Register here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
