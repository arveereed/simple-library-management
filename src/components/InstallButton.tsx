import { useEffect, useState } from "react";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function InstallButton() {
  const [promptEvent, setPromptEvent] =
    useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [status, setStatus] = useState("Checking install status...");

  useEffect(() => {
    const checkInstalled = () => {
      const standalone =
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean })
          .standalone === true;

      if (standalone) {
        setIsInstalled(true);
        setStatus("App is installed");
      } else {
        setIsInstalled(false);
        setStatus("App is not installed");
      }
    };

    checkInstalled();

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setPromptEvent(e as BeforeInstallPromptEvent);
      setStatus("Ready to install");
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setPromptEvent(null);
      setStatus("Installation finished");
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    return () => {
      window.removeEventListener(
        "beforeinstallprompt",
        handleBeforeInstallPrompt,
      );
      window.removeEventListener("appinstalled", handleAppInstalled);
    };
  }, []);

  const onInstall = async () => {
    if (!promptEvent) {
      setStatus("Install prompt not available");
      return;
    }

    await promptEvent.prompt();
    const choice = await promptEvent.userChoice;

    if (choice.outcome === "accepted") {
      setStatus("Install accepted, waiting for completion...");
      setPromptEvent(null);
    } else {
      setStatus("Install dismissed");
    }
  };

  return (
    <div className="flex flex-col items-end gap-2">
      <div className="rounded-lg bg-black px-3 py-2 text-sm text-white shadow-lg">
        {status}
      </div>

      {!isInstalled && promptEvent && (
        <button
          onClick={onInstall}
          className="rounded-full bg-blue-600 px-5 py-3 text-white shadow-lg hover:bg-blue-700"
        >
          Install App
        </button>
      )}
    </div>
  );
}
