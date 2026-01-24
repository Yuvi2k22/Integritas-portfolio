"use client";
import * as React from 'react';
import dynamic from 'next/dynamic';
import { BlurFade } from '~/components/fragments/blur-fade';
import { GridSection } from '~/components/fragments/grid-section';
import { TextGenerateWithSelectBoxEffect } from '~/components/fragments/text-generate-with-select-box-effect';
import { BarChartLottie, WorkflowLottie } from '~/components/ui/lottie-placeholders';

const Lottie = dynamic(() => import('lottie-react'), { ssr: false });
const DotLottiePlayer = dynamic(
  () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
  { ssr: false }
);

const DATA = [
  {
    title: 'Outdated User Experiences',
    description: 'Modern users demand lightning-fast, intuitive interfaces. An outdated or clunky website creates friction, causing potential customers to bounce to competitors before they even understand your value proposition.',
    component: <DotLottiePlayer src="/uxui%20d.lottie" autoplay loop className="size-full" />
  },
  {
    title: 'Inability to Scale Quickly',
    description: 'our current setup works for 100 users, but what happens when you hit 10,000? Systems built without architectural foresight crash during peak demand, damaging your brand reputation and costing you revenue.',
    component: <DotLottiePlayer src="/Growth.lottie" autoplay loop className="size-full" />
  },
  {
    title: 'The Integration Nightmare',
    description: 'Disparate tools and manual processes slow down your operations. Without seamless integrations and custom automation, your team wastes hours on repetitive tasks instead of focusing on high-value strategy.',
    component: <DotLottiePlayer src="/API%20Integration.lottie" autoplay loop className="size-full" />
  }
];

export function Problem(): React.JSX.Element {
  return (
    <GridSection>
      <div className="px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          <TextGenerateWithSelectBoxEffect words="Is Your Technology Bottlenecking Your Growth?" />
        </h2>
      </div>
      <div className="grid divide-y border-t border-dashed lg:grid-cols-3 lg:divide-x lg:divide-y-0">
        {DATA.map((statement, index) => (
          <BlurFade
            key={index}
            inView
            delay={0.2 + index * 0.2}
            className="border-dashed px-6 md:px-8 py-12"
          >
            <div className="mb-7 flex size-24 items-center justify-center rounded-2xl border bg-background shadow p-2 overflow-hidden">
              {statement.component}
            </div>
            <h3 className="mb-3 text-lg font-semibold">{statement.title}</h3>
            <p className="text-muted-foreground">{statement.description}</p>
          </BlurFade>
        ))}
      </div>
    </GridSection>
  );
}
