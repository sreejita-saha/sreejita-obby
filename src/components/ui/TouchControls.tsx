import type { PointerEvent } from "react";

type ControlKey = "KeyW" | "KeyA" | "KeyS" | "KeyD" | "Space";

function sendControlEvent(name: "obby-control-start" | "obby-control-end", code: ControlKey) {
  window.dispatchEvent(new CustomEvent<string>(name, { detail: code }));
}

function TouchButton({ code, label, className = "" }: { code: ControlKey; label: string; className?: string }) {
  const press = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    sendControlEvent("obby-control-start", code);
  };
  const release = () => sendControlEvent("obby-control-end", code);

  return <button className={`touch-control ${className}`} type="button" aria-label={label} onPointerDown={press} onPointerUp={release} onPointerCancel={release} onLostPointerCapture={release}>{label}</button>;
}

/** Touch-only controls; keyboard controls remain available on larger screens. */
export function TouchControls() {
  return (
    <div className="touch-controls" aria-label="Touch game controls">
      <div className="touch-dpad">
        <TouchButton code="KeyW" label="Move forward" className="touch-control--up" />
        <TouchButton code="KeyA" label="Move left" className="touch-control--left" />
        <TouchButton code="KeyS" label="Move backward" className="touch-control--down" />
        <TouchButton code="KeyD" label="Move right" className="touch-control--right" />
      </div>
      <TouchButton code="Space" label="Jump" className="touch-control--jump" />
    </div>
  );
}
