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
        success: 'bg-success-background text-success-600 flex w-fit items-center gap-1 rounded-[2px] border-0 px-2 py-1 text-[10px] font-normal',
        error: 'bg-error-background text-error-800 flex w-fit items-center gap-1 rounded-[2px] border-0 px-2 py-1 text-[10px] font-normal',
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
