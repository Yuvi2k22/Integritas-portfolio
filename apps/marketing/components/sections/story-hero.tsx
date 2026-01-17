'use client';

import * as React from 'react';
import { useEffect, useState } from 'react';

import { Badge } from '@workspace/ui/components/badge';
import { GridSection } from '~/components/fragments/grid-section';

export function StoryHero(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Trigger animations after mount
    setIsVisible(true);
  }, []);

  return (
    <GridSection hideVerticalGridLines>
      <div className="container py-24 md:py-32">
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-6 text-center">
          {/* Animated Badge */}
          <Badge
            variant="outline"
            className="h-8 rounded-full px-3 text-sm font-medium shadow-sm transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
            }}
          >
            About Us
          </Badge>

          {/* Animated Title */}
          <h1
            className="text-pretty text-5xl font-bold leading-snug lg:text-6xl lg:leading-snug transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '200ms',
            }}
          >
            <span className="block text-primary mb-2">
              Passionate coders
            </span>
            <span className="block text-foreground mb-2">
              building the future,
            </span>
            <span className="block text-primary">
              one project at a time
            </span>
          </h1>

          {/* Animated Description */}
          <p
            className="text-lg text-muted-foreground lg:text-xl transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
              transitionDelay: '400ms',
            }}
          >
            We're a team of driven freelancers who live and breathe code. United by our love for clean architecture, innovative solutions, and the thrill of turning ideas into reality. We're not just developers—we're your partners in building something extraordinary.
          </p>
        </div>
      </div>
    </GridSection>
  );
}
