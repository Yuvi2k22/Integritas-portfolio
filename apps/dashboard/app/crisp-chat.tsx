'use client';

import { useEffect } from 'react';

declare global {
  interface Window {
    $crisp: Array<[string, string, unknown?]>;
    CRISP_WEBSITE_ID: string;
  }
}

type CrispChatProps = {
  user?: {
    email?: string;
    name?: string;
  };
};

export default function CrispChat({ user }: CrispChatProps) {
  useEffect(() => {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = process.env.NEXT_PUBLIC_CRISP_KEY as string;

    const script = document.createElement('script');
    script.src = 'https://client.crisp.chat/l.js';
    script.async = true;
    script.onload = () => {
      if (user?.email) {
        window.$crisp.push(['set', 'user:email', [user.email]]);
      }
      if (user?.name) {
        window.$crisp.push(['set', 'user:nickname', [user.name]]);
      }
    };

    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector(
        'script[src="https://client.crisp.chat/l.js"]',
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [user]);

  return null;
}
