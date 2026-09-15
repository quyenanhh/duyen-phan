/** Multi-line text field. Same chrome as Input. */
export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: React.ReactNode;
  hint?: React.ReactNode;
  error?: React.ReactNode;
  rows?: number;
  wrapperStyle?: React.CSSProperties;
}
export function Textarea(props: TextareaProps): JSX.Element;
