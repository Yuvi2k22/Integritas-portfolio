"use client";

import React from "react";
import { motion } from "framer-motion";
import { cn } from "@workspace/ui/lib/utils";

export const SolutionCard = ({
    title,
    description,
    children,
    className,
    gradientFrom = "from-neutral-800",
    gradientTo = "to-neutral-950",
}: {
    title: string;
    description: string;
    children?: React.ReactNode;
    className?: string;
    gradientFrom?: string;
    gradientTo?: string;
}) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className={cn(
                "group relative flex w-full flex-col overflow-hidden rounded-3xl border border-border bg-card/50 backdrop-blur-xl transition-colors duration-500 hover:border-primary/20 hover:bg-card/80",
                className
            )}
        >
            <div className="relative z-10 flex h-full flex-col p-8">
                <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-full border border-border bg-secondary/10 shadow-sm">
                    {children}
                </div>
                <h3 className="mb-3 text-2xl font-bold text-card-foreground transition-colors group-hover:text-primary">
                    {title}
                </h3>
                <p className="text-muted-foreground transition-colors group-hover:text-foreground">
                    {description}
                </p>
            </div>

            {/* Background Gradient/Noise/Texture */}
            <div className={cn(
                "absolute inset-0 z-0 opacity-20 transition-opacity duration-500 group-hover:opacity-40 bg-gradient-to-br",
                gradientFrom,
                gradientTo
            )} />

            {/* Glow Effect */}
            <div className="absolute -right-20 -top-20 z-0 h-[300px] w-[300px] rounded-full bg-indigo-500/20 blur-[100px] transition-all duration-500 group-hover:bg-indigo-500/30" />
            <div className="absolute -left-20 -bottom-20 z-0 h-[300px] w-[300px] rounded-full bg-purple-500/20 blur-[100px] transition-all duration-500 group-hover:bg-purple-500/30" />

        </motion.div>
    );
};
