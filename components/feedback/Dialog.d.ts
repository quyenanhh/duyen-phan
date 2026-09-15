/** Centred modal on a warm ink scrim. 12px radius, 480px default width. */
export interface DialogProps {
  open?: boolean;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children?: React.ReactNode;
  /** action row, right-aligned — secondary then primary */
  footer?: React.ReactNode;
  width?: number;
  onClose?: () => void;
}
export function Dialog(props: DialogProps): JSX.Element | null;
