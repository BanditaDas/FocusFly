import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, Music } from 'lucide-react';

// Using sample testing URLs. You can replace these with your own local MP3s or preferred URLs.
const SONGS = [
  { id: 1, name: 'Lofi', url: '/sounds/lofi.mp3' },
  { id: 2, name: 'cafe', url: '/sounds/cafe.mp3' },
  { id: 3, name: 'Deep Work', url: '/sounds/deep focus.mp3' }
];

export default function MusicPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(e => console.error("Audio playback failed", e));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, currentSong]);

  const togglePlay = () => setIsPlaying(!isPlaying);
  
  const nextSong = () => {
    setCurrentSong((prev) => (prev + 1) % SONGS.length);
    setIsPlaying(true);
  };

  return (
    <div className="flex items-center gap-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-3 px-5 shadow-lg pointer-events-auto">
      <Music className="w-5 h-5 text-indigo-400" />
      <div className="text-sm font-medium w-24 truncate text-slate-200">
        {SONGS[currentSong].name}
      </div>
      
      <button 
        onClick={togglePlay}
        className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"
        title={isPlaying ? "Pause" : "Play"}
      >
        {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
      </button>
      
      <button 
        onClick={nextSong}
        className="p-2 hover:bg-white/10 rounded-full transition-colors text-slate-300 hover:text-white"
        title="Switch Song"
      >
        <SkipForward className="w-5 h-5" />
      </button>

      {/* Hidden Audio Element */}
      <audio ref={audioRef} src={SONGS[currentSong].url} loop />
    </div>
  );
}