/** Checkbox with 6px radius box and green fill when on. */
export interface CheckboxProps {
  label?: React.ReactNode;
  checked?: boolean;
  indeterminate?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}
export function Checkbox(props: CheckboxProps): JSX.Element;
