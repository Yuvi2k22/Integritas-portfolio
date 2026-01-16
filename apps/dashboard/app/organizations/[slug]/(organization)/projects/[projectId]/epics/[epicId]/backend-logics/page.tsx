import { Page, PageBody, PageHeader } from '@workspace/ui/components/page';
import { BackendLogics } from '~/components/organizations/slug/projects/epics/steps/backend-logics';

import { InitialSetupStepper } from '~/components/organizations/slug/projects/epics/steps/initial-setup-stepper';
import { TransitionProvider } from '~/hooks/use-transition-context';

export default async function BackendLogicsPage() {
  return (
    <TransitionProvider>
      <Page className="py-8">
        <PageHeader>
          <InitialSetupStepper />
        </PageHeader>
        <PageBody id="backend-logics-step">
          <BackendLogics />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
