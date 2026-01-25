import * as React from 'react';
import Link from 'next/link';
import { CheckIcon, ChevronRightIcon } from 'lucide-react';

import { APP_NAME } from '@workspace/common/app';
import { routes } from '@workspace/routes';
import { buttonVariants } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

import { GridSection } from '~/components/fragments/grid-section';
import { SiteHeading } from '~/components/fragments/site-heading';

export function PricingPlans(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container space-y-20 py-20">
        <SiteHeading
          badge="Pricing"
          title="Tailored Solutions for Your Business"
          description={`At ${APP_NAME}, we understand that every project is unique. We offer custom pricing based on your specific requirements and goals.`}
        />

        <div className="mx-auto max-w-4xl">
          <div className="flex flex-col overflow-hidden rounded-3xl border bg-background shadow-xl md:flex-row">
            <div className="flex flex-col justify-center bg-muted/30 p-10 md:w-1/2">
              <h3 className="mb-4 text-2xl font-bold">Why Custom?</h3>
              <p className="mb-6 text-muted-foreground">
                Fixed plans often include things you don't need or miss things you do. Our custom approach ensures:
              </p>
              <ul className="space-y-4">
                {[
                  'Pay only for what you need',
                  'Scalable solutions that grow with you',
                  'Dedicated project management',
                  'Technology stack tailored to your use case',
                  'Flexible payment milestones'
                ].map((item) => (
                  <li key={item} className="flex items-start">
                    <CheckIcon className="mt-1 size-5 shrink-0 text-primary" />
                    <span className="ml-3 text-sm font-medium">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col justify-center p-10 md:w-1/2">
              <div className="mb-8 text-center md:text-left">
                <span className="mb-2 block text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                  Get a Quote
                </span>
                <h2 className="mb-4 text-3xl font-bold text-foreground">
                  Let's Build Something Great
                </h2>
                <p className="text-muted-foreground">
                  Tell us about your project, and we'll provide a detailed proposal and quote within 24 hours.
                </p>
              </div>

              <Link
                href={routes.marketing.Contact}
                className={cn(
                  buttonVariants({ variant: 'default', size: 'lg' }),
                  'group w-full rounded-xl text-base font-semibold shadow-md transition-all hover:shadow-lg'
                )}
              >
                Get a Free Quote
                <ChevronRightIcon className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
              </Link>
              <p className="mt-4 text-center text-xs text-muted-foreground">
                No obligation. 100% free consultation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
