'use client';

import * as React from 'react';
import { useParams, usePathname } from 'next/navigation';

import {
  baseUrl,
  getPathname,
  replaceRouteSlugs,
  routes,
  RouteSlugs
} from '@workspace/routes';

import { AppSidebar } from '~/components/organizations/slug/app-sidebar';
import { SettingsSidebar } from '~/components/organizations/slug/settings/settings-sidebar';
import { useActiveOrganization } from '~/hooks/use-active-organization';
import type { FavoriteDto } from '~/types/dtos/favorite-dto';
import type { OrganizationDto } from '~/types/dtos/organization-dto';
import type { ProfileDto } from '~/types/dtos/profile-dto';

export type SidebarRendererProps = {
  organizations: OrganizationDto[];
  favorites: FavoriteDto[];
  profile: ProfileDto;
};

export function SidebarRenderer(props: SidebarRendererProps) {
  const pathname = usePathname();

  const { projectId, epicId } = useParams<{
    projectId: string;
    epicId: string;
  }>();

  const activeOrganization = useActiveOrganization();
  const settingsRoute = replaceRouteSlugs(
    routes.dashboard.organizations.slug.settings.Index,
    {
      [RouteSlugs.OrgSlug]: activeOrganization.slug
    }
  );

  let epicRoute = replaceRouteSlugs(
    routes.dashboard.organizations.slug.projects.project.epics.epic.Index,
    {
      [RouteSlugs.OrgSlug]: activeOrganization.slug,
      [RouteSlugs.ProjectSlug]: projectId,
      [RouteSlugs.EpicSlug]: epicId
    }
  );

  if (pathname.startsWith(getPathname(epicRoute, baseUrl.Dashboard))) {
    // Return no sidebar to avoid client side and server side rendering confusions
    return;
  }

  if (pathname.startsWith(getPathname(settingsRoute, baseUrl.Dashboard))) {
    return <SettingsSidebar />;
  }

  return <AppSidebar {...props} />;
}
