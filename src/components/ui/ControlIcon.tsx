type ControlIconProps = { name: "skip" | "rate" | "music" | "muted" | "popups" };

export function ControlIcon({ name }: ControlIconProps) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  return <svg className="control-icon" viewBox="0 0 24 24" aria-hidden="true">
    {name === "skip" && <><path {...common} d="m5 5 8 7-8 7V5Z" /><path {...common} d="m13 5 7 7-7 7V5Z" /></>}
    {name === "rate" && <path {...common} d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2L3 9.7l6.2-.9L12 3Z" />}
    {name === "music" && <><path {...common} d="M9 18V6l10-2v12" /><path {...common} d="M9 10 19 8" /><circle {...common} cx="6" cy="18" r="3" /><circle {...common} cx="16" cy="16" r="3" /></>}
    {name === "muted" && <><path {...common} d="M9 18V6l7-1.5v11.2" /><circle {...common} cx="6" cy="18" r="3" /><circle {...common} cx="13" cy="16" r="3" /><path {...common} d="m18 5 4 4m0-4-4 4" /></>}
    {name === "popups" && <><rect {...common} x="4" y="5" width="16" height="14" rx="2" /><path {...common} d="M8 9h8M8 13h5" /></>}
  </svg>;
}
