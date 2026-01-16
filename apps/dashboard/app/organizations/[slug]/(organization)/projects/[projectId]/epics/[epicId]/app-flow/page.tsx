import { Page, PageBody, PageHeader } from '@workspace/ui/components/page';

import { AppFlow } from '~/components/organizations/slug/projects/epics/steps/app-flow';
import { InitialSetupStepper } from '~/components/organizations/slug/projects/epics/steps/initial-setup-stepper';
import { getProfile } from '~/data/account/get-profile';
import { TransitionProvider } from '~/hooks/use-transition-context';

export default async function AppFlowPage() {
  const [profile] = await Promise.all([getProfile()]);
  return (
    <TransitionProvider>
      <Page className="py-8">
        <PageHeader>
          <InitialSetupStepper />
        </PageHeader>
        <PageBody>
          <AppFlow profile={profile} />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
