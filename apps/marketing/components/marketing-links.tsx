import * as React from 'react';
import {
  SendHorizonalIcon
} from 'lucide-react';

import { routes } from '@workspace/routes';
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  XIcon
} from '@workspace/ui/components/brand-icons';

// Creative Animation Variants for Components to use
export const LINK_ANIMATION_VARIANTS = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
  hover: {
    scale: 1.05,
    x: 5,
    color: 'hsl(var(--primary))',
    transition: { type: 'spring', stiffness: 400, damping: 10 }
  },
  tap: { scale: 0.95 }
};

export const MENU_LINKS = [
  {
    title: 'Resources',
    items: [
      {
        title: 'Work with Us',
        description: 'Reach out to build something amazing together',
        icon: <SendHorizonalIcon className="size-5 shrink-0" />,
        href: routes.marketing.Contact,
        external: false
      }
    ]
  },
  {
    title: 'Pricing',
    href: routes.marketing.Pricing,
    external: false
  },
  {
    title: 'Story',
    href: routes.marketing.Story,
    external: false
  }
];

export const FOOTER_LINKS = [
  {
    title: 'Company',
    links: [
      { name: 'Our Story', href: routes.marketing.Story, external: false },
      { name: 'Contact Us', href: routes.marketing.Contact, external: false }
    ]
  },
  {
    title: 'Explore',
    links: [
      { name: 'Pricing', href: routes.marketing.Pricing, external: false }
    ]
  }
];

export const SOCIAL_LINKS = [
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com',
    icon: <LinkedInIcon className="size-4 shrink-0" />
  },
  {
    name: 'X',
    href: 'https://x.com',
    icon: <XIcon className="size-4 shrink-0" />
  },
  {
    name: 'Facebook',
    href: 'https://facebook.com',
    icon: <FacebookIcon className="size-4 shrink-0" />
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com',
    icon: <InstagramIcon className="size-4 shrink-0" />
  }
];

// Simplified for internal use
export const DOCS_LINKS: any[] = [];
