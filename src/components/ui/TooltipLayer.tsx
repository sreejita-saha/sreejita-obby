import {
  arrow,
  FloatingPortal,
  flip,
  offset,
  shift,
  useFloating,
  type Placement,
} from "@floating-ui/react";
import { useEffect, useRef, useState } from "react";
import "../../styles/ui-primitives.css";

type TooltipTarget = {
  element: HTMLElement;
  label: string;
  preferredSide: "top" | "bottom";
  lockSide: boolean;
};

function getTarget(node: EventTarget | null) {
  return node instanceof Element ? node.closest<HTMLElement>("[data-tooltip]") : null;
}

/** Uses Floating UI to keep every hint and its arrow attached to its trigger. */
export function TooltipLayer() {
  const [target, setTarget] = useState<TooltipTarget | null>(null);
  const arrowRef = useRef<HTMLDivElement>(null);
  const preferredSide = target?.preferredSide ?? "top";
  const fallbackPlacements: Placement[] =
    preferredSide === "top" ? ["bottom", "right", "left"] : ["top", "right", "left"];
  const { refs, floatingStyles, placement, middlewareData } = useFloating({
    open: Boolean(target),
    placement: preferredSide,
    middleware: [
      offset(10),
      ...(target?.lockSide ? [] : [flip({ fallbackPlacements })]),
      shift({ padding: 8 }),
      arrow({ element: arrowRef }),
    ],
  });

  useEffect(() => {
    refs.setReference(target?.element ?? null);
  }, [refs, target]);

  useEffect(() => {
    // A page restored from the browser's back/forward cache can retain the
    // previous tooltip target even though the pointer is no longer hovering it.
    const dismiss = () => setTarget(null);
    const dismissWhenHidden = () => {
      if (document.visibilityState === "hidden") dismiss();
    };

    document.addEventListener("visibilitychange", dismissWhenHidden);
    window.addEventListener("pagehide", dismiss);
    window.addEventListener("pageshow", dismiss);
    return () => {
      document.removeEventListener("visibilitychange", dismissWhenHidden);
      window.removeEventListener("pagehide", dismiss);
      window.removeEventListener("pageshow", dismiss);
    };
  }, []);

  useEffect(() => {
    const show = (element: HTMLElement) =>
      setTarget({
        element,
        label: element.dataset.tooltip ?? "",
        preferredSide: element.dataset.tooltipPosition === "bottom" ? "bottom" : "top",
        lockSide: element.dataset.tooltipLockSide === "true",
      });
    const onMouseOver = (event: MouseEvent) => {
      const next = getTarget(event.target);
      if (next && next !== getTarget(event.relatedTarget)) show(next);
    };
    const onMouseOut = (event: MouseEvent) => {
      const leaving = getTarget(event.target);
      if (leaving && leaving !== getTarget(event.relatedTarget)) setTarget(null);
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

  if (!target || !target.label) return null;
  const side = placement.split("-")[0];
  const { x: arrowX, y: arrowY } = middlewareData.arrow ?? {};
  const staticSide = {
    top: "bottom",
    right: "left",
    bottom: "top",
    left: "right",
  }[side] as "top" | "right" | "bottom" | "left";

  return (
    <FloatingPortal>
      <div
        ref={refs.setFloating}
        className="tooltip-layer"
        data-side={side}
        role="tooltip"
        style={floatingStyles}
      >
        {target.label}
        <div
          ref={arrowRef}
          className="tooltip-layer__arrow"
          style={{
            left: arrowX ?? "",
            top: arrowY ?? "",
            right: "",
            bottom: "",
            [staticSide]: "-0.38rem",
          }}
        />
      </div>
    </FloatingPortal>
  );
}
