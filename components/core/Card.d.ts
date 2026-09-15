/**
 * Surface container: white, 1px warm border, 12px radius, very light warm shadow.
 * @startingPoint section="Core" subtitle="Card surface with header + actions" viewport="700x260"
 */
export interface CardProps {
  children?: React.ReactNode;
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** right-aligned header slot, usually a Button or IconButton */
  actions?: React.ReactNode;
  /** inner padding in px, default 24 */
  padding?: number;
  tone?: 'card' | 'sunken' | 'soft';
  /** lift + deeper shadow on hover (use for clickable cards only) */
  hoverable?: boolean;
  style?: React.CSSProperties;
}
export function Card(props: CardProps): JSX.Element;
