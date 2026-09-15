/** Rounded pill label. Use StatusChip for order/delivery status instead of raw tones. */
export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'accent' | 'success' | 'warning' | 'danger' | 'info';
  /** Lucide icon name */
  icon?: string;
  /** show a leading dot instead of an icon */
  dot?: boolean;
  style?: React.CSSProperties;
}
export function Badge(props: BadgeProps): JSX.Element;
