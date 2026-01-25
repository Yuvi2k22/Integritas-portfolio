import * as React from 'react';
import Link from 'next/link';

import { APP_NAME } from '@workspace/common/app';
import { routes } from '@workspace/routes';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@workspace/ui/components/accordion';

import { GridSection } from '~/components/fragments/grid-section';

const DATA = [
  {
    question: 'How does the custom pricing work?',
    answer: (
      <p>
        We assess your specific requirements, project complexity, and timeline to
        provide a tailored quote. This ensures you only pay for exactly what you
        need, with no hidden costs for unused features.
      </p>
    )
  },
  {
    question: 'What defines the cost of a project?',
    answer: (
      <p>
        The cost is primarily driven by the number of pages/screens, design
        complexity (custom animations, unique UI), feature requirements (CMS,
        e-commerce, integrations), and the timeline for delivery.
      </p>
    )
  },
  {
    question: 'Is there a maintenance fee?',
    answer: (
      <p>
        We offer optional maintenance packages to keep your site secure and
        up-to-date. However, for most static sites and simple web apps, there
        are no mandatory ongoing monthly fees other than your standard hosting
        costs.
      </p>
    )
  },
  {
    question: 'How long does a typical project take?',
    answer: (
      <p>
        Timelines vary by scope. A standard marketing website typically takes
        2-4 weeks, while complex web applications may take 6-12 weeks or more.
        We provide a detailed timeline with every proposal.
      </p>
    )
  },
  {
    question: 'Can I update the project scope later?',
    answer: (
      <p>
        Absolutely. We work agilely and can accommodate scope changes. We&apos;ll
        provide a transparent quote for any additional requirements that arise
        during or after the initial development phase.
      </p>
    )
  }
];

export function PricingFAQ(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%]">
              Have questions about our pricing or plans?{' '}
              <Link
                href={routes.marketing.Contact}
                className="font-normal text-inherit underline hover:text-foreground"
              >
                Contact us
              </Link>{' '}
              - we&apos;re here to help you find the perfect fit for your needs.
            </p>
          </div>
          <div className="mx-auto flex w-full max-w-xl flex-col">
            <Accordion
              type="single"
              collapsible
            >
              {DATA.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={index.toString()}
                >
                  <AccordionTrigger className="text-left text-base">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-base">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
