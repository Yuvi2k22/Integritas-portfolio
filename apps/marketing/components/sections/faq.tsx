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
    question: `What services does Integritas Solutions provide?`,
    answer: `We are expert Software Engineers taking ideas from Concept to Production. We build scalable Web & Mobile apps, Custom Ecommerce stores, and handle Enterprise Legacy System Migrations.`
  },
  {
    question: 'What kind of web and mobile apps do you build?',
    answer: `We specialize in SaaS Platforms, Dashboards, Landing Pages, and high-performance React Native / Flutter mobile apps, creating scalable systems that last.`
  },
  {
    question: 'Do you work with startups or small businesses?',
    answer:
      'Yes, we support businesses of all sizes! Whether you need a Small Business Website, a Startup MVP, or a large-scale Enterprise Migration, we have the expertise to help.'
  },
  {
    question: 'Can you help with AI integration?',
    answer: `Absolutely. We offer AI Solutions including LLM integration and the development of AI-powered workflows to modernize your business operations.`
  },
  {
    question: 'What technology stack do you use?',
    answer:
      'We ship with modern AI tools for speed and trusted enterprise frameworks for stability, ensuring your product is both cutting-edge and reliable.'
  },
  {
    question: 'What is your development philosophy?',
    answer: `Our philosophy is simple: No shortcuts. No noise. Just well-built digital experiences that deliver real value.`
  }
];

export function FAQ(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container py-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">
          <div className="text-center lg:text-left">
            <h2 className="mb-2.5 text-3xl font-semibold md:text-5xl">
              Frequently Asked Questions
            </h2>
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%]">
              Haven't found what you're looking for? Try{' '}
              <Link
                href={routes.marketing.Contact}
                className="font-normal text-inherit underline hover:text-foreground"
              >
                contacting
              </Link>{' '}
              us, we are glad to help.
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
