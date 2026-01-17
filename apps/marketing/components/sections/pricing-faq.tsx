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
    question: `How does Integritas approach building high-performance systems?`,
    answer: (
      <div>
        We focus on architecting resilient and scalable solutions from day one. Our approach combines:
        <ul className="mt-2 list-disc pl-5 font-medium">
          <li><strong>Performance First:</strong> Optimized codebases in .NET and Node.js</li>
          <li><strong>Cloud-Native:</strong> Leveraging serverless and scalable infra</li>
          <li><strong>AI Integration:</strong> Practical LLM applications for real-world ROI</li>
        </ul>
      </div>
    )
  },
  {
    question: "Which backend technologies do you specialize in?",
    answer: (
      <div>
        Our team has deep expertise in building scalable and performant backends using:
        <ul className="mt-2 list-disc pl-5">
          <li><strong>.NET & C#</strong> for enterprise-grade applications</li>
          <li><strong>Node.js & TypeScript</strong> for modern, fast-paced environments</li>
          <li><strong>Java & Spring Boot</strong> for high-availability systems</li>
          <li><strong>Python</strong> for AI, data science, and scripting</li>
        </ul>
      </div>
    )
  },
  {
    question: 'Which cloud platforms do you support?',
    answer: (
      <div>
        We are platform-agnostic and provide seamless deployment and management across:
        <ul className="mt-2 list-disc pl-5">
          <li><strong>Amazon Web Services (AWS)</strong> & <strong>Microsoft Azure</strong></li>
          <li><strong>Google Cloud Platform (GCP)</strong></li>
          <li><strong>Vercel</strong> for optimized frontend and serverless projects</li>
        </ul>
      </div>
    )
  },
  {
    question: 'Do you offer custom AI solutions?',
    answer: (
      <p>
        Yes. We integrate advanced AI capabilities into your existing workflows,
        helping you leverage data and automation to outperform the market and
        disrupt traditional business models.
      </p>
    )
  },
  {
    question: 'How is project pricing determined?',
    answer: (
      <p>
        Every project is unique. We offer flexible engagement models, including
        fixed-price contracts for well-defined scopes and dedicated team
        arrangements for agile, iterative development.
        <Link href={routes.marketing.Contact} className="ml-1 text-primary hover:underline">
          Contact us
        </Link> for a custom quote.
      </p>
    )
  },
  {
    question: 'What is your development process?',
    answer: (
      <p>
        We follow a modern Agile methodology, prioritizing transparent
        communication and iterative delivery. You'll have direct access to
        our developers and regular progress updates through our CI/CD pipelines.
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
            <p className="mt-6 hidden text-muted-foreground md:block lg:max-w-[75%] font-medium">
              Have questions about our technical expertise or custom solutions?{' '}
              <Link
                href={routes.marketing.Contact}
                className="font-semibold text-primary underline hover:text-foreground underline-offset-4"
              >
                Contact our team
              </Link>{' '}
              - we're here to help you architect the perfect system for your vision.
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
