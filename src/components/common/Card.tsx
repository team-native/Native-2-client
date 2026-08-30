import type { HTMLAttributes, ReactNode } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode;
}

export default function Card({ children, className = '', ...rest }: CardProps) {
  return (
    <div
      className={`rounded-[20px] border border-border-subtle bg-white ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}
