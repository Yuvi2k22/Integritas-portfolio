'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

import { FlickeringGrid } from '~/components/fragments/flickering-grid';
import { GridSection } from '~/components/fragments/grid-section';

const VALUES = [
  {
    title: 'Quality First',
    description: 'We never cut corners. Every line of code is crafted with care and purpose.',
    icon: '✨',
  },
  {
    title: 'Client Partnership',
    description: 'Your success is our success. We work alongside you, not just for you.',
    icon: '🤝',
  },
  {
    title: 'Continuous Learning',
    description: 'Technology evolves, and so do we. Always exploring, always improving.',
    icon: '📚',
  },
  {
    title: 'Transparent Communication',
    description: 'No surprises. Clear updates, honest timelines, and open discussions.',
    icon: '💬',
  },
];

export function StoryValues(): React.JSX.Element {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <GridSection>
      <div ref={sectionRef} className="container relative max-w-6xl overflow-hidden py-24 md:py-32">
        {/* Header */}
        <div
          className="mb-16 text-center transition-all duration-700 ease-out"
          style={{
            opacity: isVisible ? 1 : 0,
            transform: isVisible ? 'translateY(0)' : 'translateY(30px)',
          }}
        >
          <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Our Values
          </h2>
          <p className="mx-auto max-w-2xl text-2xl font-semibold sm:text-3xl md:text-4xl">
            "Great code comes from great principles — here's what drives us every day."
          </p>
        </div>

        {/* Values Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {VALUES.map((value, index) => (
            <div
              key={index}
              className="group relative rounded-xl border border-border bg-card/50 p-6 text-center backdrop-blur-sm transition-all duration-500 hover:border-primary hover:bg-card"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateY(0) scale(1)' : 'translateY(30px) scale(0.95)',
                transitionDelay: `${index * 100 + 200}ms`,
              }}
            >
              {/* Icon */}
              <div className="mb-4 text-4xl transition-transform duration-300 group-hover:scale-125">
                {value.icon}
              </div>

              {/* Title */}
              <h3 className="mb-2 text-lg font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                {value.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-muted-foreground leading-relaxed">
                {value.description}
              </p>
            </div>
          ))}
        </div>

        {/* Background Grid Effect */}
        <FlickeringGrid
          className="pointer-events-none absolute inset-0 z-0 [mask-image:radial-gradient(600px_circle_at_center,hsl(var(--background)),transparent)]"
          squareSize={4}
          gridGap={6}
          color="gray"
          maxOpacity={0.12}
          height={600}
          width={1200}
        />
      </div>
    </GridSection>
  );
}
