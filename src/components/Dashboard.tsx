import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Rocket, Clock, Compass } from 'lucide-react';
import Globe from './Globe';
import BookingModal from './BookingModal';

export default function Dashboard({ 
  onBookFlight, 
  totalSeconds, 
  journeys 
}: { 
  onBookFlight: (route: any) => void;
  totalSeconds: number;
  journeys: number;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const totalHours = (totalSeconds / 3600).toFixed(1);

  return (
    <div className="relative w-full h-screen bg-[#0a0a0f] text-white overflow-hidden">
      {/* 3D Background */}
      <div className="absolute inset-0 z-0 opacity-60">
        <Globe />
      </div>

      {/* UI Overlay */}
      <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-6 bg-transparent pointer-events-none">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-[420px] w-full bg-[#13121a] rounded-[2.5rem] p-10 shadow-[0_0_80px_rgba(139,92,246,0.1)] pointer-events-auto relative"
        >
          {/* Top-left accent line */}
          <div className="absolute top-0 left-8 w-12 h-[2px] bg-indigo-500/50 rounded-full" />
          
          {/* Bottom-right accent line */}
          <div className="absolute bottom-10 right-0 w-12 h-[2px] bg-teal-500/50 rounded-full" />

          <div className="text-center mb-10 mt-2">
            <h1 className="text-4xl font-bold tracking-tight mb-3 text-white">Focus Flight</h1>
            <p className="text-slate-400 text-sm">Gamify your study sessions</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-10">
            {/* Total Flown Card */}
            <div className="bg-[#1a1924] rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#2a2744] flex items-center justify-center mb-4">
                <Clock className="w-5 h-5 text-[#a78bfa]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{totalHours}h</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Total Flown</div>
            </div>
            
            {/* Journeys Card */}
            <div className="bg-[#1a1924] rounded-2xl p-6 flex flex-col items-center justify-center">
              <div className="w-10 h-10 rounded-full bg-[#1d3142] flex items-center justify-center mb-4">
                <Compass className="w-5 h-5 text-[#38bdf8]" />
              </div>
              <div className="text-3xl font-bold text-white mb-2">{journeys}</div>
              <div className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Journeys</div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full py-5 bg-gradient-to-r from-[#a78bfa] to-[#8b5cf6] hover:from-[#b49bfb] hover:to-[#9f75f7] text-[#13121a] rounded-full font-bold text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(139,92,246,0.3)] mb-8"
          >
            <Rocket className="w-5 h-5 fill-current" />
            Book a Flight
          </button>

          {/* Status Indicators */}
          <div className="flex items-center justify-center gap-8 text-[10px] font-bold tracking-widest uppercase">
            <div className="flex items-center gap-2 text-[#4ade80]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80]" />
              System Ready
            </div>
            <div className="flex items-center gap-2 text-[#38bdf8]">
              <div className="w-1.5 h-1.5 rounded-full bg-[#38bdf8]" />
              Oxygen Normal
            </div>
          </div>
        </motion.div>
      </div>

      {isModalOpen && (
        <BookingModal 
          onClose={() => setIsModalOpen(false)} 
          onConfirm={(route) => {
            setIsModalOpen(false);
            onBookFlight(route);
          }} 
        />
      )}
    </div>
  );
}
