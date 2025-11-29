// RegisterForm.tsx
import { Link } from "react-router-dom";
import Navbar_ from "../components/Navbar";
import { useEffect, useState } from "react";
import { useSignUp } from "@clerk/clerk-react";
import VerifyEmailUI from "../components/VerifyEmailUI";
import { XCircle, AlertCircle } from "lucide-react"; // optional icons
import { useNavigate } from "react-router-dom";
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

  useEffect(() => {
    console.log(fullname);
  }, [fullname]);

  // Handle submission of sign-up form
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

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress,
        password,
        unsafeMetadata: {
          fullname,
        },
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setIsLoading(false);
      setError("");
      setPendingVerification(true);
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
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
      // console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;
    setIsLoading(true);

    try {
      // Use the code the user provided to attempt verification
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      // If verification was completed, set the session to active
      // and redirect the user
      if (signUpAttempt.status === "complete") {
        await setActive({ session: signUpAttempt.createdSessionId });

        const userData: UserDataSignUpType = {
          user_id: signUpAttempt.createdUserId as string,
          fullname: signUpAttempt.unsafeMetadata.fullname as string,
          email: signUpAttempt.emailAddress as string,
        };
        addUser(userData);

        navigate("/");
        setIsLoading(false);
      } else {
        // If the status is not complete, check why. User may need to
        // complete further steps.
        setIsLoading(false);

        console.error(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err: any) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      if (err.errors?.[0]?.code === "too_many_requests") {
        setError("Too many requests. Please try again in a bit.");
      } else if (err.errors?.[0]?.code === "form_param_nil") {
        setError("Enter a code");
      } else if (err.errors?.[0]?.code === "form_code_incorrect") {
        setError("The code is incorrect");
      }
      setIsLoading(false);

      // console.error(JSON.stringify(err, null, 2));
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
      <Navbar_ />
      <div className="flex min-h-screen flex-col justify-center p-4 bg-gray-50">
        <div className="max-w-md w-full mx-auto border border-gray-300 rounded-2xl p-8 bg-white shadow-sm">
          <h1 className="text-slate-900 text-center text-3xl font-semibold">
            Sign up
          </h1>

          {error && (
            <div className="flex items-center justify-between  bg-red-500 text-white p-3 rounded-lg my-4">
              <div className="flex items-center gap-2">
                <AlertCircle size={20} />
                <p>{error}</p>
              </div>
              <button className="cursor-pointer" onClick={() => setError("")}>
                <XCircle size={20} />
              </button>
            </div>
          )}

          {/* Form */}
          <form>
            <div className="space-y-6">
              {/* Fullname */}
              <div>
                <label
                  htmlFor="fullname"
                  className="text-sm font-medium text-slate-900"
                >
                  Fullname
                </label>
                <input
                  id="fullname"
                  type="text"
                  placeholder="Enter fullname"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                />
              </div>

              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-slate-900"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="text"
                  placeholder="Enter email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  className="border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                />
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-slate-900"
                >
                  Password
                </label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                />
              </div>

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="cpassword"
                  className="text-sm font-medium text-slate-900"
                >
                  Confirm Password
                </label>
                <input
                  id="cpassword"
                  type="password"
                  placeholder="Enter confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="border border-gray-300 w-full text-sm px-4 py-3 rounded-md outline-blue-500"
                />
              </div>
            </div>

            <div className="mt-12">
              <button
                type="button"
                disabled={isLoading}
                onClick={onSignUpPress}
                className="cursor-pointer w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-md disabled:bg-blue-300"
              >
                {isLoading ? "Loading..." : "Create an account"}
              </button>
            </div>

            <p className="text-center text-sm text-slate-600 mt-6">
              Already have an account?{" "}
              <Link
                to="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}
