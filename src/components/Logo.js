// The Medium ellipses, struck through. Not Medium.
export function LogoMark({ className = 'h-5 w-auto' }) {
  return (
    <svg viewBox="0 0 44 24" className={className} aria-hidden>
      <circle cx="11" cy="12" r="11" fill="currentColor" />
      <ellipse cx="29" cy="12" rx="5.2" ry="10.4" fill="currentColor" />
      <ellipse cx="40.5" cy="12" rx="2" ry="9.4" fill="currentColor" />
      <path d="M2 23 42 1" stroke="rgb(var(--bg))" strokeWidth="3.4" strokeLinecap="round" />
      <path d="M2 23 42 1" stroke="rgb(var(--accent))" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  );
}

export function Wordmark({ className = '' }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <LogoMark className="h-[18px] w-auto text-fg" />
      <span className="text-[15px] font-medium tracking-tight text-fg">
        <span className="font-serif text-[17px] italic text-muted">Not</span>Medium
      </span>
    </span>
  );
}
