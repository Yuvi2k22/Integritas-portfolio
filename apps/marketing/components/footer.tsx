'use client';

import * as React from 'react';
import Link from 'next/link';

import { APP_NAME } from '@workspace/common/app';
import { Logo } from '@workspace/ui/components/logo';
import { ThemeSwitcher } from '@workspace/ui/components/theme-switcher';
import { ExternalLink } from '~/components/fragments/external-link';
import { FOOTER_LINKS } from '~/components/marketing-links';

export function Footer(): React.JSX.Element {
  return (
    <footer className="px-2 pb-10 pt-20 sm:container">
      <h2 className="sr-only">Footer</h2>
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-8 text-center md:flex-row md:text-left">
          <div className="max-w-xs">
            <Logo />
            <p className="mt-3 text-sm text-muted-foreground">
              The foundation of your digital future.
            </p>
          </div>
          <div className="flex gap-12">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="text-sm font-semibold text-foreground">
                  {group.title}
                </h3>
                <ul
                  role="list"
                  className="mt-4 space-y-3"
                >
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        title={link.name}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                      >
                        {link.name}
                        {link.external && (
                          <ExternalLink className="ml-1 inline-block size-3 opacity-80" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-12 border-t pt-8">
          <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex flex-row items-center gap-4">
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
