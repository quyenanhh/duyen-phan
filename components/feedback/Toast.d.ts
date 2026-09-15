/** Transient confirmation, bottom-right stack. Warm white card, no coloured fill. */
export interface ToastProps {
  tone?: 'success' | 'warning' | 'danger' | 'info';
  title: React.ReactNode;
  description?: React.ReactNode;
  onClose?: () => void;
  style?: React.CSSProperties;
}
export function Toast(props: ToastProps): JSX.Element;
