import React from 'react';
import { IoIosAirplane } from "react-icons/io";
import { BsExclamationCircleFill } from "react-icons/bs";
import MusicPlayer from './MusicPlayer';

export default function SimulationHUD({ route, seconds, onAbort }) {

  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 pointer-events-none">
      
      <div className="flex items-start justify-between relative">

        {/* Route */}
        <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-75 pointer-events-auto">
          <div className="text-sm text-slate-400 uppercase mb-1">Current Flight</div>
          <div className="text-2xl font-bold flex items-center gap-3">
            {route.from} <IoIosAirplane className="w-5 h-5 text-indigo-400" /> {route.to}
          </div>
        </div>

        {/* Timer */}
        <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center">
          <div className="text-sm text-slate-300 uppercase mb-2">Time Remaining</div>
          <div className="text-7xl font-mono font-bold">
            {formatTime(seconds)}
          </div>
        </div>

        {/* Right */}
        <div className="flex flex-col items-end gap-4 pointer-events-none">
          <MusicPlayer />

          <button
            onClick={onAbort}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl px-4 py-2 flex items-center gap-2 pointer-events-auto"
          >
            <BsExclamationCircleFill className="w-4 h-4" />
            Abort Flight
          </button>
        </div>
      </div>
    </div>
  );
}