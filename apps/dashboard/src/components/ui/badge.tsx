import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';

import * as React from 'react';

const badgeVariants = cva(
  'inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
  {
    variants: {
      variant: {
        default:
          'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80',
        secondary:
          'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80',
        destructive:
          'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80',
        outline: 'text-foreground',
        success: 'flex w-fit items-center gap-1 rounded-[2px] border-0 bg-success-background px-2 py-1 text-[10px] font-normal text-success-600',
        error: 'flex w-fit items-center gap-1 rounded-[2px] border-0 bg-error-background px-2 py-1 text-[10px] font-normal text-error-800',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export type BadgeProps = {} & React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof badgeVariants>;

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
