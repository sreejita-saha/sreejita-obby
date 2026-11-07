import type { ReactNode } from "react";

type ToggleControlProps = {
  className: string;
  enabled: boolean;
  label: string;
  tooltip: string;
  onToggle: () => void;
  children: ReactNode;
};

/** Shared button shell for a setting that has only on and off states. */
export function ToggleControl({
  className,
  enabled,
  label,
  tooltip,
  onToggle,
  children,
}: ToggleControlProps) {
  return (
    <button
      className={`${className} ${enabled ? "is-on" : "is-off"}`}
      type="button"
      onClick={onToggle}
      aria-pressed={enabled}
      aria-label={label}
      data-tooltip={tooltip}
      data-tooltip-lock-side="true"
    >
      {children}
    </button>
  );
}
