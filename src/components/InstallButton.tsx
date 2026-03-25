import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [status, setStatus] = useState("waiting for install prompt...");

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setStatus("install prompt available");
      console.log("beforeinstallprompt fired");
    };

    window.addEventListener("beforeinstallprompt", handler);

    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
    };
  }, []);

  const onInstall = async () => {
    if (!promptEvent) {
      alert("Install prompt not available yet");
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;
    setStatus(`user choice: ${choice.outcome}`);
    setPromptEvent(null);
  };

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-2">
      <div className="rounded bg-black px-3 py-2 text-xs text-white shadow">
        {status}
      </div>

      <button
        onClick={onInstall}
        className="rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg hover:bg-blue-700"
      >
        Install App
      </button>
    </div>
  );
}
