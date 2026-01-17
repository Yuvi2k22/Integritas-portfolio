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
    question: `What makes Integritas different from other agencies?`,
    answer: `We don't just build software; we architect solutions that scale. Our approach is rooted in deep technical expertise across .NET, Node.js, and Enterprise architectures, ensuring your system performs under pressure and evolves with your business.`
  },
  {
    question: 'What is your specialty in backend development?',
    answer: `Our team specializes in building high-availability backends using .NET Core, Node.js (TypeScript), and Java Spring Boot. We prioritize security, performance, and long-term maintainability for every system we deploy.`
  },
  {
    question: 'How do you handle cloud migration and management?',
    answer:
      'We provide end-to-side cloud solutions specializing in AWS, Microsoft Azure, and Google Cloud. Our expertise includes architecting serverless systems, managing Kubernetes clusters, and optimizing cloud costs.'
  },
  {
    question: 'Do you work with emerging AI technologies?',
    answer: `Absolutely. We help businesses integrate AI and LLMs (Large Language Models) into their products, from initial R&D and prompt engineering to full-scale production deployment and automation.`
  },
  {
    question: 'What kind of support do you provide after launch?',
    answer:
      'Integritas provides dedicated post-launch support, including proactive monitoring, performance tuning, and 24/7 infrastructure management to ensure your platform stays resilient.'
  },
  {
    question: 'Can you work with our existing technical team?',
    answer: `Yes, we often function as a force multiplier for existing teams, bringing niche expertise in specialized backends or cloud architecture to help accelerate your roadmap.`
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
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%] font-medium">
              Have complex technical questions or need an architectural review? {' '}
              <Link
                href={routes.marketing.Contact}
                className="font-bold text-primary underline hover:text-foreground underline-offset-4"
              >
                Connect with our architects
              </Link>{' '}
              - we thrive on solving tough technical challenges.
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
