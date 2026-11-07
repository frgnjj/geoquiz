"use client";

/** A two-way switch: one track, with the chosen side raised. */
export default function Segmented({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div role="group" aria-label={label} className="grid grid-flow-col auto-cols-fr rounded-xl bg-line/60 p-1">
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-2 py-2 text-sm font-medium whitespace-nowrap transition sm:px-4 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-foreground ${
            value === o.id ? "bg-surface text-foreground shadow-sheet" : "text-muted hover:text-foreground"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
