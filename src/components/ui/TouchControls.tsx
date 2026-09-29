import { useRef, type PointerEvent } from "react";

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

export function TouchControls() {
  return (
    <div className="touch-controls" aria-label="Touch game controls">
      <div className="touch-dpad">
        <TouchButton
          codes="KeyW"
          label="Move forward"
          className="touch-control--up"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes="KeyA"
          label="Move left"
          className="touch-control--left"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes="KeyS"
          label="Move backward"
          className="touch-control--down"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes="KeyD"
          label="Move right"
          className="touch-control--right"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes={["KeyW", "KeyA"]}
          label="Move forward and left"
          className="touch-control--up-left"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes={["KeyW", "KeyD"]}
          label="Move forward and right"
          className="touch-control--up-right"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes={["KeyS", "KeyA"]}
          label="Move backward and left"
          className="touch-control--down-left"
        >
          {"\u2191"}
        </TouchButton>
        <TouchButton
          codes={["KeyS", "KeyD"]}
          label="Move backward and right"
          className="touch-control--down-right"
        >
          {"\u2191"}
        </TouchButton>
      </div>
      <TouchButton codes="Space" label="Jump" className="touch-control--jump">
        Jump
      </TouchButton>
    </div>
  );
}
