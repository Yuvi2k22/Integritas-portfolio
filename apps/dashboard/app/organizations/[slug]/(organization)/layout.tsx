import * as React from 'react';
import type { Metadata } from 'next';
import { cookies } from 'next/headers';

import { getAuthOrganizationContext } from '@workspace/auth/context';

import { Providers } from '~/components/organizations/providers';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('Organization')
};

export default async function OrganizationLayout(
  props: NextPageProps & React.PropsWithChildren
): Promise<React.JSX.Element | any> {
  const ctx = await getAuthOrganizationContext();
  const cookieStore = await cookies();

  return (
    <div className="flex flex-col size-full overflow-hidden">
      <Providers
        organization={ctx.organization}
        defaultOpen={
          (cookieStore.get('sidebar:state')?.value ?? 'true') === 'true'
        }
        defaultWidth={cookieStore.get('sidebar:width')?.value}
      >
        {props.children}
      </Providers>
    </div>
  );
}
