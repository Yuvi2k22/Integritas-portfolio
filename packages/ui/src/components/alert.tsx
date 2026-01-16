import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '../lib/utils';

const alertVariants = cva(
  'relative w-full rounded-lg border p-4 text-foreground [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground [&svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-background',
        info: 'border-transparent bg-blue-500/10',
        warning: 'border-transparent bg-yellow-500/10',
        destructive: 'border-transparent bg-destructive/10',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type AlertElement = HTMLDivElement;
export type AlertProps = React.HTMLAttributes<HTMLDivElement> &
  VariantProps<typeof alertVariants>;
const Alert = React.forwardRef<AlertElement, AlertProps>(
  ({ className, variant, ...props }, ref) => (
    <div
      ref={ref}
      role="alert"
      className={cn(alertVariants({ variant }), className)}
      {...props}
    />
  ),
);
Alert.displayName = 'Alert';

export type AlertTitleElement = HTMLHeadingElement;
export type AlertTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
const AlertTitle = React.forwardRef<AlertTitleElement, AlertTitleProps>(
  ({ className, ...props }, ref) => (
    <h5
      ref={ref}
      className={cn('mb-1 font-medium leading-none tracking-tight', className)}
      {...props}
    />
  ),
);
AlertTitle.displayName = 'AlertTitle';

export type AlertDescriptionElement = HTMLDivElement;
export type AlertDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
const AlertDescription = React.forwardRef<
  AlertDescriptionElement,
  AlertDescriptionProps
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-sm [&_p]:leading-relaxed', className)}
    {...props}
  />
));
AlertDescription.displayName = 'AlertDescription';

// AlertIcon Component
const AlertIcon = React.forwardRef<SVGSVGElement, any>(
  ({ className, ...props }, ref) => (
    <svg
      ref={ref}
      className={cn('h-5 w-5', className)}
      viewBox="0 0 24 24"
      fill="none"
      {...props}
    >
      {/* You can customize the icon based on the alert type */}
      <path d="M12 4v16m8-8H4" stroke="currentColor" strokeWidth="2" />
    </svg>
  ),
);
AlertIcon.displayName = 'AlertIcon';

export { Alert, AlertDescription, AlertTitle, AlertIcon };
