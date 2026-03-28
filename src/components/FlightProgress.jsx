import React from 'react';
import { motion } from 'framer-motion';
import { Plane } from 'lucide-react';

export default function FlightProgress({ progress }) {
  return (
    <div className="absolute bottom-10 w-full flex justify-center z-10">
      <div className="w-full max-w-5xl px-6">

        <div className="relative mt-8">

          {/* Plane */}
          <motion.div
            className="absolute -top-10 flex flex-col items-center -ml-6 z-10"
            animate={{ left: `${progress}%` }}
            transition={{ ease: "linear", duration: 1 }}
          >
            <div className="bg-indigo-500 text-xs px-2 py-1 rounded-full mb-1">
              {Math.round(progress)}%
            </div>
            <Plane className="w-6 h-6 text-cyan-400 rotate-90" />
          </motion.div>

          {/* Bar */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              className="h-full bg-linear-to-r from-indigo-600 to-cyan-400"
              animate={{ width: `${progress}%` }}
              transition={{ ease: "linear", duration: 1 }}
            />
          </div>
        </div>

      </div>
    </div>
  );
}