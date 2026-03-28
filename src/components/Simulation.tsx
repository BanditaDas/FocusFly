import React, { useEffect, useState } from 'react';
import { useTimer } from '../hooks/useTimer';
import Globe from './Globe';

import SimulationHUD from './SimulationHUD';
import FlightProgress from './FlightProgress';
import AbortModal from './AbortModal';
import CompletionModal from './CompletionModal';

export default function Simulation({ route, onEndFlight }: { route: any, onEndFlight: (completed: boolean, secondsFlown: number) => void }) {
  const { seconds, isActive, setIsActive } = useTimer(route.duration);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showCompletionModal, setShowCompletionModal] = useState(false);

  useEffect(() => {
    setIsActive(true);
  }, [setIsActive]);

  useEffect(() => {
    if (seconds === 0 && isActive) {
      setIsActive(false);
      setShowCompletionModal(true);
    }
  }, [seconds, isActive, setIsActive]);

  const progress = ((route.duration - seconds) / route.duration) * 100;

  const handleAbort = () => {
    setIsActive(false);
    onEndFlight(false, route.duration - seconds);
  };

  const handleComplete = () => {
    setShowCompletionModal(false);
    onEndFlight(true, route.duration);
  };

  return (
    <div className="relative w-full h-screen bg-slate-950 text-white overflow-hidden">
      
      {/* 🌍 Globe */}
      <div className="absolute inset-0 z-0 opacity-80">
        <Globe route={route} progress={progress / 100} />
      </div>

      {/* 🎛 HUD */}
      <SimulationHUD
        route={route}
        seconds={seconds}
        onAbort={() => setShowAbortConfirm(true)}
      />

      {/* ✈️ Progress */}
      <FlightProgress progress={progress} />

      {/* ❌ Abort Modal */}
      <AbortModal
        open={showAbortConfirm}
        onCancel={() => setShowAbortConfirm(false)}
        onConfirm={handleAbort}
      />

      {/* ✅ Completion Modal */}
      <CompletionModal
        open={showCompletionModal}
        onConfirm={handleComplete}
      />
    </div>
  );
}