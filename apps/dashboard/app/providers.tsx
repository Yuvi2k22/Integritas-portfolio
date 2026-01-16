'use client';

import * as React from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';

import { TooltipProvider } from '@workspace/ui/components/tooltip';
import { ThemeProvider } from '@workspace/ui/hooks/use-theme';

import { PostHogProvider } from './posthog-provider';
import CrispChat from './crisp-chat';

type ProvidersProps = React.PropsWithChildren & {
  user?: {
    email?: string;
    name?: string;
  };
};

export function Providers({
  children,
  user,
}: ProvidersProps): React.JSX.Element {
  return (
    <PostHogProvider>
      <NuqsAdapter>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <NiceModal.Provider>
              {children}
              <CrispChat user={user} />
            </NiceModal.Provider>
          </TooltipProvider>
        </ThemeProvider>
      </NuqsAdapter>
    </PostHogProvider>
  );
}
