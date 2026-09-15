/** Native select with brand chrome and a thin chevron. */
export interface SelectOption { value: string; label: string }
export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  options?: (SelectOption | string)[];
  size?: 'sm' | 'md' | 'lg';
  wrapperStyle?: React.CSSProperties;
}
export function Select(props: SelectProps): JSX.Element;
