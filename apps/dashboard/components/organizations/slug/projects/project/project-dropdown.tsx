'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import NiceModal from '@ebay/nice-modal-react';
import { ChevronDownIcon, PlusIcon } from 'lucide-react';

import {
  replaceOrgSlug,
  replaceRouteSlugs,
  routes,
  RouteSlugs
} from '@workspace/routes';
import { Button } from '@workspace/ui/components/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@workspace/ui/components/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@workspace/ui/components/popover';

import { fetchProjectsProxy } from '~/actions/projects/fetch-projects-proxy';
import { useActiveProject } from '~/hooks/use-active-project';
import { GetProjectsSortBy } from '~/schemas/projects/get-projects-schema';
import { ProjectDto } from '~/types/dtos/project-dto';
import { SortDirection } from '~/types/sort-direction';
import { UpsertProjectDialog } from './upsert-project-dialog';

export function ProjectDropdown() {
  const params = useParams<{ slug: string }>();
  const activeProject = useActiveProject();
  const [projectDropdownOpen, setProjectDropdownOpen] =
    useState<boolean>(false);
  const [projects, setProjects] = useState<ProjectDto[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const handleCreateProject = () => NiceModal.show(UpsertProjectDialog);

  const fetchProjects = async (query: string = '') => {
    const result = await fetchProjectsProxy({
      pageIndex: 0,
      pageSize: 20,
      sortBy: GetProjectsSortBy.CreatedAt,
      sortDirection: SortDirection.Desc,
      searchQuery: query
    });

    setProjects(result?.data || []);
  };

  // Debounced Fetch for Search Input
  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (projectDropdownOpen) fetchProjects(searchQuery);
    }, 300); // 300ms debounce

    return () => clearTimeout(debounceTimeout);
  }, [projectDropdownOpen, searchQuery]);

  return (
    <Popover
      open={projectDropdownOpen}
      onOpenChange={setProjectDropdownOpen}
    >
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={projectDropdownOpen}
          className="w-[250px] justify-between"
        >
          {activeProject?.name || 'Select a project'}
          <ChevronDownIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[250px] p-0">
        <Command>
          <CommandInput
            placeholder="Search projects..."
            value={searchQuery}
            onValueChange={setSearchQuery}
            aria-label="Search projects"
          />
          <CommandList>
            <CommandEmpty>No projects found.</CommandEmpty>
            <CommandGroup heading="Projects">
              {projects.map((project) => (
                <Link
                  key={project.id}
                  href={replaceRouteSlugs(
                    routes.dashboard.organizations.slug.projects.project.Index,
                    {
                      [RouteSlugs.OrgSlug]: params.slug,
                      [RouteSlugs.ProjectSlug]: project.id
                    }
                  )}
                >
                  <CommandItem className="cursor-pointer">
                    {project.name}
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandGroup className="sticky bottom-0 bg-white">
              <CommandItem
                onSelect={handleCreateProject}
                className="cursor-pointer text-primary"
              >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create New Project
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
