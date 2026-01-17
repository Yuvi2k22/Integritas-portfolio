import * as React from 'react';
import { BarChartIcon, UserPlusIcon, WorkflowIcon } from 'lucide-react';

import { BlurFade } from '~/components/fragments/blur-fade';
import { GridSection } from '~/components/fragments/grid-section';
import { TextGenerateWithSelectBoxEffect } from '~/components/fragments/text-generate-with-select-box-effect';

const DATA = [
  {
    icon: <UserPlusIcon className="size-5 shrink-0" />,
    title: 'Built for Your Users',
    description:
      'Clunky software kills productivity. We build fast, intuitive applications that your team and customers will actually love to use.'
  },
  {
    icon: <BarChartIcon className="size-5 shrink-0" />,
    title: 'Designed for Growth',
    description:
      'Scale without the technical headaches. We engineer robust systems that stay fast and reliable as your business reaches new heights.'
  },
  {
    icon: <WorkflowIcon className="size-5 shrink-0" />,
    title: 'Seamlessly Connected',
    description:
      'Stop managing fragmented platforms. We unify your web and mobile presence into one smooth, high-performance digital ecosystem.'
  }
];

export function Problem(): React.JSX.Element {
  return (
    <GridSection>
      <div className="px-4 py-20 text-center">
        <h2 className="text-3xl font-semibold md:text-5xl">
          <TextGenerateWithSelectBoxEffect words="Bridging the DigitalGap" />
        </h2>
      </div>
      <div className="grid divide-y border-t border-dashed md:grid-cols-3 md:divide-x md:divide-y-0">
        {DATA.map((statement, index) => (
          <BlurFade
            key={index}
            inView
            delay={0.2 + index * 0.2}
            className="border-dashed px-8 py-12"
          >
            <div className="mb-7 flex size-12 items-center justify-center rounded-2xl border bg-background shadow">
              {statement.icon}
            </div>
            <h3 className="mb-3 text-lg font-semibold">{statement.title}</h3>
            <p className="text-muted-foreground">{statement.description}</p>
          </BlurFade>
        ))}
      </div>
    </GridSection>
  );
}
