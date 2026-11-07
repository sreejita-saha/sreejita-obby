type WelcomeScreenProps = {
  onStart: () => void;
};

import "../../styles/screens/WelcomeScreen.css";
import "../../styles/ui-primitives.css";

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="welcome ui-panel">
      <p className="eyebrow">My tiny obby</p>
      <h1>Hi, I’m Sreejita!</h1>
      <p>Jump through my world and unlock a little more about me at every checkpoint.</p>
      <button onClick={onStart}>Start playing</button>
      <small>WASD / arrow keys to move · Space to jump</small>
    </section>
  );
}
