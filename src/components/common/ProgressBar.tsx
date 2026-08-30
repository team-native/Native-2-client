type ProgressTone = 'brand' | 'success' | 'danger';

const TRACK_CLASSES: Record<ProgressTone, string> = {
  brand: 'bg-[#eaf0f8]',
  success: 'bg-success-bg-strong',
  danger: 'bg-danger-track',
};

const FILL_CLASSES: Record<ProgressTone, string> = {
  brand: 'bg-brand-blue',
  success: 'bg-success',
  danger: 'bg-danger',
};

interface ProgressBarProps {
  percent: number;
  tone?: ProgressTone;
  thickness?: 'sm' | 'md';
  className?: string;
}

export default function ProgressBar({
  percent,
  tone = 'brand',
  thickness = 'sm',
  className = '',
}: ProgressBarProps) {
  const clamped = Math.min(100, Math.max(0, percent));
  const height = thickness === 'md' ? 'h-3.5' : 'h-2.5';

  return (
    <div
      className={`w-full overflow-hidden rounded-full ${height} ${TRACK_CLASSES[tone]} ${className}`}
      role="progressbar"
      aria-valuenow={clamped}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={`h-full rounded-full transition-all duration-500 ${FILL_CLASSES[tone]}`}
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
