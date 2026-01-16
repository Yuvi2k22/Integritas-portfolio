import { Page, PageBody, PageHeader } from '@workspace/ui/components/page';

import { DescribeScreens } from '~/components/organizations/slug/projects/epics/steps/describe-screens';
import { InitialSetupStepper } from '~/components/organizations/slug/projects/epics/steps/initial-setup-stepper';
import { TransitionProvider } from '~/hooks/use-transition-context';

export default async function DescribeScreensPage() {
  return (
    <TransitionProvider>
      <Page className="py-8">
        <PageHeader>
          <InitialSetupStepper />
        </PageHeader>
        <PageBody>
          <DescribeScreens />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
