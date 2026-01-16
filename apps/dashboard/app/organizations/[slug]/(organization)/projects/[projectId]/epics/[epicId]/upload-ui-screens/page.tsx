import { Page, PageBody, PageHeader } from '@workspace/ui/components/page';

import { InitialSetupStepper } from '~/components/organizations/slug/projects/epics/steps/initial-setup-stepper';
import { UploadUIScreens } from '~/components/organizations/slug/projects/epics/steps/upload-ui-screens';
import { TransitionProvider } from '~/hooks/use-transition-context';

export default async function UploadUIScreensPage() {
  return (
    <TransitionProvider>
      <Page className="py-8">
        <PageHeader>
          <InitialSetupStepper />
        </PageHeader>
        <PageBody>
          <UploadUIScreens />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
