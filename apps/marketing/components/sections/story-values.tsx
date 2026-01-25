import * as React from 'react';

import { FlickeringGrid } from '~/components/fragments/flickering-grid';
import { GridSection } from '~/components/fragments/grid-section';

export function StoryValues(): React.JSX.Element {
  return (
    <GridSection>
      <div className="container relative max-w-4xl overflow-hidden py-24 md:py-32">
        <h2 className="mb-8 text-center text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Our Philosophy
        </h2>
        <p className="mx-auto text-center text-2xl font-semibold sm:text-3xl md:text-4xl">
          "No shortcuts. No noise. Just well-built digital experiences."
        </p>
        <FlickeringGrid
          className="pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(450px_circle_at_center,hsl(var(--background)),transparent)]"
          squareSize={4}
          gridGap={6}
          color="gray"
          maxOpacity={0.12}
          height={400}
          width={1000}
        />
      </div>
    </GridSection>
  );
}
