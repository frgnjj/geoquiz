/** A faint line globe, drawn like the logo. Cards tilt it like the Earth's axis. */
export default function Globe({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke="currentColor" aria-hidden="true" className={className}>
      <g strokeWidth={0.5}>
        <circle cx="100" cy="100" r="96" />
        <ellipse cx="100" cy="100" rx="32" ry="96" />
        <ellipse cx="100" cy="100" rx="64" ry="96" />
        <path d="M100 4v192M4 100h192M16.9 52h166.2M16.9 148h166.2M36.5 28h127M36.5 172h127" />
      </g>
    </svg>
  );
}
