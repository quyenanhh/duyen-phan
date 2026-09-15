/** On/off toggle for instant-effect settings (dish availability, branch open). */
export interface SwitchProps {
  label?: React.ReactNode;
  checked?: boolean;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  style?: React.CSSProperties;
}
export function Switch(props: SwitchProps): JSX.Element;
