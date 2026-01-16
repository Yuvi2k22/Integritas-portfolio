'use client';

import NiceModal from '@ebay/nice-modal-react';
import { PlusIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { useActiveOrganization } from '~/hooks/use-active-organization';
import { UpsertProjectDialog } from './project/upsert-project-dialog';
import { useSessionRecording } from '~/app/posthog-provider';
import { ProfileDto } from '~/types/dtos/profile-dto';

export function ProjectsPageHeader({ profile }: { profile: ProfileDto }) {
  const { name } = useActiveOrganization();
  const { startRecording } = useSessionRecording();

  const handleAddProject = () => {
    startRecording({
      organizationName: name,
      email: profile.email,
      eventName: 'Add Project',
    });
    NiceModal.show(UpsertProjectDialog);
  };
  return (
    <section id="projects-page-header" className="my-8">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-sm md:text-xl">Projects of {name}</h1>
        <Button className="gap-2 text-sm" onClick={handleAddProject}>
          <PlusIcon className="h-4 w-4" />
          Add Project
        </Button>
      </div>
    </section>
  );
}
