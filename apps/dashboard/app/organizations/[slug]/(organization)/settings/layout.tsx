import * as React from 'react';
import type { Metadata } from 'next';

import { SidebarInset } from '@workspace/ui/components/sidebar';

import { SettingsSidebar } from '~/components/organizations/slug/settings/settings-sidebar';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Settings')
};

export default function SettingsLayout({
  children
}: React.PropsWithChildren): React.JSX.Element {
  return (
    <>
      <SettingsSidebar />
      <SidebarInset
        id="skip"
        className="size-full lg:[transition:max-width_0.2s_linear] lg:peer-data-[state=collapsed]:max-w-[calc(100svw-var(--sidebar-width-icon))] lg:peer-data-[state=expanded]:max-w-[calc(100svw-var(--sidebar-width))]"
      >
        <div className="flex h-screen flex-row overflow-hidden">
          <div className="size-full">{children}</div>
        </div>
      </SidebarInset>
    </>
  );
}
