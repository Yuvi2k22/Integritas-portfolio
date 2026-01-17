'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  MonitorIcon,
  SmartphoneIcon,
  LayersIcon,
  CloudIcon,
  ChevronRightIcon
} from 'lucide-react';

import { routes } from '@workspace/routes';
import { Badge } from '@workspace/ui/components/badge';
import { buttonVariants } from '@workspace/ui/components/button';
import { Separator } from '@workspace/ui/components/separator';
import { cn } from '@workspace/ui/lib/utils';

import { GridSection } from '~/components/fragments/grid-section';

// --- Services Data ---
const SERVICES = [
  {
    title: 'Web Development',
    description: 'High-performance, SEO-optimized web applications built with modern frameworks.',
    technologies: ['Next.js', 'React', 'TypeScript', 'Node.js'],
    icon: <MonitorIcon className="size-6 text-blue-500" />,
  },
  {
    title: 'Mobile App Development',
    description: 'Native-feel cross-platform mobile solutions for iOS and Android devices.',
    technologies: ['React Native', 'Flutter', 'Firebase', 'Expo'],
    icon: <SmartphoneIcon className="size-6 text-purple-500" />,
  },
  {
    title: 'Backend & Architecture',
    description: 'Robust server-side systems designed for security, speed, and scalability.',
    technologies: ['.NET', 'Python', 'PostgreSQL', 'Docker'],
    icon: <LayersIcon className="size-6 text-emerald-500" />,
  },
  {
    title: 'Cloud & DevOps',
    description: 'Reliable cloud infrastructure management and automated CI/CD pipelines.',
    technologies: ['AWS', 'Azure', 'Vercel', 'Terraform'],
    icon: <CloudIcon className="size-6 text-sky-500" />,
  },
];

// --- Sub-Components ---

function HeroPill(): React.JSX.Element {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: -20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="flex items-center justify-center"
    >
      <Link href="/contact">
        <Badge
          variant="outline"
          className="group h-8 rounded-full px-3 text-xs font-medium shadow-sm duration-200 hover:bg-accent/50 sm:text-sm"
        >
          <div className="w-fit py-0.5 text-center text-xs text-blue-500 sm:text-sm">
            New!
          </div>
          <Separator orientation="vertical" className="mx-2" />
          Now accepting new development projects
          <ChevronRightIcon className="ml-1.5 size-3 shrink-0 text-foreground transition-transform group-hover:translate-x-0.5" />
        </Badge>
      </Link>
    </motion.div>
  );
}

function HeroTitle(): React.JSX.Element {
  return (
    <motion.div
      initial={{ filter: 'blur(10px)', opacity: 0, y: 20 }}
      animate={{ filter: 'blur(0px)', opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.4 }}
    >
      <h1 className="mt-6 text-center text-[48px] font-bold leading-[54px] tracking-[-1.2px] [font-kerning:none] sm:text-[56px] md:text-[64px] lg:text-[76px] lg:leading-[74px] lg:tracking-[-2px]">
        Engineering the Future of
        <br /> Your Digital Ecosystem
      </h1>
    </motion.div>
  );
}

function HeroDescription(): React.JSX.Element {
  return (
    <motion.p
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4, duration: 0.4 }}
      className="mx-auto mt-3 max-w-[560px] text-balance text-center text-lg leading-[26px] text-muted-foreground sm:text-xl lg:mt-6"
    >
      We build high-performance web and mobile applications that turn complex technology into seamless user experiences.
    </motion.p>
  );
}

function HeroButtons(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.4 }}
      className="mx-auto flex w-full flex-col gap-2 px-7 sm:w-auto sm:flex-row sm:px-0"
    >
      <Link
        href={routes.dashboard.auth.SignUp}
        className={cn(buttonVariants({ variant: 'default' }), 'h-10 rounded-xl sm:h-9')}
      >
        Start for free
      </Link>
      <Link
        href={routes.marketing.Contact}
        className={cn(buttonVariants({ variant: 'outline' }), 'h-10 rounded-xl sm:h-9')}
      >
        Talk to sales
      </Link>
    </motion.div>
  );
}

// --- NEW HEADER COMPONENT ---
function ServicesHeader(): React.JSX.Element {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8, duration: 0.4 }}
      className="mt-20 flex flex-col items-center gap-2"
    >
       <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-500">
        Expertise
      </span>
      <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Services We Offer
      </h2>
      <div className="mt-2 h-1 w-12 rounded-full bg-blue-500/20" />
    </motion.div>
  );
}

function MainDashedGridLines(): React.JSX.Element {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.6, duration: 0.4 }}
    >
      <svg className="absolute left-[16.85%] top-0 hidden h-full w-px [mask-image:linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line x1="0.5" y1="0" x2="0.5" y2="100%" strokeLinecap="round" strokeDasharray="5 5" stroke="hsl(var(--border))" />
      </svg>
      <svg className="absolute right-[16.85%] top-0 hidden h-full w-px [mask-image:linear-gradient(to_bottom,#0000,#000_128px,#000_calc(100%-24px),#0000)] lg:block">
        <line x1="0.5" y1="0" x2="0.5" y2="100%" strokeLinecap="round" strokeDasharray="5 5" stroke="hsl(var(--border))" />
      </svg>
    </motion.div>
  );
}

function HeroIllustration(): React.JSX.Element {
  const [visibleCards, setVisibleCards] = React.useState<boolean[]>(new Array(SERVICES.length).fill(false));
  const cardsRef = React.useRef<(HTMLDivElement | null)[]>([]);

  React.useEffect(() => {
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
        { threshold: 0.1 }
      );
      if (card) observer.observe(card);
      return observer;
    });
    return () => observers.forEach((obs) => obs.disconnect());
  }, []);

  return (
    <div className="relative mt-8 w-full max-w-5xl mx-auto px-4">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-2">
        {SERVICES.map((service, index) => (
          <motion.div
            key={index}
            ref={(el) => { cardsRef.current[index] = el; }}
            initial={{ opacity: 0, y: 20 }}
            animate={visibleCards[index] ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="group relative overflow-hidden rounded-2xl border border-border bg-card/50 p-5 text-left transition-all duration-500 hover:border-primary/50 hover:shadow-xl"
          >
            <div className="absolute -right-8 -top-8 size-24 rounded-full bg-primary/5 blur-2xl opacity-0 transition-opacity group-hover:opacity-100" />
            
            <div className="flex items-start gap-4">
              <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-secondary group-hover:bg-primary/10 transition-colors">
                {service.icon}
              </div>
              <div>
                <h3 className="text-lg font-bold tracking-tight text-foreground mb-1">
                  {service.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  {service.description}
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {service.technologies.slice(0, 3).map((tech) => (
                    <span key={tech} className="rounded-md border border-border bg-muted/30 px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// --- Main Export ---

export function Hero(): React.JSX.Element {
  return (
    <GridSection className="overflow-x-hidden pb-20">
      <MainDashedGridLines />
      <div className="mx-auto mt-16 flex flex-col gap-6 px-2 sm:mt-20 sm:px-1 md:mt-24 lg:mt-32 text-center">
        <div className="flex flex-col gap-2">
          <HeroPill />
          <HeroTitle />
        </div>
        <HeroDescription />
        <HeroButtons />
        
        {/* New Header placed here */}
        <ServicesHeader />
        
        <HeroIllustration />
      </div>
    </GridSection>
  );
}