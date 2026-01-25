import * as React from 'react';

import { GridSection } from '~/components/fragments/grid-section';
import { SiteHeading } from '~/components/fragments/site-heading';

export function StoryHero(): React.JSX.Element {
  return (
    <GridSection hideVerticalGridLines>
      <div className="container py-24 md:py-32">
        <SiteHeading
          badge="About Integritas Solutions"
          title="We are expert Software Engineers who take ideas from concept to production."
          description="We support businesses of all sizes whether you need a Small Business Website, a Startup MVP, or an Enterprise-scale migration, we focus on building scalable systems that last."
        />
        <p className="mx-auto mt-8 max-w-3xl text-center text-lg text-muted-foreground">
          We are a group of six Developers who have worked in MNCs, Enterprise,
          startups, SaaSs and so on. We are doing this with passion.
        </p>
      </div>
    </GridSection>
  );
}
