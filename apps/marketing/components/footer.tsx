'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

import { APP_NAME } from '@workspace/common/app';
import { Button } from '@workspace/ui/components/button';
import { Logo } from '@workspace/ui/components/logo';
import { Separator } from '@workspace/ui/components/separator';
import { ThemeSwitcher } from '@workspace/ui/components/theme-switcher';
import { routes } from '@workspace/routes';

import { ExternalLink } from '~/components/fragments/external-link';
import { FOOTER_LINKS, SOCIAL_LINKS } from '~/components/marketing-links';

export function Footer(): React.JSX.Element {
  return (
    <footer className="px-2 pb-10 pt-20 sm:container">
      <h2 className="sr-only">Footer</h2>
      <div className="container">
        <div className="xl:grid xl:grid-cols-6 xl:gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="hidden xl:block"
          >
            <Logo />
            <p className="mt-3 text-xs text-muted-foreground leading-relaxed">
              Our mission is to disrupt the market with innovative AI solutions and professional expertise.
            </p>
          </motion.div>
          <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-3">
            {FOOTER_LINKS.map((group, idx) => (
              <motion.div
                key={group.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <h3 className="text-sm font-semibold text-foreground tracking-tight">
                  {group.title}
                </h3>
                <ul
                  role="list"
                  className="mt-6 space-y-3"
                >
                  {group.links.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        title={link.name}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="group relative flex items-center text-sm text-muted-foreground transition-all hover:text-primary"
                      >
                        <motion.span
                          whileHover={{ x: 4 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          {link.name}
                        </motion.span>
                        {link.external && (
                          <ExternalLink className="ml-1 size-3 opacity-0 transition-opacity group-hover:opacity-100" />
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="mt-10 space-y-6 lg:col-span-2 xl:mt-0 p-6 rounded-2xl bg-muted/30 border border-border/50 backdrop-blur-sm shadow-sm"
          >
            <div className="space-y-2">
              <h3 className="text-base font-bold text-foreground">
                Ready to transform your vision?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Connect with our team to discuss your next big project and see how we can help you grow.
              </p>
            </div>
            <div className="pt-2">
              <Button
                asChild
                className="w-full sm:w-auto px-8 h-11 text-sm font-medium shadow-lg hover:shadow-primary/20 transition-all duration-300"
              >
                <Link href={routes.marketing.Contact}>
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
        <div className="mt-16 border-t border-border/50 pt-8">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <p className="text-sm text-muted-foreground/80">
              © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
            </p>
            <div className="flex flex-row items-center gap-6">
              {SOCIAL_LINKS.map((link) => (
                <motion.div
                  key={link.name}
                  whileHover={{ y: -3, scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Link
                    title={link.name}
                    href={link.href}
                    className="text-muted-foreground/60 transition-colors hover:text-primary"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <span className="sr-only">{link.name}</span>
                    {link.icon}
                  </Link>
                </motion.div>
              ))}
              <Separator
                orientation="vertical"
                className="h-5 bg-border/50"
              />
              <ThemeSwitcher />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
