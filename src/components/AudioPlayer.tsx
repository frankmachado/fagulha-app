import { useEffect, useRef, useState } from 'react';
import { Pause, Play, Volume2, VolumeX } from 'lucide-react';

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      audio?.pause();
    };
  }, []);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
    setIsPlaying(false);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !Number.isFinite(audio.duration) || audio.duration <= 0) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const resetProgress = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  return (
    <div className="audio-player" aria-label={title || 'Player de áudio'}>
      <audio
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onEnded={resetProgress}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="metadata"
      />
      {title && <span className="audio-player-title">{title}</span>}

      <div className="audio-player-controls">
        <button type="button" className="audio-player-button" onClick={togglePlay} aria-label={isPlaying ? 'Pausar áudio' : 'Reproduzir áudio'}>
          {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>

        <div className="audio-player-track" aria-hidden="true">
          <div className="audio-player-progress" style={{ width: `${progress}%` }} />
        </div>

        <button type="button" className="audio-player-icon-button" onClick={toggleMute} aria-label={isMuted ? 'Ativar som' : 'Silenciar áudio'}>
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </div>
    </div>
  );
}
