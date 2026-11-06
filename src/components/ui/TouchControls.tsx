import { useRef, useState, type PointerEvent } from "react";

type ControlKey = "KeyW" | "KeyA" | "KeyS" | "KeyD" | "Space";
type ControlKeys = ControlKey | ControlKey[];

function sendControlEvent(
  name: "obby-control-start" | "obby-control-end",
  codes: ControlKeys,
) {
  const keys = Array.isArray(codes) ? codes : [codes];
  keys.forEach((code) =>
    window.dispatchEvent(new CustomEvent<string>(name, { detail: code })),
  );
}

function TouchButton({
  codes,
  label,
  children,
  className = "",
}: {
  codes: ControlKeys;
  label: string;
  children: string;
  className?: string;
}) {
  const activePointers = useRef(new Set<number>());

  const press = (event: PointerEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.currentTarget.setPointerCapture(event.pointerId);
    if (activePointers.current.size === 0) {
      sendControlEvent("obby-control-start", codes);
    }
    activePointers.current.add(event.pointerId);
  };
  const release = (pointerId: number) => {
    const wasActive = activePointers.current.delete(pointerId);
    if (wasActive && activePointers.current.size === 0) {
      sendControlEvent("obby-control-end", codes);
    }
  };

  return (
    <button
      className={`touch-control ${className}`}
      type="button"
      aria-label={label}
      data-tooltip={label}
      onPointerDown={press}
      onPointerUp={(event) => release(event.pointerId)}
      onPointerCancel={(event) => release(event.pointerId)}
      onLostPointerCapture={(event) => release(event.pointerId)}
    >
      <span className="touch-control__glyph">{children}</span>
    </button>
  );
}

function Joystick() {
  const activePointer = useRef<number | null>(null);
  const activeCodes = useRef<ControlKey[]>([]);
  const [knob, setKnob] = useState({ x: 0, y: 0, active: false });

  const setCodes = (nextCodes: ControlKey[]) => {
    if (activeCodes.current.join() === nextCodes.join()) return;
    if (activeCodes.current.length) {
      sendControlEvent("obby-control-end", activeCodes.current);
    }
    if (nextCodes.length) {
      sendControlEvent("obby-control-start", nextCodes);
    }
    activeCodes.current = nextCodes;
  };

  const updateJoystick = (event: PointerEvent<HTMLDivElement>) => {
    const bounds = event.currentTarget.getBoundingClientRect();
    const radius = bounds.width / 2;
    const rawX = event.clientX - bounds.left - radius;
    const rawY = event.clientY - bounds.top - radius;
    const distance = Math.hypot(rawX, rawY);
    const maxDistance = radius * 0.58;
    const scale = distance > maxDistance ? maxDistance / distance : 1;
    const x = rawX * scale;
    const y = rawY * scale;
    const threshold = radius * 0.2;
    const nextCodes: ControlKey[] = [];

    if (y < -threshold) nextCodes.push("KeyW");
    if (y > threshold) nextCodes.push("KeyS");
    if (x < -threshold) nextCodes.push("KeyA");
    if (x > threshold) nextCodes.push("KeyD");

    setKnob({ x, y, active: true });
    setCodes(nextCodes);
  };

  const release = () => {
    setCodes([]);
    activePointer.current = null;
    setKnob({ x: 0, y: 0, active: false });
  };

  return (
    <div
      className="touch-joystick"
      role="application"
      aria-label="Movement joystick"
      onPointerDown={(event) => {
        event.preventDefault();
        activePointer.current = event.pointerId;
        event.currentTarget.setPointerCapture(event.pointerId);
        updateJoystick(event);
      }}
      onPointerMove={(event) => {
        if (event.pointerId === activePointer.current) updateJoystick(event);
      }}
      onPointerUp={(event) => {
        if (event.pointerId === activePointer.current) release();
      }}
      onPointerCancel={release}
      onLostPointerCapture={release}
    >
      <span className="touch-joystick__ring" />
      <span
        className={`touch-joystick__knob${knob.active ? " is-active" : ""}`}
        style={{ transform: `translate(${knob.x}px, ${knob.y}px)` }}
      />
    </div>
  );
}

export function TouchControls() {
  return (
    <div className="touch-controls" aria-label="Touch game controls">
      <p className="touch-controls__hint">Drag to move · Tap Jump</p>
      <Joystick />
      <TouchButton codes="Space" label="Jump" className="touch-control--jump">
        Jump
      </TouchButton>
    </div>
  );
}
