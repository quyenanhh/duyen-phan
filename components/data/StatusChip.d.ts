/** Order / delivery / branch status pill — the single source of truth for status colour. */
export interface StatusChipProps {
  /** completed|paid|open = success · processing|pending = warning · delivering|scheduled = info · cancelled|late = danger · draft = neutral */
  status: 'completed' | 'paid' | 'open' | 'processing' | 'pending' | 'delivering' | 'scheduled' | 'cancelled' | 'late' | 'draft';
  /** override the Vietnamese default label */
  label?: string;
  style?: React.CSSProperties;
}
export function StatusChip(props: StatusChipProps): JSX.Element;
