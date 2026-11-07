/** Browser event names shared by separate UI and 3D scene features. */
export const OPEN_PORTFOLIO_CHAT_EVENT = "obby-open-ai-chat";

export const GAME_CONTROL_EVENTS = {
  start: "obby-control-start",
  end: "obby-control-end",
  joystickMove: "obby-joystick-move",
} as const;

export function openPortfolioChat() {
  window.dispatchEvent(new Event(OPEN_PORTFOLIO_CHAT_EVENT));
}
