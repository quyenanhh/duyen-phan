/**
 * Scannable admin data table: uppercase caption header on sunken cream, 52px rows, hairline dividers.
 * @startingPoint section="Data" subtitle="Admin data table with status chips" viewport="700x320"
 */
export interface DataTableColumn<T = any> {
  key: string;
  label: React.ReactNode;
  align?: 'left' | 'right' | 'center';
  width?: number | string;
  /** render tabular content, e.g. a StatusChip or formatted ₫ amount */
  render?: (row: T) => React.ReactNode;
  sortable?: boolean;
  muted?: boolean;
}
export interface DataTableProps<T = any> {
  columns: DataTableColumn<T>[];
  rows: T[];
  onRowClick?: (row: T) => void;
  emptyText?: string;
  style?: React.CSSProperties;
}
export function DataTable(props: DataTableProps): JSX.Element;
