'use client';

import { createContext, PropsWithChildren, useContext } from 'react';

import { MemberDto } from '~/types/dtos/member-dto';

const OrganizationMembersContext = createContext<MemberDto[] | undefined>(
  undefined
);

export type ActiveOrganizationMembersProviderProps = {
  members: MemberDto[];
} & PropsWithChildren;

export function ActiveOrganizationMembersProvider(
  props: ActiveOrganizationMembersProviderProps
) {
  const { members, children } = props;

  return (
    <OrganizationMembersContext.Provider value={members}>
      {children}
    </OrganizationMembersContext.Provider>
  );
}

export function useActiveOrganizationMembers() {
  const context = useContext(OrganizationMembersContext);

  if (context === undefined) {
    throw new Error(
      'useActiveOrganizationMembers must be used within a ActiveOrganizationMembersProvider'
    );
  }

  return context;
}
