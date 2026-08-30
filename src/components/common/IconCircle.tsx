import type { ReactNode } from 'react';

type IconTone = 'brand' | 'success' | 'warning' | 'danger';

const TONE_CLASSES: Record<IconTone, string> = {
  brand: 'bg-brand-blue-bg text-brand-blue',
  success: 'bg-success-bg text-success',
  warning: 'bg-warning-bg text-warning',
  danger: 'bg-danger-bg text-danger',
};

interface IconCircleProps {
  children: ReactNode;
  tone?: IconTone;
  size?: number;
  rounded?: string;
  className?: string;
}


export default function IconCircle({
  children,
  tone = 'brand',
  size = 42,
  rounded = 'rounded-xl',
  className = '',
}: IconCircleProps) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center font-semibold ${rounded} ${TONE_CLASSES[tone]} ${className}`}
      style={{ width: size, height: size }}
    >
      {children}
    </div>
  );
}
