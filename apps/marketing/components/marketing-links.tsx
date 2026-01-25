import * as React from 'react';
import {
  BookIcon,
  BookOpenIcon,
  BoxIcon,
  CircuitBoardIcon,
  CuboidIcon,
  FileBarChartIcon,
  LayoutIcon,
  PlayIcon,
  SendHorizonalIcon
} from 'lucide-react';

import { routes } from '@workspace/routes';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  TikTokIcon,
  XIcon
} from '@workspace/ui/components/brand-icons';


export interface MenuItem {
  title: string;
  href: string;
  external?: boolean;
  items?: {
    title: string;
    description?: string;
    icon?: React.ReactNode;
    href: string;
    external?: boolean;
  }[];
}

export const MENU_LINKS: MenuItem[] = [
  {
    title: 'Pricing',
    href: routes.marketing.Pricing,
    external: false
  },
  {
    title: 'Contact',
    href: routes.marketing.Contact,
    external: false
  },
  {
    title: 'About Us',
    href: routes.marketing.Story,
    external: false
  }
];

export const FOOTER_LINKS = [
  {
    title: 'Resources',
    links: [
      { name: 'Contact', href: routes.marketing.Contact, external: false }
    ]
  },
  {
    title: 'About',
    links: [
      { name: 'Story', href: routes.marketing.Story, external: false }
    ]
  },

];

export const SOCIAL_LINKS = [
  {
    name: 'X (formerly Twitter)',
    href: '~/',
    icon: <XIcon className="size-4 shrink-0" />
  },
  {
    name: 'LinkedIn',
    href: '~/',
    icon: <LinkedInIcon className="size-4 shrink-0" />
  },
  {
    name: 'Facebook',
    href: '~/',
    icon: <FacebookIcon className="size-4 shrink-0" />
  },
  {
    name: 'Instagram',
    href: '~/',
    icon: <InstagramIcon className="size-4 shrink-0" />
  },
  {
    name: 'TikTok',
    href: '~/',
    icon: <TikTokIcon className="size-4 shrink-0" />
  }
];

export const DOCS_LINKS = [
  {
    title: 'Getting Started',
    icon: <CuboidIcon className="size-4 shrink-0 text-muted-foreground" />,
    items: [
      {
        title: 'Introduction',
        href: '/docs',
        items: []
      },
      {
        title: 'Dependencies',
        href: '/docs/dependencies',
        items: []
      }
    ]
  },
  {
    title: 'Guides',
    icon: <BookIcon className="size-4 shrink-0 text-muted-foreground" />,
    items: [
      {
        title: 'Using MDX',
        href: '/docs/using-mdx',
        items: []
      }
    ]
  }
];
