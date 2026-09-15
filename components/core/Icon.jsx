import React from 'react';
/* Lucide (outline, 1.5px) is the brand icon set. The UMD build is loaded from CDN by the
   host page (see readme ICONOGRAPHY); this wrapper turns a lucide icon node into an SVG. */
const pascal = n => String(n).replace(/(^|[-_ ])(\w)/g, (_, __, c) => c.toUpperCase());
export function Icon({ name, size = 20, strokeWidth = 1.5, color = 'currentColor', title, style, ...rest }) {
  const lib = typeof window !== 'undefined' && window.lucide && window.lucide.icons;
  let node = lib ? lib[pascal(name)] : null;
  if (node && node[0] === 'svg') node = node[2] || [];
  const kids = Array.isArray(node)
    ? node.filter(Array.isArray).map(([tag, attrs], i) => React.createElement(tag, { ...attrs, key: i }))
    : null;
  return React.createElement('svg', {
    width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color,
    strokeWidth, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': title ? undefined : true,
    role: title ? 'img' : undefined,
    style: { display: 'block', flex: '0 0 auto', ...style }, ...rest
  }, title ? [React.createElement('title', { key: 't' }, title), kids] : kids);
}
