const directionalGameKeys = new Set([
  "KeyW",
  "KeyA",
  "KeyS",
  "KeyD",
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
]);

/** Remove stale button focus when the keyboard is being used to move. */
export function releaseUiFocusForMovement(event: KeyboardEvent) {
  if (!directionalGameKeys.has(event.code)) return;
  const target = event.target;
  if (target instanceof HTMLElement && target.matches("button, a, [role='button']")) {
    target.blur();
  }
}
