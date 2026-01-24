"use client";
import React from "react";
import { cn } from "@workspace/ui/lib/utils";
import createGlobe from "cobe";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { IconBrandYoutubeFilled } from "@tabler/icons-react";
import dynamic from 'next/dynamic';

const DotLottiePlayer = dynamic(
    () => import('@dotlottie/react-player').then((mod) => mod.DotLottiePlayer),
    { ssr: false }
);

export default function FeaturesSectionDemo() {
    const features = [
        {
            title: "Strategic Design Thinking",
            description:
                "We don't just design interfaces; we craft intuitive user journeys that drive engagement and convert visitors into loyal customers.",
            skeleton: <SkeletonOne />,
            className:
                "col-span-1 lg:col-span-4 border-b lg:border-r border-neutral-200 dark:border-neutral-800",
        },
        {
            title: "AI-Powered Development",
            description:
                "Leverage cutting-edge AI to automate workflows, personalize experiences, and gain predictive insights instantly.",
            skeleton: <SkeletonTwo />,
            className: "border-b col-span-1 lg:col-span-2 border-neutral-200 dark:border-neutral-800",
        },
        {
            title: "Rapid Iteration & Delivery",
            description:
                "We adopt an agile approach to deliver value early and often, ensuring your product evolves with user feedback and market demands.",
            skeleton: <SkeletonThree />,
            className:
                "col-span-1 lg:col-span-3 lg:border-r border-neutral-200 dark:border-neutral-800",
        },
        {
            title: "Global Scalability",
            description:
                "Built on robust cloud infrastructure (AWS/Vercel) to ensure your application scales effortlessly from 10 to 10M users.",
            skeleton: <SkeletonFour />,
            className: "col-span-1 lg:col-span-3 border-b lg:border-none border-neutral-200",
        },
    ];
    return (
        <div className="relative z-20 py-10 lg:py-40 max-w-7xl mx-auto">
            <div className="px-8">
                <h4 className="text-3xl lg:text-5xl lg:leading-tight max-w-5xl mx-auto text-center tracking-tight font-medium text-black dark:text-white">
                    Choose Us
                </h4>

                <p className="text-sm lg:text-base  max-w-2xl  my-4 mx-auto text-neutral-500 text-center font-normal dark:text-neutral-300">
                    We combine aesthetic excellence with technical rigor. Here is how we turn your complex challenges into simple, powerful solutions.
                </p>
            </div>

            <div className="relative ">
                <div className="grid grid-cols-1 lg:grid-cols-6 mt-12 xl:border rounded-md border-neutral-200 dark:border-neutral-800">
                    {features.map((feature) => (
                        <FeatureCard key={feature.title} className={feature.className}>
                            <FeatureTitle>{feature.title}</FeatureTitle>
                            <FeatureDescription>{feature.description}</FeatureDescription>
                            <div className=" h-full w-full">{feature.skeleton}</div>
                        </FeatureCard>
                    ))}
                </div>
            </div>
        </div>
    );
}

const FeatureCard = ({
    children,
    className,
}: {
    children?: React.ReactNode;
    className?: string;
}) => {
    return (
        <div className={cn(`p-4 sm:p-8 relative overflow-hidden`, className)}>
            {children}
        </div>
    );
};

const FeatureTitle = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p className=" max-w-5xl mx-auto text-left tracking-tight text-black dark:text-white text-xl md:text-2xl md:leading-snug">
            {children}
        </p>
    );
};

const FeatureDescription = ({ children }: { children?: React.ReactNode }) => {
    return (
        <p
            className={cn(
                "text-sm md:text-base  max-w-4xl text-left mx-auto",
                "text-neutral-500 text-center font-normal dark:text-neutral-300",
                "text-left max-w-sm mx-0 md:text-sm my-2"
            )}
        >
            {children}
        </p>
    );
};

export const SkeletonOne = () => {
    return (
        <div className="relative flex py-8 px-2 gap-10 h-full">
            <div className="w-full  p-5  mx-auto bg-white dark:bg-neutral-900 shadow-2xl group h-full">
                <div className="flex flex-1 w-full h-full flex-col space-y-2  ">
                    <div className="h-full w-full p-16">
                        <DotLottiePlayer src="/Brainstorming.lottie" autoplay loop className="h-full w-full object-cover" />
                    </div>
                </div>
            </div>

            <div className="absolute bottom-0 z-40 inset-x-0 h-60 bg-gradient-to-t from-white dark:from-black via-white dark:via-black to-transparent w-full pointer-events-none" />
            <div className="absolute top-0 z-40 inset-x-0 h-60 bg-gradient-to-b from-white dark:from-black via-transparent to-transparent w-full pointer-events-none" />
        </div>
    );
};

export const SkeletonThree = () => {
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden bg-white dark:bg-neutral-900">
            <div className="relative h-full w-full flex items-center justify-center">
                <div className="h-[80%] w-[80%]">
                    <DotLottiePlayer src="/Accelerate%20your%20Testing.lottie" autoplay loop className="h-full w-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export const SkeletonTwo = () => {
    return (
        <div className="relative flex flex-col items-start p-8 gap-10 h-full overflow-hidden bg-white dark:bg-neutral-900">
            <div className="relative h-full w-full flex items-center justify-center">
                <div className="h-[60%] w-[60%]">
                    <DotLottiePlayer src="/AI%20animation.lottie" autoplay loop className="h-full w-full object-contain" />
                </div>
            </div>
        </div>
    );
};

export const SkeletonFour = () => {
    return (
        <div className="h-60 md:h-60  flex flex-col items-center relative bg-transparent dark:bg-transparent mt-10">
            <Globe className="absolute -right-10 md:-right-10 -bottom-80 md:-bottom-72" />
        </div>
    );
};

export const Globe = ({ className }: { className?: string }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        let phi = 0;

        if (!canvasRef.current) return;

        const globe = createGlobe(canvasRef.current, {
            devicePixelRatio: 2,
            width: 600 * 2,
            height: 600 * 2,
            phi: 0,
            theta: 0,
            dark: 1,
            diffuse: 1.2,
            mapSamples: 16000,
            mapBrightness: 6,
            baseColor: [0.3, 0.3, 0.3],
            markerColor: [0.1, 0.8, 1],
            glowColor: [1, 1, 1],
            markers: [
                // longitude latitude
                { location: [37.7595, -122.4367], size: 0.03 },
                { location: [40.7128, -74.006], size: 0.1 },
            ],
            onRender: (state) => {
                // Called on every animation frame.
                // `state` will be an empty object, return updated params.
                state.phi = phi;
                phi += 0.01;
            },
        });

        return () => {
            globe.destroy();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ width: 600, height: 600, maxWidth: "100%", aspectRatio: 1 }}
            className={className}
        />
    );
};
