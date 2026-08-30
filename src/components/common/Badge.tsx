import type { ReactNode } from 'react';

type BadgeTone = 'brand' | 'success' | 'warning' | 'danger';

const TONE_CLASSES: Record<BadgeTone, string> = {
  brand: 'bg-brand-blue-bg text-brand-blue',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
}

export default function Badge({ children, tone = 'brand', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3.5 py-1.5 text-[13px] font-medium whitespace-nowrap ${TONE_CLASSES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
