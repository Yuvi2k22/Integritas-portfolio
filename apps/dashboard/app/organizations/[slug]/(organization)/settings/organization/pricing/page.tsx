import Pricing from '~/components/organizations/slug/settings/organization/pricing/price-details';
import { getProfile } from '~/data/account/get-profile';
import { getDedupedBillingDetails } from '~/data/billing/get-billing-details';

export default async function PricingPage() {
  const profile = await getProfile();
  const details = await getDedupedBillingDetails();
  return <Pricing profile={profile} plan={details.plan} />;
}
