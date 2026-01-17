'use client';

import * as React from 'react';

import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@workspace/ui/components/avatar';

import { GridSection } from '~/components/fragments/grid-section';
import ProfileCard from '~/components/cards/ProfileCard';

const DATA = [
  {
    name: 'Rick Sanchez',
    role: 'Machine Learning Engineer',
    image: '/assets/story/rick-sanchez.webp',
    previousRole: 'Formerly AI research engineer at Meta',
    education: 'PhD in AI from Stanford',
    handle: 'ricksanchez',
    status: 'Online' as const,
    contactText: 'Contact Me'
  },
  {
    name: 'Morty Smith',
    role: 'Senior Software Engineer',
    image: '/assets/story/morty-smith.webp',
    previousRole: 'Formerly backend engineer at Google',
    education: 'BSc in Computer Science from UC Berkeley',
    handle: 'mortysmith',
    status: 'Online' as const,
    contactText: 'Contact Me'
  },
  {
    name: 'Summer Smith',
    role: 'Product Designer',
    image: '/assets/story/summer-smith.webp',
    previousRole: 'Formerly UX designer at Apple',
    education: 'MFA in Design from Rhode Island School of Design',
    handle: 'summersmith',
    status: 'Away' as const,
    contactText: 'Contact Me'
  },
  {
    name: 'Beth Smith',
    role: 'DevOps Engineer',
    image: '/assets/story/beth-smith.webp',
    previousRole: 'Formerly infrastructure engineer at Amazon',
    education: 'MSc in Systems Engineering from MIT',
    handle: 'bethsmith',
    status: 'Online' as const,
    contactText: 'Contact Me'
  },
  {
    name: 'Jerry Smith',
    role: 'Frontend Developer',
    image: '/assets/story/jerry-smith.webp',
    previousRole: 'Formerly UI developer at Netflix',
    education: 'BSc in Web Development from UCLA',
    handle: 'jerrysmith',
    status: 'Offline' as const,
    contactText: 'Contact Me'
  },
  {
    name: 'Mr. Meeseeks',
    role: 'QA Engineer',
    image: '/assets/story/mr-meeseeks.webp',
    previousRole: 'Formerly test automation lead at Microsoft',
    education: 'BSc in Software Testing from Carnegie Mellon',
    handle: 'mrmeeseeks',
    status: 'Online' as const,
    contactText: 'Contact Me'
  }
];

export function StoryTeam(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container max-w-full px-4 py-20">
        <h2 className="mb-16 text-sm font-medium uppercase tracking-wider text-muted-foreground ">
          The visionaries
        </h2>
        <div className="grid grid-cols-6 gap-4">
          {DATA.map((person, index) => (
            <ProfileCard
              key={index}
              name={person.name}
              title={person.role}
              handle={person.handle}
              status={person.status}
              contactText={person.contactText}
              avatarUrl={person.image}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => console.log(`Contact clicked for ${person.name}`)}
            />
          ))}
        </div>
      </div>
    </GridSection>
  );
}
