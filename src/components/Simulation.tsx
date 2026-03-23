import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTimer } from '../hooks/useTimer';
import { Plane, AlertCircle } from 'lucide-react';
import Globe from './Globe';

export default function Simulation({ route, onEndFlight }: { route: any, onEndFlight: (completed: boolean, secondsFlown: number) => void }) {
  const { seconds, isActive, setIsActive } = useTimer(route.duration);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, [setIsActive]);

  useEffect(() => {
    if (seconds === 0 && isActive) {
      setIsActive(false);
      onEndFlight(true, route.duration);
    }
  }, [seconds, isActive, setIsActive, onEndFlight, route.duration]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const progress = ((route.duration - seconds) / route.duration) * 100;

  const handleAbort = () => {
    setIsActive(false);
    onEndFlight(false, route.duration - seconds);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Globe route={route} progress={progress / 100} />
      </div>

      {/* HUD Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col justify-between p-8 pointer-events-none">
        {/* Top Bar */}
        <div className="flex items-start justify-between relative">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-6 min-w-[300px] pointer-events-auto">
            <div className="text-sm text-slate-400 uppercase tracking-wider mb-1">Current Flight</div>
            <div className="text-2xl font-bold flex items-center gap-3">
              {route.from} <Plane className="w-5 h-5 text-indigo-400" /> {route.to}
            </div>
          </div>
          
          {/* Center Time Remaining */}
          <div className="absolute left-1/2 -translate-x-1/2 top-0 flex flex-col items-center pointer-events-none">
            <div className="text-sm text-slate-300 uppercase tracking-widest mb-2 font-semibold drop-shadow-md">Time Remaining</div>
            <div className="text-7xl font-mono font-bold text-white drop-shadow-[0_0_15px_rgba(0,0,0,0.5)]">
              {formatTime(seconds)}
            </div>
          </div>

          <button 
            onClick={() => setShowAbortConfirm(true)}
            className="bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30 rounded-xl px-4 py-2 flex items-center gap-2 transition-colors pointer-events-auto"
          >
            <AlertCircle className="w-4 h-4" />
            Abort Flight
          </button>
        </div>

        {/* Bottom Bar - Focus Mode indicator & Progress */}
        <div className="flex flex-col items-center gap-6 w-full max-w-4xl mx-auto pointer-events-auto">
          <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-8 py-3 flex items-center gap-3">
            <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-medium tracking-wide">Focus Mode Active</span>
          </div>
          
          <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-5">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-slate-400 font-medium">{route.from} Departure</span>
              <span className="text-slate-400 font-medium">{route.to} Arrival</span>
            </div>
            <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden relative">
              <motion.div 
                className="absolute top-0 left-0 h-full bg-indigo-500"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ ease: "linear", duration: 1 }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Abort Confirmation Modal */}
      <AnimatePresence>
        {showAbortConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm pointer-events-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-slate-900 border border-slate-700 rounded-3xl p-6 w-full max-w-sm shadow-2xl relative overflow-hidden text-center"
            >
              <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Abort Flight?</h3>
              <p className="text-slate-400 mb-6">
                Are you sure you want to abort? Your focus session will end early.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowAbortConfirm(false)}
                  className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAbort}
                  className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-xl font-semibold transition-colors"
                >
                  Abort
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
