import { useEffect, useState } from 'react';

interface CookieBannerProps {
  onNavigate: (path: string) => void;
}

const CONSENT_KEY = 'plainledger_cookie_consent_v1';

export function CookieBanner({ onNavigate }: CookieBannerProps) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(CONSENT_KEY);
      if (!saved) {
        setVisible(true);
      }
    } catch {
      setVisible(false);
    }
  }, []);

  const accept = (choice: 'accepted' | 'essential') => {
    try {
      window.localStorage.setItem(CONSENT_KEY, choice);
    } catch {
      // Ignore storage failures in restricted contexts
    }
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie preference notice"
      className="fixed bottom-0 inset-x-0 z-30 border-t border-[#E5DFD3] bg-[#FFFFFF]/95 backdrop-blur-sm"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-2.5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <p className="text-xs text-[#57534E] leading-snug">
          PlainLedger uses cookies for site preferences and Google AdSense advertising. Read our{' '}
          <a
            href="/privacy-policy"
            onClick={(e) => {
              e.preventDefault();
              onNavigate('/privacy-policy');
            }}
            className="text-[#14532D] underline underline-offset-2"
          >
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => accept('essential')}
            className="px-3 py-1.5 text-xs font-medium text-[#292524] border border-[#E5DFD3] rounded-md hover:bg-[#F3EFE7] whitespace-nowrap"
          >
            Essential Only
          </button>
          <button
            type="button"
            onClick={() => accept('accepted')}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-[#14532D] hover:bg-[#166534] rounded-md whitespace-nowrap"
          >
            Accept Cookies
          </button>
        </div>
      </div>
    </aside>
  );
}
