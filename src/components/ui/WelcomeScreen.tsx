type WelcomeScreenProps = {
  onStart: () => void;
};

export function WelcomeScreen({ onStart }: WelcomeScreenProps) {
  return (
    <section className="welcome">
      <p className="eyebrow">A tiny playable portfolio</p>
      <h1>Hi, I’m Sreejita!</h1>
      <p>Jump through my world and unlock a little more about me at every checkpoint.</p>
      <button onClick={onStart}>Start the obby <span>→</span></button>
      <small>WASD / arrow keys to move · Space to jump</small>
    </section>
  );
}
