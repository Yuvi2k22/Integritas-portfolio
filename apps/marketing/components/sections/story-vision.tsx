import * as React from 'react';
import { AppWindow, Database, ShoppingBag, Sparkles } from 'lucide-react';

import { GridSection } from '~/components/fragments/grid-section';

const SERVICES = [
  {
    icon: AppWindow,
    title: 'Web & Mobile',
    description:
      'SaaS platforms, internal dashboards, landing pages, and React Native / Flutter applications.'
  },
  {
    icon: ShoppingBag,
    title: 'E-Commerce',
    description:
      'Custom stores, multi-vendor marketplaces, and payment-integrated admin dashboards.'
  },
  {
    icon: Database,
    title: 'Enterprise Systems',
    description:
      'Legacy system modernization, backend re-architecture, and performance optimization.'
  },
  {
    icon: Sparkles,
    title: 'AI Solutions',
    description:
      'LLM integrations, AI-assisted workflows, and intelligent automation.'
  }
];

export function StoryVision(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            What We Build
          </h2>
          <h3 className="mt-4 text-3xl font-semibold md:text-4xl">
            Comprehensive Digital Solutions
          </h3>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              className="group rounded-2xl border bg-background/50 p-8 transition-colors hover:bg-muted/50"
            >
              <div className="mb-6 inline-flex rounded-lg bg-primary/10 p-3 text-primary">
                <service.icon className="size-6" />
              </div>
              <h4 className="mb-3 text-xl font-medium">{service.title}</h4>
              <p className="leading-relaxed text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
}
