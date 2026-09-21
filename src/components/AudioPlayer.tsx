import { useEffect, useRef, useState, type ChangeEvent } from 'react';
import { Pause, Play, RotateCcw, Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { useLanguage } from '../i18n/LanguageContext';

interface AudioPlayerProps {
  src: string;
  title?: string;
  artist?: string;
}

export default function AudioPlayer({ src, title = 'Faixa sem título', artist = 'Fagulha Studio' }: AudioPlayerProps) {
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    setIsPlaying(false);
    setIsMuted(false);
    setCurrentTime(0);
    setDuration(0);

    return () => {
      audio?.pause();
    };
  }, [src]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch {
        setIsPlaying(false);
      }
      return;
    }

    audio.pause();
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const time = Number(event.target.value);
    if (!audioRef.current) return;

    audioRef.current.currentTime = time;
    setCurrentTime(time);
  };

  const resetTrack = () => {
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const resetToStart = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const formatTime = (time: number) => {
    const mins = Math.floor(time / 60);
    const secs = Math.floor(time % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="audio-player"
      aria-label={`${title} por ${artist}`}
    >
      <audio
        ref={audioRef}
        src={src}
        onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
        onTimeUpdate={() => setCurrentTime(audioRef.current?.currentTime || 0)}
        onEnded={resetTrack}
        onPause={() => setIsPlaying(false)}
        onPlay={() => setIsPlaying(true)}
        preload="metadata"
      />

      <div className="audio-player-heading">
        <div>
          <h3 className="audio-player-title">{title}</h3>
          <p className="audio-player-artist">{artist}</p>
        </div>
        <button type="button" className="audio-player-icon-button" onClick={toggleMute} aria-label={isMuted ? t('audio.unmute') : t('audio.mute')}>
          {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
        </button>
      </div>

      <div className="audio-player-seek">
        <input
          type="range"
          min={0}
          max={duration || 100}
          value={Math.min(currentTime, duration || 100)}
          onChange={handleSeek}
          aria-label={t('audio.progress')}
        />
        <div className="audio-player-time">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="audio-player-controls audio-player-main-controls">
        <button type="button" className="audio-player-icon-button" onClick={resetToStart} aria-label={t('audio.restart')}>
          <RotateCcw size={16} />
        </button>

        <button type="button" className="audio-player-button" onClick={togglePlay} aria-label={isPlaying ? t('audio.pause') : t('audio.play')}>
          {isPlaying ? <Pause size={22} fill="currentColor" /> : <Play size={22} fill="currentColor" />}
        </button>
      </div>
    </motion.div>
  );
}
