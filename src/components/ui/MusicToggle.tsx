import { useEffect, useRef } from "react";
import { ControlIcon } from "./ControlIcon";
type MusicToggleProps = {
  canPlay: boolean;
  enabled: boolean;
  onToggle: () => void;
};
const MUSIC_SOURCE = "/audio/obby-theme.mp3";
const MUSIC_VOLUME = 0.05;
export function MusicToggle({ canPlay, enabled, onToggle }: MusicToggleProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const syncPlayback = () => {
      audio.volume = MUSIC_VOLUME;
      if (canPlay && enabled && document.visibilityState === "visible") {
        void audio.play().catch(() => {});
      } else {
        audio.pause();
      }
    };

    // Mobile browsers can keep an open tab alive after the visitor switches
    // apps or locks their phone, so explicitly pause instead of relying on the
    // browser to suspend the audio for us.
    const pauseWhenHidden = () => syncPlayback();

    document.addEventListener("visibilitychange", pauseWhenHidden);
    window.addEventListener("pagehide", pauseWhenHidden);
    window.addEventListener("pageshow", syncPlayback);
    syncPlayback();

    return () => {
      document.removeEventListener("visibilitychange", pauseWhenHidden);
      window.removeEventListener("pagehide", pauseWhenHidden);
      window.removeEventListener("pageshow", syncPlayback);
      audio.pause();
    };
  }, [canPlay, enabled]);
  const isOn = canPlay && enabled;
  return (
    <>
      <audio ref={audioRef} src={MUSIC_SOURCE} loop preload="metadata" />
      <button
        type="button"
        className={`music-toggle ${isOn ? "is-on" : "is-off"}`}
        onClick={onToggle}
        aria-pressed={isOn}
        aria-label={
          isOn ? "Disable background music" : "Enable background music"
        }
        data-tooltip={
          isOn
            ? "Turn off the background music"
            : "Turn on the background music"
        }
        data-tooltip-lock-side="true"
      >
        <ControlIcon name={isOn ? "music" : "muted"} />
        <span>Music</span>
      </button>
    </>
  );
}
