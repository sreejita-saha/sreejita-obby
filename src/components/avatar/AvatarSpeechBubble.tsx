import { Html } from "@react-three/drei";
import { OPEN_PORTFOLIO_CHAT_EVENT } from "../../config/events";
import "../../styles/avatar/AvatarSpeechBubble.css";

/** The clickable in-world introduction shown above Sreejita's avatar. */
export function AvatarSpeechBubble() {
  return (
    <Html position={[0, 6.9, -0.3]} center distanceFactor={6}>
      <div className="avatar-speech-bubble">
        <p>
          Heyy, I’m Sreejita!
          <br />
          Come explore my little world :D
        </p>
        <button
          type="button"
          onClick={() => window.dispatchEvent(new Event(OPEN_PORTFOLIO_CHAT_EVENT))}
        >
          Talk to me
        </button>
      </div>
    </Html>
  );
}
