'use client';

import * as React from 'react';
import Link from 'next/link';
import NiceModal from '@ebay/nice-modal-react';
import { ChevronRightIcon, PlusIcon, StoreIcon, UserIcon } from 'lucide-react';

import { Tier } from '@workspace/billing/tier';
import {
  baseUrl,
  getPathname,
  replaceOrgSlug,
  routes
} from '@workspace/routes';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar';
import { Badge } from '@workspace/ui/components/badge';
import { buttonVariants } from '@workspace/ui/components/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@workspace/ui/components/card';
import { EmptyState } from '@workspace/ui/components/empty-state';
import { InputSearch } from '@workspace/ui/components/input-search';
import { ScrollArea } from '@workspace/ui/components/scroll-area';
import { toast } from '@workspace/ui/components/sonner';

import type { OrganizationDto } from '~/types/dtos/organization-dto';
import { AddOrgRestrictionModal } from './slug/add-org-restriction-modal';

export type OrganizationListProps = {
  organizations: OrganizationDto[];
};

export function OrganizationList({
  organizations
}: OrganizationListProps): React.JSX.Element {
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const filteredOrganizations = organizations.filter(
    (o) =>
      !searchQuery ||
      o.name.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1 ||
      o.slug.toLowerCase().indexOf(searchQuery.toLowerCase()) !== -1
  );
  const handleSearchQueryChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setSearchQuery(e.target?.value || '');
  };

  const handlerAddOrganization = (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    let ownedFreeOrgs = 0;

    organizations.forEach((organization) => {
      if (organization.isCurrentUserOwner && organization.tier === Tier.Free)
        ownedFreeOrgs++;
    });

    if (ownedFreeOrgs >= 1) {
      event.preventDefault();
      return NiceModal.show(AddOrgRestrictionModal);
    }
  };

  return (
    <NiceModal.Provider>
      <Card className="border-none shadow-none">
        <CardHeader className="text-center">
          <CardTitle>Organizations</CardTitle>
          <CardDescription className="hidden sm:block">
            Jump into an existing organization or add a new one.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-4">
            <InputSearch
              placeholder="Search..."
              value={searchQuery}
              onChange={handleSearchQueryChange}
            />
            <Link
              href={routes.dashboard.onboarding.Organization}
              className={buttonVariants({
                variant: 'default',
                className: 'whitespace-nowrap'
              })}
              onClick={handlerAddOrganization}
            >
              <PlusIcon className="mr-2 size-4 shrink-0" />
              <span className="hidden sm:inline">Add organization</span>
              <span className="inline sm:hidden">Add</span>
            </Link>
          </div>
          {filteredOrganizations.length === 0 ? (
            <EmptyState
              icon={
                <div className="flex size-12 items-center justify-center rounded-md border">
                  <StoreIcon className="size-6 shrink-0 text-muted-foreground" />
                </div>
              }
              title="No organization found"
              description={
                searchQuery
                  ? 'Adjust your search query to show more.'
                  : 'Add your first organization to get started.'
              }
            />
          ) : (
            <ScrollArea className="[&>[data-radix-scroll-area-viewport]]:max-h-[calc(100svh-18rem)]">
              <div className="flex flex-col items-stretch justify-start gap-3">
                {filteredOrganizations.map((organization) => (
                  <Link
                    key={organization.id}
                    href={replaceOrgSlug(
                      routes.dashboard.organizations.slug.Home,
                      organization.slug
                    )}
                    className="group relative flex flex-col rounded-lg border transition-all hover:bg-secondary/20 hover:shadow active:bg-secondary/50 active:shadow-lg dark:shadow-primary/20"
                  >
                    <div className="flex h-full flex-row items-center justify-between p-4">
                      <div className="flex flex-row items-center gap-2 transition-colors group-hover:text-secondary-foreground">
                        <Avatar className="aspect-square size-6 rounded-md">
                          <AvatarImage
                            className="rounded-md"
                            src={organization.logo}
                          />
                          <AvatarFallback className="flex size-6 items-center justify-center rounded-md border border-neutral-200 bg-neutral-100 text-sm font-medium text-neutral-500 dark:border-neutral-700 dark:bg-neutral-900">
                            {organization.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {organization.name}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {getPathname(
                              routes.dashboard.organizations.Index,
                              baseUrl.Dashboard
                            )}
                            /{organization.slug}
                          </div>
                        </div>
                      </div>
                      <div className="ml-auto mr-4">
                        {organization.tier === Tier.Free && (
                          <Badge className="bg-blue-500 hover:bg-blue-500">
                            Free
                          </Badge>
                        )}
                        {(organization.tier === Tier.Pro ||
                          organization.tier === Tier.ProPendingCancel) && (
                          <Badge className="bg-green-600 hover:bg-green-600">
                            Pro
                          </Badge>
                        )}
                      </div>
                      <div className="flex flex-row items-center gap-2">
                        <div className="flex w-8 flex-row items-center gap-1 text-xs text-muted-foreground transition-colors group-hover:text-secondary-foreground">
                          <UserIcon className="size-3 shrink-0" />
                          {organization.memberCount}
                        </div>
                        <ChevronRightIcon className="size-4 text-muted-foreground transition-colors group-hover:text-secondary-foreground" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </ScrollArea>
          )}
        </CardContent>
      </Card>
    </NiceModal.Provider>
  );
}
