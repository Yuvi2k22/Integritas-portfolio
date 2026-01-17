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
    name: 'Yuvaraj',
    role: 'Lead Developer',
    image: '/assets/team/dp.png',
    handle: 'yuvaraj',
    status: 'Online' as const
  },
  {
    name: 'Guru prasanth',
    role: 'Full Stack Developer',
    image: '/assets/team/IMG_20260117_174225.jpg',
    handle: 'guruprasanth',
    status: 'Online' as const
  },
  {
    name: 'Nithish Kumar T',
    role: 'Frontend Developer',
    image: '/assets/team/SAVE_20240710_164444.jpg',
    handle: 'nithishkumar',
    status: 'Online' as const
  },
  {
    name: 'Vijay',
    role: 'Full stack Developer',
    image: '/assets/team/dp.png',
    handle: 'vijaykrishna',
    status: 'Online' as const
  },
  {
    name: 'Rahul A',
    role: 'Backend Developer',
    image: '/assets/team/Rahul_softcopy.jpeg',
    handle: 'rahula',
    status: 'Online' as const
  },
  {
    name: 'HariHaran P',
    role: 'Software Developer',
    image: '/assets/team/dp.png',
    handle: 'hariharan',
    status: 'Online' as const
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
              contactText=""
              avatarUrl={person.image}
              showUserInfo={true}
              enableTilt={true}
              enableMobileTilt={false}
              onContactClick={() => { }}
            />
          ))}
        </div>
      </div>
    </GridSection>
  );
}
