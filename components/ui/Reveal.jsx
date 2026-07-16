// Content is present on mount — no scroll-triggered fade-up (that "everything
// eases in as you scroll" pattern reads as generic/AI). Kept as a thin wrapper
// so every call site (className, and the now-ignored delay/y/once) still works.
export default function Reveal({ children, className = "" }) {
  return <div className={className}>{children}</div>;
}
