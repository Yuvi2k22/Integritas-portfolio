'use client';

import * as React from 'react';
import { useEffect, useState, useRef } from 'react';

import { GridSection } from '~/components/fragments/grid-section';

const SERVICES = [
  {
    title: 'Backend Development',
    description: 'Robust, scalable server-side solutions that power your applications.',
    technologies: ['.NET', 'Python', 'Java', 'Spring Boot'],
    icon: '⚙️',
  },
  {
    title: 'Frontend Development',
    description: 'Beautiful, responsive interfaces that users love to interact with.',
    technologies: ['React', 'Next.js', 'Angular', 'Express'],
    icon: '🎨',
  },
  {
    title: 'Database & Architecture',
    description: 'Efficient data solutions designed for performance and reliability.',
    technologies: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis'],
    icon: '🗄️',
  },
  {
    title: 'Cloud & Deployment',
    description: 'Seamless deployment pipelines and cloud infrastructure management.',
    technologies: ['Vercel'],
    icon: '☁️',
  },
];

export function StoryTimeline(): React.JSX.Element {
  const [visibleCards, setVisibleCards] = useState<boolean[]>(new Array(SERVICES.length).fill(false));
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers = cardsRef.current.map((card, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setVisibleCards((prev) => {
              const newState = [...prev];
              newState[index] = true;
              return newState;
            });
          }
        },
        { threshold: 0.2 }
      );

      if (card) {
        observer.observe(card);
      }

      return observer;
    });

    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <GridSection>
      <div className="container max-w-6xl py-20">
        <h2 className="mb-4 text-sm font-medium uppercase tracking-wider text-muted-foreground">
          What We Offer
        </h2>
        <p className="mb-16 text-2xl font-medium leading-relaxed md:text-3xl max-w-3xl">
          Full-stack expertise to bring your ideas to life — from concept to deployment.
        </p>

        <div className="grid gap-8 md:grid-cols-2">
          {SERVICES.map((service, index) => (
            <div
              key={index}
              ref={(el) => { cardsRef.current[index] = el; }}
              className="group relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition-all duration-500 hover:border-primary hover:shadow-lg"
              style={{
                opacity: visibleCards[index] ? 1 : 0,
                transform: visibleCards[index]
                  ? 'translateY(0) scale(1)'
                  : 'translateY(40px) scale(0.95)',
                transitionDelay: `${index * 150}ms`,
              }}
            >
              {/* Animated background gradient on hover */}
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

              {/* Icon */}
              <div className="relative mb-6 text-4xl transition-transform duration-300 group-hover:scale-110">
                {service.icon}
              </div>

              {/* Content */}
              <div className="relative">
                <h3 className="mb-3 text-xl font-semibold text-foreground transition-colors duration-300 group-hover:text-primary">
                  {service.title}
                </h3>
                <p className="mb-6 text-muted-foreground leading-relaxed">
                  {service.description}
                </p>

                {/* Tech tags with staggered animation */}
                <div className="flex flex-wrap gap-2">
                  {service.technologies.map((tech, techIndex) => (
                    <span
                      key={tech}
                      className="rounded-full bg-muted px-3 py-1 text-sm font-medium text-muted-foreground transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                      style={{
                        opacity: visibleCards[index] ? 1 : 0,
                        transform: visibleCards[index] ? 'translateY(0)' : 'translateY(10px)',
                        transitionDelay: `${index * 150 + techIndex * 100 + 400}ms`,
                      }}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </GridSection>
  );
}
