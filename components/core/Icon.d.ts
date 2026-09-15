/** Outline icon from the Lucide set (1.5px stroke). Requires the Lucide UMD script on the page. */
export interface IconProps {
  /** Lucide icon name, kebab or Pascal: "leaf", "shopping-bag", "Truck" */
  name: string;
  /** px, default 20 */
  size?: number;
  /** default 1.5 — never go above 2 */
  strokeWidth?: number;
  /** default currentColor */
  color?: string;
  /** accessible label; omitted icons are aria-hidden */
  title?: string;
  style?: React.CSSProperties;
}
export function Icon(props: IconProps): JSX.Element;
