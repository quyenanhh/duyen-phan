/**
 * Single-line text field with label, hint and error states.
 * @startingPoint section="Forms" subtitle="Inputs, select, checkbox, radio, switch" viewport="700x300"
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  /** replaces hint and turns the border rust */
  error?: React.ReactNode;
  /** leading Lucide icon */
  icon?: string;
  /** trailing static text, e.g. "₫" */
  suffix?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  wrapperStyle?: React.CSSProperties;
}
export function Input(props: InputProps): JSX.Element;
