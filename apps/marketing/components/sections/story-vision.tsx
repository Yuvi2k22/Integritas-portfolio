'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

import { GridSection } from '~/components/fragments/grid-section';

export function StoryVision(): React.JSX.Element {
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
      <div ref={sectionRef} className="container max-w-6xl py-20">
        <div className="grid gap-16 lg:grid-cols-2">
          {/* Left Column - Vision Quote */}
          <div
            className="transition-all duration-700 ease-out"
            style={{
              opacity: isVisible ? 1 : 0,
              transform: isVisible ? 'translateX(0)' : 'translateX(-40px)',
            }}
          >
            <h2 className="mb-8 text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Our Vision
            </h2>
            <p className="text-2xl font-medium leading-relaxed md:text-3xl">
              "Code is more than syntax — it's the art of solving problems and creating possibilities."
            </p>
          </div>

          {/* Right Column - Description */}
          <div className="space-y-6 text-base text-muted-foreground md:text-lg">
            <p
              className="transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: '200ms',
              }}
            >
              We're not just another freelance team. We're a collective of passionate developers who believe every project deserves craftsmanship, attention to detail, and genuine care. From startups to established businesses, we bring the same energy and dedication.
            </p>
            <p
              className="transition-all duration-700 ease-out"
              style={{
                opacity: isVisible ? 1 : 0,
                transform: isVisible ? 'translateX(0)' : 'translateX(40px)',
                transitionDelay: '400ms',
              }}
            >
              Our approach combines modern technologies with clean architecture — delivering solutions that are not only functional but scalable, maintainable, and built to last. We don't just write code; we craft digital experiences that make a difference.
            </p>
          </div>
        </div>
      </div>
    </GridSection>
  );
}
