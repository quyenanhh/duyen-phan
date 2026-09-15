/**
 * Fixed left navigation for the admin console (248px, white on cream page).
 * @startingPoint section="Navigation" subtitle="Admin sidebar, tabs, pagination" viewport="700x360"
 */
export interface SidebarItem {
  id?: string;
  label?: string;
  /** Lucide icon name */
  icon?: string;
  /** count pill on the right */
  badge?: string | number;
  /** render as an uppercase section label instead of a link */
  section?: string;
}
export interface SidebarProps {
  brand?: string;
  subtitle?: string;
  items: SidebarItem[];
  active?: string;
  onSelect?: (id: string) => void;
  footer?: React.ReactNode;
  style?: React.CSSProperties;
}
export function Sidebar(props: SidebarProps): JSX.Element;
