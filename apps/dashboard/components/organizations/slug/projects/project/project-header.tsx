'use client';

import { useEffect } from 'react';
import NiceModal from '@ebay/nice-modal-react';
import { PencilIcon, PlusIcon } from 'lucide-react';

import { Button } from '@workspace/ui/components/button';

import { useSessionRecording } from '~/app/posthog-provider';
import { getOrganizationEpicCount } from '~/data/organization/get-organization-epic-details';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { useActiveProject } from '~/hooks/use-active-project';
import { ProfileDto } from '~/types/dtos/profile-dto';
import { UpgradeToProDialog } from '../epics/advanced-tools/common/upgrade-to-pro-dialog';
import { UpsertEpicDialog } from '../epics/upsert-epic-dialog';
import { EpicLimitReachedDialog } from './epic-limit-reached-dialog';
import { ProjectDropdown } from './project-dropdown';
import { UpsertProjectDialog } from './upsert-project-dialog';
import { toast } from '@workspace/ui/components/sonner';

export function ProjectHeader({ profile }: { profile: ProfileDto }) {
  const project = useActiveProject();
  const { startRecording } = useSessionRecording();
  const { name, slug } = useActiveOrganization();

  const handleCreateEpic = async () => {
    const data = await getOrganizationEpicCount();
    if (data?.serverError) {
      toast.error('Failed to create feature. Please try again.');
      return;
    }
    const { organizationTier, epicsCount, members } = data;

    if (organizationTier === 'free' && epicsCount >= 1) {
      return NiceModal.show(UpgradeToProDialog, {
        message: 'create more than one feature',
        organizationName: name,
        email: profile.email,
        organizationSlug: slug,
      });
    }
    startRecording({
      email: profile.email,
      organizationName: name,
      eventName: 'Feature create',
    });

    const maxEpics = members && members > 0 ? members * 5 : 5;
    if (organizationTier === 'pro' && epicsCount >= maxEpics) {
      return NiceModal.show(EpicLimitReachedDialog);
    }

    NiceModal.show(UpsertEpicDialog, { project });
  };

  const handleEditProject = () =>
    NiceModal.show(UpsertProjectDialog, { project });

  useEffect(() => {
    return () => {
      NiceModal.hide(UpsertEpicDialog);
      NiceModal.hide(UpsertEpicDialog);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 mb-8 md:justify-between">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-2">
          <ProjectDropdown />
          <Button
            variant="ghost"
            size="sm"
            onClick={handleEditProject}
            className="w-40"
          >
            <PencilIcon className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Edit Project</span>
          </Button>
        </div>
      </div>

      <Button onClick={handleCreateEpic} className="gap-2">
        <PlusIcon className="w-4 h-4" />
        Create New Feature
      </Button>
    </div>
  );
}
