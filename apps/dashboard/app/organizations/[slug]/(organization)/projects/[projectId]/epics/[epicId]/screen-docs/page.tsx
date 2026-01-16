import { Page, PageBody, PageHeader } from '@workspace/ui/components/page';

import { InitialSetupStepper } from '~/components/organizations/slug/projects/epics/steps/initial-setup-stepper';
import { ScreenDocs } from '~/components/organizations/slug/projects/epics/steps/screen-docs/screen-docs';
import { TransitionProvider } from '~/hooks/use-transition-context';

export default async function ScreenDocsPage() {
  return (
    <TransitionProvider>
      <Page className="py-8 overflow-hidden">
        <PageHeader>
          <InitialSetupStepper />
        </PageHeader>
        <PageBody
          disableScroll
          className="flex-1 overflow-hidden"
        >
          <ScreenDocs />
        </PageBody>
      </Page>
    </TransitionProvider>
  );
}
