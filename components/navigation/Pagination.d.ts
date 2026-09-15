/** Table footer pager. Sits inside the Card that holds the DataTable. */
export interface PaginationProps {
  page?: number;
  pageCount?: number;
  /** total record count shown in the summary line */
  total?: number;
  onChange?: (page: number) => void;
  style?: React.CSSProperties;
}
export function Pagination(props: PaginationProps): JSX.Element;
