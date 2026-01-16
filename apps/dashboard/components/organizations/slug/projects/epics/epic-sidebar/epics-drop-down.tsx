import { useState, useEffect } from 'react';
import { ChevronDown, Plus, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@workspace/ui/components/dropdown-menu';
import { Button } from '@workspace/ui/components/button';
import { Input } from '@workspace/ui/components/input';
import { Separator } from '@workspace/ui/components/separator';
import { getOrganizationEpicCount } from '~/data/organization/get-organization-epic-details';
import NiceModal from '@ebay/nice-modal-react';
import { UpgradeToProDialog } from '../advanced-tools/common/upgrade-to-pro-dialog';
import { EpicLimitReachedDialog } from '../../project/epic-limit-reached-dialog';
import { UpsertEpicDialog } from '../upsert-epic-dialog';
import { useSessionRecording } from '~/app/posthog-provider';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import { ProfileDto } from '~/types/dtos/profile-dto';
import { EpicDto } from '~/types/dtos/epic-dto';
import { ProjectDto } from '~/types/dtos/project-dto';
import { useActiveEpic } from '~/hooks/use-active-epic';
import { useRouter } from 'next/navigation';
import { toast } from '@workspace/ui/components/sonner';

interface EpicSelectorProps {
  allEpics: EpicDto[];
  profile: ProfileDto;
  activeProject: ProjectDto;
}

export function EpicSelector({
  allEpics,
  profile,
  activeProject,
}: EpicSelectorProps) {
  const [searchEpic, setSearchEpic] = useState('');
  const [debouncedSearchEpic, setDebouncedSearchEpic] = useState('');
  const { startRecording } = useSessionRecording();
  const { name, slug } = useActiveOrganization();
  const activeEpic = useActiveEpic();
  const [selectedEpic, setSelectedEpic] = useState<EpicDto | null>(activeEpic);
  const router = useRouter();

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchEpic(searchEpic);
    }, 500);

    return () => {
      clearTimeout(handler);
    };
  }, [searchEpic]);

  const filteredEpics = allEpics.filter((epic) =>
    epic.name.toLowerCase().includes(debouncedSearchEpic.toLowerCase()),
  );

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

    NiceModal.show(UpsertEpicDialog, { project: activeProject });
  };

  const handleSelectEpic = (epic: EpicDto) => {
    if (epic.id === activeEpic?.id) return;
    const newUrl = `/organizations/${slug}/projects/${activeProject.id}/epics/${epic.id}`;
    router.push(newUrl);
    setSelectedEpic(epic);
    setSearchEpic('');
  };

  function truncate(str: string) {
    const n = 20;
    return str.length > n ? str.substring(0, n) + '...' : str;
  }

  return (
    <div className="px-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-white">
            {selectedEpic ? truncate(selectedEpic.name) : 'Select a Feature'}{' '}
            <ChevronDown className="h-4 w-4 opacity-50" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-[340px] p-2">
          <div className="relative my-2 ">
            <Search className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground " />
            <Input
              className="pl-8 h-8 bg-background"
              placeholder="Search feature..."
              value={searchEpic}
              onChange={(e) => setSearchEpic(e.target.value)}
            />
          </div>
          <Separator className="my-1" />
          <div className="max-h-[300px] overflow-y-auto">
            {filteredEpics.map((epic) => (
              <DropdownMenuItem
                key={epic.id}
                className="py-2 cursor-pointer hover:bg-accent"
                onClick={() => handleSelectEpic(epic)}
              >
                {epic.name}
              </DropdownMenuItem>
            ))}
          </div>
          <Separator className="my-1" />
          <DropdownMenuItem
            className="py-2 cursor-pointer flex items-center gap-2 text-primary"
            onClick={handleCreateEpic}
          >
            <Plus className="h-4 w-4" />
            <span>Create New Feature</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
