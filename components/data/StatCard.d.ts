/** KPI tile for admin dashboards. */
export interface StatCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  /** small comparison line, e.g. "+8,2% so với hôm qua" */
  delta?: React.ReactNode;
  deltaTone?: 'success' | 'warning' | 'danger';
  icon?: string;
  style?: React.CSSProperties;
}
export function StatCard(props: StatCardProps): JSX.Element;
