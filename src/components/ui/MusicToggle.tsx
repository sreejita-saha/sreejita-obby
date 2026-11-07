import { useEffect, useRef } from "react";
import { ControlIcon } from "./ControlIcon";
import "../../styles/ui/GameControls.css";
type MusicToggleProps = {
  canPlay: boolean;
  enabled: boolean;
  onToggle: () => void;
  /** Stop and discard audio when the browser backgrounds the page. */
  onUnload: () => void;
};
const MUSIC_SOURCE = "/audio/obby-theme.mp3";
const MUSIC_VOLUME = 0.05;
export function MusicToggle({
  canPlay,
  enabled,
  onToggle,
  onUnload,
}: MusicToggleProps) {
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

    // Fully discard the audio when the visitor leaves. This avoids retaining a
    // paused system media session on phones; returning visitors can opt in by
    // pressing Music again.
    const unloadAudio = () => {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
      onUnload();
    };
    const unloadWhenHidden = () => {
      if (document.visibilityState === "hidden") unloadAudio();
    };

    document.addEventListener("visibilitychange", unloadWhenHidden);
    window.addEventListener("pagehide", unloadAudio);
    window.addEventListener("pageshow", syncPlayback);
    syncPlayback();

    return () => {
      document.removeEventListener("visibilitychange", unloadWhenHidden);
      window.removeEventListener("pagehide", unloadAudio);
      window.removeEventListener("pageshow", syncPlayback);
      audio.pause();
    };
  }, [canPlay, enabled, onUnload]);
  const isOn = canPlay && enabled;
  return (
    <>
      <audio
        ref={audioRef}
        src={enabled ? MUSIC_SOURCE : undefined}
        loop
        preload={enabled ? "metadata" : "none"}
      />
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
