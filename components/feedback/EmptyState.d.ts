/** Friendly empty / zero-result placeholder inside a Card or table area. */
export interface EmptyStateProps {
  /** Lucide icon name, default "soup" */
  icon?: string;
  title: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
  style?: React.CSSProperties;
}
export function EmptyState(props: EmptyStateProps): JSX.Element;
