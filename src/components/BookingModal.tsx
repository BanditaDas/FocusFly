import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plane } from 'lucide-react';
import { CITIES, generateRoute } from '../constants/flightRoutes';

export default function BookingModal({ onClose, onConfirm }: { onClose: () => void, onConfirm: (route: any) => void }) {
  const [originCode, setOriginCode] = useState(CITIES[0].code); // Kolkata
  const [destCode, setDestCode] = useState(CITIES[1].code); // Delhi
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [route, setRoute] = useState(generateRoute(originCode, destCode));

  useEffect(() => {
    if (originCode === destCode) {
      // Prevent same origin and destination
      const newDest = CITIES.find(c => c.code !== originCode);
      if (newDest) setDestCode(newDest.code);
    } else {
      setRoute(generateRoute(originCode, destCode));
    }
  }, [originCode, destCode]);

  const handleBook = () => {
    setIsConfirmed(true);
    setTimeout(() => {
      onConfirm(route);
    }, 2000);
  };

  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) return `${hours}h ${minutes > 0 ? `${minutes}m` : ''}`;
    return `${minutes}m`;
  };

  const today = new Date().toISOString().split('T')[0].replace(/-/g, '/');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-[#1a1a1a] rounded-3xl p-8 w-full max-w-md shadow-2xl relative overflow-hidden text-white"
        style={{
          backgroundImage: 'radial-gradient(circle at center, #2a2a2a 0%, #1a1a1a 100%)',
        }}
      >
        {/* Subtle dot pattern background to simulate the map */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
          backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)',
          backgroundSize: '12px 12px'
        }}></div>

        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        <AnimatePresence mode="wait">
          {!isConfirmed ? (
            <motion.div
              key="booking-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="relative z-10"
            >
              {/* Top Section: Origin and Destination */}
              <div className="flex justify-between items-center mb-10 mt-4">
                {/* Origin */}
                <div className="flex flex-col relative group w-2/5">
                  <select 
                    value={originCode}
                    onChange={(e) => setOriginCode(e.target.value)}
                    className="appearance-none bg-transparent text-2xl md:text-3xl font-bold tracking-tight cursor-pointer focus:outline-none z-10 truncate"
                  >
                    {CITIES.map(c => (
                      <option key={c.code} value={c.code} className="text-black text-base">{c.name}</option>
                    ))}
                  </select>
                  <div className="text-slate-400 text-lg mt-1">{route.fromCode}</div>
                </div>

                {/* Center: Plane and Duration */}
                <div className="flex flex-col items-center justify-center px-2 w-1/5">
                  <Plane className="w-6 h-6 text-slate-500 mb-2 rotate-90" />
                  <div className="text-slate-300 font-medium text-sm md:text-base whitespace-nowrap">{formatDuration(route.duration)}</div>
                </div>

                {/* Destination */}
                <div className="flex flex-col items-end relative group w-2/5">
                  <select 
                    value={destCode}
                    onChange={(e) => setDestCode(e.target.value)}
                    className="appearance-none bg-transparent text-2xl md:text-3xl font-bold tracking-tight cursor-pointer focus:outline-none z-10 text-right truncate w-full"
                    dir="rtl"
                  >
                    {CITIES.map(c => (
                      <option key={c.code} value={c.code} className="text-black text-base">{c.name}</option>
                    ))}
                  </select>
                  <div className="text-slate-400 text-lg mt-1 text-right">{route.toCode}</div>
                </div>
              </div>

              {/* Bottom Section: Details */}
              <div className="grid grid-cols-2 gap-y-8 mb-10">
                <div>
                  <div className="text-slate-400 text-sm mb-1">Seat</div>
                  <div className="text-xl font-bold font-mono">07F</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-sm mb-1">Distance</div>
                  <div className="text-xl font-bold font-mono">{route.distance.toLocaleString()} km</div>
                </div>
                <div>
                  <div className="text-slate-400 text-sm mb-1">Boarding</div>
                  <div className="text-xl font-bold">Now</div>
                </div>
                <div className="text-right">
                  <div className="text-slate-400 text-sm mb-1">Date</div>
                  <div className="text-xl font-bold font-mono">{today}</div>
                </div>
              </div>

              <button
                onClick={handleBook}
                className="w-full py-4 bg-white text-black rounded-xl font-bold text-lg hover:bg-slate-200 transition-colors"
              >
                Confirm Booking
              </button>
            </motion.div>
          ) : (
            <motion.div
              key="confirmation"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 relative z-10"
            >
              <div className="w-24 h-24 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Plane className="w-12 h-12 text-emerald-400" />
              </div>
              <h3 className="text-3xl font-bold text-white mb-2">Boarding Pass Ready</h3>
              <p className="text-slate-400 mb-2">
                Your flight from {route.from} to {route.to} is confirmed.
              </p>
              <p className="text-emerald-400 font-medium">
                Prepare for takeoff...
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
