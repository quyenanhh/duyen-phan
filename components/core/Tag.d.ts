/** Filter / attribute chip. Selectable and optionally removable. */
export interface TagProps {
  children?: React.ReactNode;
  selected?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  style?: React.CSSProperties;
}
export function Tag(props: TagProps): JSX.Element;
