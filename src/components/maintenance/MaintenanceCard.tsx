import "../../styles/maintenance/MaintenanceCard.css";

export function MaintenanceCard() {
  return (
    <section className="maintenance-card" aria-labelledby="maintenance-title">
      <p className="eyebrow">SREEJITA&apos;S OBBY</p>
      <h1 id="maintenance-title">A little refresh is in progress!</h1>
      <p className="maintenance-copy">
        I&apos;m busy adding some lovely new things behind the scenes. The obby
        will be back soon — brighter, better, and ready to explore.
      </p>
      <div className="status-pill">
        <span aria-hidden="true" />
        Working on it
      </div>
      <p className="sign-off">Thanks for popping by ♡</p>
    </section>
  );
}
