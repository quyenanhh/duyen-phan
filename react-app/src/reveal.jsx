import { useEffect, useRef, useState } from 'react';

export function useInView() {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) { setInView(true); io.unobserve(el); }
      });
    }, { threshold: 0.18 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return [ref, inView];
}

export function Reveal({ children, delay = 0, style, className = '' }) {
  const [ref, inView] = useInView();
  return (
    <div ref={ref} className={`reveal${inView ? ' is-in' : ''}${className ? ' ' + className : ''}`} style={{ transitionDelay: `${delay}s`, ...style }}>
      {children}
    </div>
  );
}
