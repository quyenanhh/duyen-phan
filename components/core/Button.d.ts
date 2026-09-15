/**
 * Primary action control.
 * @startingPoint section="Core" subtitle="Buttons, icon buttons, badges, tags" viewport="700x200"
 */
export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = green fill; accent = clay fill (landing CTAs); secondary = outlined; ghost; danger */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  /** Lucide icon name rendered before the label */
  icon?: string;
  /** Lucide icon name rendered after the label */
  iconRight?: string;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent) => void;
  style?: React.CSSProperties;
}
export function Button(props: ButtonProps): JSX.Element;
