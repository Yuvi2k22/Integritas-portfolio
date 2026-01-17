import Link from 'next/link';
import { CheckIcon } from 'lucide-react';
import { Button } from '@workspace/ui/components/button';
import { cn } from '@workspace/ui/lib/utils';

interface PricingCardProps {
    title: string;
    price: string;
    description: string;
    features: string[];
    cta: string;
    href: string;
    highlight?: boolean;
}

export default function PricingCard({
    title,
    price,
    description,
    features,
    cta,
    href,
    highlight,
}: PricingCardProps) {
    return (
        <div
            className={cn(
                'flex flex-col rounded-2xl border p-8 transition-all hover:scale-105',
                highlight
                    ? 'border-primary bg-primary/5 shadow-2xl shadow-primary/20'
                    : 'border-border bg-card hover:border-primary/50'
            )}
        >
            <div className="mb-6">
                <h3 className="text-xl font-semibold text-foreground">{title}</h3>
                <p className="mt-2 text-3xl font-bold text-foreground">{price}</p>
                <p className="mt-2 text-sm text-muted-foreground">{description}</p>
            </div>

            <ul className="mb-8 flex-1 space-y-4">
                {features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <CheckIcon className="h-5 w-5 shrink-0 text-primary" />
                        <span>{feature}</span>
                    </li>
                ))}
            </ul>

            <Button
                asChild
                variant={highlight ? 'default' : 'outline'}
                className="w-full rounded-xl py-6 font-semibold hover:bg-primary "
            >
                <Link href={href}>{cta}</Link>
            </Button>
        </div>
    );
}
