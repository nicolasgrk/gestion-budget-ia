import { forwardRef, LabelHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const Label = forwardRef<HTMLLabelElement, LabelHTMLAttributes<HTMLLabelElement>>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          "text-sm font-medium text-white/90",
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = "Label";

export { Label }; 