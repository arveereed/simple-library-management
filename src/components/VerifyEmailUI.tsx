import { useRef, useState, useEffect } from "react";
import { XCircle, AlertCircle } from "lucide-react";

type VerifyUIType = {
  pendingVerification: boolean;
  isLoading: boolean;
  error: string | null;
  setError: (msg: string | null) => void;
  code: string;
  setCode: (code: string) => void;
  onVerifyPress: () => void;
};

export default function VerifyEmailUI({
  pendingVerification,
  isLoading,
  error,
  setError,
  code,
  setCode,
  onVerifyPress,
}: VerifyUIType) {
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    setCode(digits.join(""));
  }, [digits, setCode]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);

    if (!pasted) return;

    const newDigits = Array(6)
      .fill("")
      .map((_, i) => pasted[i] || "");

    setDigits(newDigits);

    const nextIndex = Math.min(pasted.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  if (!pendingVerification) return null;

  return (
    <div className="min-h-screen bg-gray-100 px-3 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto flex min-h-[calc(100vh-3rem)] max-w-md items-center justify-center sm:min-h-[calc(100vh-5rem)]">
        <div className="w-full rounded-2xl bg-white p-4 shadow-md sm:p-6 md:p-8">
          <h1 className="text-center text-xl font-bold text-slate-900 sm:text-2xl md:text-3xl">
            Verify your email
          </h1>

          <p className="mt-2 text-center text-sm text-slate-600 sm:text-base">
            Enter the 6-digit code sent to your email.
          </p>

          {error && (
            <div className="mt-4 flex items-start justify-between gap-3 rounded-lg bg-red-500 p-3 text-white">
              <div className="flex min-w-0 items-start gap-2">
                <AlertCircle size={20} className="mt-0.5 shrink-0" />
                <p className="break-words text-sm sm:text-base">{error}</p>
              </div>

              <button
                type="button"
                onClick={() => setError(null)}
                className="shrink-0"
              >
                <XCircle size={20} />
              </button>
            </div>
          )}

          <div className="mt-6 flex flex-wrap justify-center gap-2 sm:gap-3">
            {digits.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                maxLength={1}
                value={digit}
                ref={(el) => {
                  inputRefs.current[index] = el;
                }}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className={`h-12 w-10 rounded-lg border text-center text-base font-semibold sm:h-14 sm:w-12 sm:text-lg md:h-16 md:w-14 md:text-xl ${
                  error ? "border-red-500" : "border-gray-300"
                } focus:outline-none focus:ring-2 focus:ring-blue-600`}
              />
            ))}
          </div>

          <div className="mt-6">
            <button
              type="button"
              onClick={onVerifyPress}
              disabled={isLoading || code.length !== 6}
              className="w-full rounded-lg bg-black px-6 py-3 text-sm font-medium text-white shadow-sm transition hover:bg-neutral-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-neutral-400 sm:py-3.5 sm:text-base"
            >
              {isLoading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
