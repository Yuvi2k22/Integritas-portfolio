import * as React from 'react';
import {
  Brain,
  Handshake,
  LayoutTemplate,
  MessageSquare,
  Scaling,
  Wallet
} from 'lucide-react';

import { GridSection } from '~/components/fragments/grid-section';

const BENEFITS = [
  {
    icon: LayoutTemplate,
    title: 'MVP-Focused Engineering',
    description:
      'We understand startup constraints and build only what is needed to validate, launch, and scale—without unnecessary complexity.'
  },
  {
    icon: Brain,
    title: 'Strong Technical Ownership',
    description:
      'From architecture decisions to production deployment, we take full responsibility for stability, performance, and maintainability.'
  },
  {
    icon: Scaling,
    title: 'Scalable by Design',
    description:
      'Even at MVP stage, our systems are designed to grow seamlessly across users, cities, and future business models.'
  },
  {
    icon: Wallet,
    title: 'Cost-Conscious Delivery',
    description:
      'We make pragmatic technology choices that reduce infrastructure and development costs without compromising quality.'
  },
  {
    icon: MessageSquare,
    title: 'Clear Communication & Transparency',
    description:
      'Regular updates, clear milestones, and honest technical guidance throughout the project lifecycle.'
  },
  {
    icon: Handshake,
    title: 'Long-Term Partnership Mindset',
    description:
      'We don’t just deliver code—we help evolve products with future enhancements, optimizations, and support.'
  }
];

export function StoryTimeline(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="mb-16 text-center">
          <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Why You Should Hire Us
          </h2>
          <h3 className="mt-4 text-3xl font-semibold md:text-4xl">
            Built for Growth & Stability
          </h3>
        </div>

        <div className="grid gap-x-8 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((benefit, index) => (
            <div
              key={index}
              className="flex flex-col"
            >
              <div className="mb-4 inline-flex size-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <benefit.icon className="size-6" />
              </div>
              <h4 className="mb-3 text-xl font-medium">{benefit.title}</h4>
              <p className="leading-relaxed text-muted-foreground">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
}
