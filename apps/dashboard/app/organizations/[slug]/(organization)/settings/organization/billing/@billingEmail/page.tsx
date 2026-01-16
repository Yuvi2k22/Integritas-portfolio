import * as React from 'react';

import { BillingEmailCard } from '~/components/organizations/slug/settings/organization/billing/billing-email-card';
import { getProfile } from '~/data/account/get-profile';
import { getDedupedBillingDetails } from '~/data/billing/get-billing-details';

export default async function BillingEmailPage(): Promise<React.JSX.Element> {
  const overview = await getDedupedBillingDetails();
  const profile = await getProfile();
  return <BillingEmailCard email={overview.email} profile={profile} />;
}
