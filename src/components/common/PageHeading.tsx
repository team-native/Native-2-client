import type { ReactNode } from 'react';
import Badge from './Badge';

interface PageHeadingProps {
  eyebrow: string;
  title: ReactNode;
  description?: ReactNode;
  className?: string;
}

export default function PageHeading({ eyebrow, title, description, className = '' }: PageHeadingProps) {
  return (
    <div className={className}>
      <Badge tone="brand">{eyebrow}</Badge>
      <h1 className="mt-6 text-[32px] leading-tight font-bold text-ink-900 sm:text-[42px]">
        {title}
      </h1>
      {description && (
        <p className="mt-5 max-w-3xl text-[16px] leading-relaxed text-ink-500 sm:text-[18px]">
          {description}
        </p>
      )}
    </div>
  );
}
