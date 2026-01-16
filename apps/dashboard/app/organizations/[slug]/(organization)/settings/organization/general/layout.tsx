import * as React from 'react';
import { type Metadata } from 'next';

import { routes } from '@workspace/routes';
import { AnnotatedLayout } from '@workspace/ui/components/annotated';
import {
  Page,
  PageBody,
  PageHeader,
  PagePrimaryBar,
} from '@workspace/ui/components/page';
import { Separator } from '@workspace/ui/components/separator';

import { OrganizationPageTitle } from '~/components/organizations/slug/organization-page-title';
import { createTitle } from '~/lib/formatters';

export const metadata: Metadata = {
  title: createTitle('General'),
};

export type OrganizationGeneralLayoutProps = {
  organizationLogo: React.ReactNode;
  organizationSlug: React.ReactNode;
  organizationDetails: React.ReactNode;
  businessHours: React.ReactNode;
  socialMedia: React.ReactNode;
  dangerZone: React.ReactNode;
};

export default async function OrganizationGeneralLayout({
  organizationLogo,
  organizationSlug,
  organizationDetails,
  businessHours,
  socialMedia,
  dangerZone,
}: OrganizationGeneralLayoutProps): Promise<React.JSX.Element> {
  return (
    <Page>
      <PageHeader>
        <PagePrimaryBar>
          <OrganizationPageTitle
            index={{
              route:
                routes.dashboard.organizations.slug.settings.organization.Index,
              title: 'Organization',
            }}
            title="General"
          />
        </PagePrimaryBar>
      </PageHeader>
      <PageBody>
        <AnnotatedLayout id="organization-general-setting">
          {organizationLogo}
          <Separator />
          {organizationSlug}
          <Separator />
          {organizationDetails}
          <Separator />
          {businessHours}
          <Separator />
          {socialMedia}
          <Separator />
          {dangerZone}
        </AnnotatedLayout>
      </PageBody>
    </Page>
  );
}
