'use client';

import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export default function InstallPWAButton() {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault(); // 자동 표시 막기
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    const promptEvent = deferredPrompt as BeforeInstallPromptEvent;
    await promptEvent.prompt();

    const { outcome } = await promptEvent.userChoice;
    console.log(`사용자 설치 결과: ${outcome}`);

    setDeferredPrompt(null);
    setIsInstallable(false);
  };

  return (
    isInstallable && (
      <button
        onClick={handleInstallClick}
        className='fixed bottom-6 right-6 px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition'
      >
        앱 설치하기
      </button>
    )
  );
}
