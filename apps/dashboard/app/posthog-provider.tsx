'use client';

import React, {
  createContext,
  Suspense,
  useContext,
  useEffect,
  useMemo,
} from 'react';
import posthog from 'posthog-js';
import { PostHogProvider as PHProvider, usePostHog } from 'posthog-js/react';
import { usePathname, useSearchParams } from 'next/navigation';

type RecordingProps = {
  email?: string;
  organizationName?: string;
  tool?: string;
  eventName?: string;
};

const SessionRecordingContext = createContext<{
  startRecording: (props?: RecordingProps) => void;
  stopRecording: (props?: RecordingProps) => void;
}>({
  startRecording: () => {},
  stopRecording: () => {},
});

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'production') {
      posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY as string, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || 'https://us.i.posthog.com',
        person_profiles: 'identified_only',
        capture_pageview: false,
        disable_session_recording:
          process.env.NEXT_PUBLIC_POSTHOG_DISABLE_SESSION_RECORDING === 'true',
      });
    }
  }, []);

  const sessionRecordingControls = useMemo(() => {
    const isProd = process.env.NODE_ENV === 'production';

    return {
      startRecording: (props?: RecordingProps) => {
        if (!isProd) {
          return;
        }

        const url = typeof window !== 'undefined' ? window.location.href : '';
        const shouldSendUserData = !!props?.email;
        const eventData: Record<string, any> = {
          started_at: new Date().toISOString(),
          page: url,
        };

        if (props?.email) eventData.email = props.email;
        if (props?.organizationName)
          eventData.organizationName = props.organizationName;
        if (props?.tool) eventData.tool = props.tool;

        posthog.capture(props?.eventName || 'manual_session_start', eventData);
        if (
          process.env.NEXT_PUBLIC_POSTHOG_DISABLE_SESSION_RECORDING === 'true'
        )
          posthog.startSessionRecording();

        if (shouldSendUserData && props.email) {
          posthog.identify(props.email);
        }

        if (shouldSendUserData) {
          posthog.people?.set?.({ email: props.email });
        }
      },

      stopRecording: (props?: RecordingProps) => {
        if (!isProd) {
          return;
        }
        if (
          process.env.NEXT_PUBLIC_POSTHOG_DISABLE_SESSION_RECORDING === 'true'
        )
          posthog.stopSessionRecording();
      },
    };
  }, []);

  return (
    <PHProvider client={posthog}>
      <SessionRecordingContext.Provider value={sessionRecordingControls}>
        <SuspendedPostHogPageView />
        {children}
      </SessionRecordingContext.Provider>
    </PHProvider>
  );
}

export function useSessionRecording() {
  return useContext(SessionRecordingContext);
}

// Page view capture for specific auth routes only
function PostHogPageView() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const posthog = usePostHog();

  useEffect(() => {
    if (!pathname || !posthog) return;

    const allowedPaths = ['/auth/sign-up', '/auth/sign-in'];
    if (!allowedPaths.includes(pathname)) {
      const posthogInitial = localStorage.getItem('Posthog-Login');
      if (posthogInitial === 'in-progress') {
        localStorage.removeItem('Posthog-Login');
      }
      return;
    }

    let eventName = '';
    if (pathname === '/auth/sign-up') eventName = 'sign-up';
    if (pathname === '/auth/sign-in') eventName = 'sign-in';

    let url = window.origin + pathname;
    if (searchParams.toString()) {
      url += '?' + searchParams.toString();
    }
    localStorage.setItem('Posthog-Login', 'in-progress');
    posthog.capture(eventName, { page: url, pathname });
  }, [pathname, searchParams, posthog]);

  return null;
}

function SuspendedPostHogPageView() {
  return (
    <Suspense fallback={null}>
      <PostHogPageView />
    </Suspense>
  );
}
