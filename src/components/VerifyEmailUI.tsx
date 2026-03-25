import { useMemo, useRef, useState, useEffect } from "react";
import { XCircle, AlertCircle } from "lucide-react";

type VerifyUIType = {
  pendingVerification: boolean;
  isLoading: boolean;
  error: string | null;
  setError: (msg: string) => void;
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
  const [digits, setDigits] = useState(Array(6).fill(""));

  const inputRefs = useMemo(
    () => Array.from({ length: 6 }, () => useRef<HTMLInputElement>(null)),
    [],
  );

  useEffect(() => {
    setCode(digits.join(""));
  }, [digits, setCode]);

  const handleChange = (value: string, index: number) => {
    if (!/^[0-9]?$/.test(value)) return;

    const newDigits = [...digits];
    newDigits[index] = value;
    setDigits(newDigits);

    if (value && index < 5) {
      inputRefs[index + 1].current?.focus();
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number,
  ) => {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputRefs[index - 1].current?.focus();
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
    inputRefs[nextIndex].current?.focus();
  };

  if (!pendingVerification) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 py-6 sm:px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-5 shadow-md sm:p-8">
        <h1 className="mb-6 text-center text-xl font-bold sm:text-2xl">
          Verify your email
        </h1>

        {error && (
          <div className="mb-4 flex items-start justify-between gap-3 rounded-lg bg-red-500 p-3 text-white">
            <div className="flex min-w-0 items-start gap-2">
              <AlertCircle size={20} className="mt-0.5 shrink-0" />
              <p className="text-sm sm:text-base wrap-break-word">{error}</p>
            </div>
            <button
              type="button"
              onClick={() => setError("")}
              className="shrink-0"
            >
              <XCircle size={20} />
            </button>
          </div>
        )}

        <div className="mb-6 flex justify-center gap-2 sm:gap-3">
          {digits.map((digit, index) => (
            <input
              key={index}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={1}
              value={digit}
              ref={inputRefs[index]}
              onChange={(e) => handleChange(e.target.value, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className={`h-12 w-10 rounded-lg border text-center text-lg font-semibold sm:h-14 sm:w-12 sm:text-xl
                ${error ? "border-red-500" : "border-gray-300"}
                focus:outline-none focus:ring-2 focus:ring-blue-600`}
            />
          ))}
        </div>

        <div className="mt-4 flex justify-center">
          <button
            onClick={onVerifyPress}
            disabled={isLoading || code.length !== 6}
            className="w-full rounded-lg bg-black px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-neutral-800 hover:shadow-md disabled:cursor-not-allowed disabled:bg-neutral-400 sm:w-auto sm:min-w-40 sm:px-8 sm:text-base"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    </div>
  );
}
