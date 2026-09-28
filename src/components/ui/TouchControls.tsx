import type { PointerEvent } from "react";

type ControlKey = "KeyW" | "KeyA" | "KeyS" | "KeyD" | "Space";
const upArrow = "\u2191";

function sendControlEvent(
  name: "obby-control-start" | "obby-control-end",
  code: ControlKey,
) {
  window.dispatchEvent(new CustomEvent<string>(name, { detail: code }));
}

function TouchButton({
  code,
  label,
  children,
  className = "",
}: {
  code: ControlKey;
  label: string;
  children: string;
  className?: string;
}) {
  const press = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    sendControlEvent("obby-control-start", code);
  };
  const release = () => sendControlEvent("obby-control-end", code);

  return (
    <button
      className={`touch-control ${className}`}
      type="button"
      aria-label={label}
      data-tooltip={label}
      onPointerDown={press}
      onPointerUp={release}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <span className="touch-control__glyph">{children}</span>
    </button>
  );
}

export function TouchControls() {
  return (
    <div className="touch-controls" aria-label="Touch game controls">
      <div className="touch-dpad">
        <TouchButton
          code="KeyW"
          label="Move forward"
          className="touch-control--up"
        >
          {upArrow}
        </TouchButton>
        <TouchButton
          code="KeyA"
          label="Move left"
          className="touch-control--left"
        >
          {upArrow}
        </TouchButton>
        <TouchButton
          code="KeyS"
          label="Move backward"
          className="touch-control--down"
        >
          {upArrow}
        </TouchButton>
        <TouchButton
          code="KeyD"
          label="Move right"
          className="touch-control--right"
        >
          {upArrow}
        </TouchButton>
      </div>
      <TouchButton code="Space" label="Jump" className="touch-control--jump">
        Jump
      </TouchButton>
    </div>
  );
}
