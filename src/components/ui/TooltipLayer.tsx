import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type TooltipTarget = {
  element: HTMLElement;
  label: string;
  position: "top" | "bottom";
};

function getTarget(node: EventTarget | null) {
  return node instanceof Element
    ? node.closest<HTMLElement>("[data-tooltip]")
    : null;
}

/** Renders tooltips at document level so panels and the app shell cannot clip them. */
export function TooltipLayer() {
  const [target, setTarget] = useState<TooltipTarget | null>(null);
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const show = (element: HTMLElement) => {
      setTarget({
        element,
        label: element.dataset.tooltip ?? "",
        position:
          element.dataset.tooltipPosition === "bottom" ? "bottom" : "top",
      });
      setRect(element.getBoundingClientRect());
    };
    const onMouseOver = (event: MouseEvent) => {
      const next = getTarget(event.target);
      if (next && next !== getTarget(event.relatedTarget)) show(next);
    };
    const onMouseOut = (event: MouseEvent) => {
      const leaving = getTarget(event.target);
      if (leaving && leaving !== getTarget(event.relatedTarget))
        setTarget(null);
    };
    const onFocusIn = (event: FocusEvent) => {
      const next = getTarget(event.target);
      if (next) show(next);
    };
    const onFocusOut = () => setTarget(null);

    document.addEventListener("mouseover", onMouseOver);
    document.addEventListener("mouseout", onMouseOut);
    document.addEventListener("focusin", onFocusIn);
    document.addEventListener("focusout", onFocusOut);
    return () => {
      document.removeEventListener("mouseover", onMouseOver);
      document.removeEventListener("mouseout", onMouseOut);
      document.removeEventListener("focusin", onFocusIn);
      document.removeEventListener("focusout", onFocusOut);
    };
  }, []);

  useEffect(() => {
    if (!target) return;
    const update = () => setRect(target.element.getBoundingClientRect());
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [target]);

  if (!target || !rect || !target.label) return null;
  const horizontalInset = Math.min(132, window.innerWidth / 2);
  const left = Math.max(
    horizontalInset,
    Math.min(window.innerWidth - horizontalInset, rect.left + rect.width / 2),
  );
  const position =
    target.position === "top" && rect.top < 90
      ? "bottom"
      : target.position === "bottom" && rect.bottom > window.innerHeight - 90
        ? "top"
        : target.position;
  const top = position === "bottom" ? rect.bottom + 10 : rect.top - 10;

  return createPortal(
    <div
      className={`tooltip-layer tooltip-layer--${position}`}
      role="tooltip"
      style={{ left, top }}
    >
      {target.label}
    </div>,
    document.body,
  );
}
