export const IconProps = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

export function LeafIcon({ size = 18, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}>
      <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.5 19 2c1 2 1 5 1 6 0 8.7-8 12-9 12Z" />
      <path d="M2 21c0-3 1.9-5.4 5.1-6" />
    </svg>
  );
}

export function ChevronDown({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="m6 9 6 6 6-6" /></svg>;
}

export function ChevronRight({ size = 15, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="m9 18 6-6-6-6" /></svg>;
}

export function ChevronLeft({ size = 15, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="m15 18-6-6 6-6" /></svg>;
}

export function XIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M18 6 6 18" /><path d="m6 6 12 12" /></svg>;
}

export function CheckIcon({ size = 13, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" style={style}><path d="M20 6 9 17l-5-5" /></svg>;
}

export function SearchIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" /></svg>;
}

export function TrashIcon({ size = 16, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}>
      <path d="M3 6h18" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" /><path d="M10 11v6" /><path d="M14 11v6" />
    </svg>
  );
}

export function PauseUserIcon({ size = 16, style }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}>
      <circle cx="10" cy="8" r="4" /><path d="M2 21v-1a8 8 0 0 1 12.8-6.4" /><path d="m17 8 5 5" /><path d="m22 8-5 5" />
    </svg>
  );
}

export function PersonIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
}

export function LogoutIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" /><path d="M16 17l5-5-5-5" /><path d="M21 12H9" /></svg>;
}

export function LoginArrowIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" /><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /></svg>;
}

export function EyeIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7-10-7-10-7Z" /><circle cx="12" cy="12" r="3" /></svg>;
}

export function EyeOffIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M9.9 4.24A9.7 9.7 0 0 1 12 4c6.4 0 10 7 10 7a17.6 17.6 0 0 1-2.35 3.19" /><path d="M6.6 6.6C4 8.3 2 11 2 11s3.6 7 10 7a9.7 9.7 0 0 0 4.24-.93" /><path d="M9.5 9.5a3 3 0 0 0 4.24 4.24" /><path d="M2 2l20 20" /></svg>;
}

export function CopyIcon({ size = 15, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><rect x="9" y="9" width="12" height="12" rx="2" /><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" /></svg>;
}

export function EditIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>;
}

export function PowerIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M12 2v8" /><path d="M18.4 6.6a9 9 0 1 1-12.8 0" /></svg>;
}

export function MapPinIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" /></svg>;
}

export function PackageIcon({ size = 16, style }) {
  return <svg width={size} height={size} viewBox="0 0 24 24" {...IconProps} style={style}><path d="m21 8-9-5-9 5 9 5 9-5Z" /><path d="M3 8v8l9 5 9-5V8" /><path d="M12 13v8" /></svg>;
}
