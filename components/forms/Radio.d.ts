/** Single-choice control; group by shared `name`. */
export interface RadioProps {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}
export function Radio(props: RadioProps): JSX.Element;
