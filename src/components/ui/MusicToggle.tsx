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
    audio.volume = MUSIC_VOLUME;
    if (canPlay && enabled) void audio.play().catch(() => {});
    else audio.pause();
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
