/** Underlined tab row for in-page view switching. */
export interface TabItem { id: string; label: string; count?: number }
export interface TabsProps {
  items: (TabItem | string)[];
  value?: string;
  onChange?: (id: string) => void;
  style?: React.CSSProperties;
}
export function Tabs(props: TabsProps): JSX.Element;
