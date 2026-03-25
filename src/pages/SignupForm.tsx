import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import VerifyEmailUI from "../components/VerifyEmailUI";
import { XCircle, AlertCircle } from "lucide-react";
import type { UserDataSignUpType } from "../types.ts";
import { addUser } from "../services/userService.ts";

export default function SignupForm() {
  const navigate = useNavigate();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [emailAddress, setEmailAddress] = useState("");
  const [fullname, setFullname] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [pendingVerification, setPendingVerification] =
    useState<boolean>(false);
  const [code, setCode] = useState("");

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    if (!emailAddress || !confirmPassword || !password || !fullname) {
      setError("All fields are required.");
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      setIsLoading(false);
      return;
    }

    try {
      await signUp.create({
        emailAddress,
        password,
        unsafeMetadata: {
          fullname,
        },
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      setIsLoading(false);
      setError("");
      setPendingVerification(true);
    } catch (err: any) {
      if (err.errors?.[0]?.code === "form_identifier_exists") {
        setError("That email address is taken. Please try another.");
      } else if (err.errors?.[0]?.code === "form_param_format_invalid") {
        setError("Email address must be a valid email address.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Email or password is empty");
      } else if (err.errors?.[0]?.code === "form_password_length_too_short") {
        setError("Passwords must be 8 characters or more.");
      } else if (err.errors?.[0]?.code === "form_password_pwned") {
        setError("Please use a different password.");
      }
      setIsLoading(false);
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        const userData: UserDataSignUpType = {
          user_id: signUpAttempt.createdUserId as string,
          fullname: signUpAttempt.unsafeMetadata.fullname as string,
          email: signUpAttempt.emailAddress as string,
        };

        await addUser(userData);

        navigate("/");
        setIsLoading(false);
      } else {
        setIsLoading(false);
        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      if (err.errors?.[0]?.code === "too_many_requests") {
        setError("Too many requests. Please try again in a bit.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Enter a code");
      } else if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("The code is incorrect");
      }
      setIsLoading(false);
    }
  };

  if (pendingVerification) {
    return (
      <VerifyEmailUI
        pendingVerification={pendingVerification}
        isLoading={isLoading}
        error={error}
        setError={setError}
        code={code}
        setCode={setCode}
        onVerifyPress={onVerifyPress}
      />
    );
  }

  return (
    <>
      <div className="min-h-[calc(100vh-64px)] bg-gray-50 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        <div className="mx-auto flex min-h-[calc(100vh-120px)] w-full items-center justify-center">
          <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-8">
            <h1 className="text-center text-2xl font-semibold text-slate-900 sm:text-3xl">
              Sign up
            </h1>

            {error && (
              <div className="my-4 flex items-start justify-between gap-3 rounded-lg bg-red-500 p-3 text-white">
                <div className="flex items-start gap-2">
                  <AlertCircle size={20} className="mt-0.5 shrink-0" />
                  <p className="text-sm sm:text-base">{error}</p>
                </div>
                <button
                  className="shrink-0 cursor-pointer"
                  onClick={() => setError("")}
                  type="button"
                >
                  <XCircle size={20} />
                </button>
              </div>
            )}

            <form className="mt-6">
              <div className="space-y-5 sm:space-y-6">
                <div>
                  <label
                    htmlFor="fullname"
                    className="mb-1.5 block text-sm font-medium text-slate-900"
                  >
                    Fullname
                  </label>
                  <input
                    id="fullname"
                    type="text"
                    placeholder="Enter fullname"
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-medium text-slate-900"
                  >
                    Email
                  </label>
                  <input
                    id="email"
                    type="text"
                    placeholder="Enter email"
                    value={emailAddress}
                    onChange={(e) => setEmailAddress(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="mb-1.5 block text-sm font-medium text-slate-900"
                  >
                    Password
                  </label>
                  <input
                    id="password"
                    type="password"
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-blue-500"
                  />
                </div>

                <div>
                  <label
                    htmlFor="cpassword"
                    className="mb-1.5 block text-sm font-medium text-slate-900"
                  >
                    Confirm Password
                  </label>
                  <input
                    id="cpassword"
                    type="password"
                    placeholder="Enter confirm password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-4 py-3 text-sm outline-blue-500"
                  />
                </div>
              </div>

              <div className="mt-8 sm:mt-10">
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={onSignUpPress}
                  className="w-full rounded-md bg-black px-4 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-neutral-400"
                >
                  {isLoading ? "Loading..." : "Create an account"}
                </button>
              </div>

              <p className="mt-6 text-center text-sm text-slate-600">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-medium text-blue-600 hover:underline"
                >
                  Login here
                </Link>
              </p>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
